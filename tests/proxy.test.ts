import { afterEach, describe, expect, it, vi } from 'vitest';
import { handle, readCapped, type Env } from '../proxy/src/index';
const origin = 'http://127.0.0.1:5173';
const code = 'test-class-code-not-a-secret';
const input = { mission: 'vibration', language: 'bm', observation: 'Pembaris bergerak.', explanation: 'Pembaris bergetar.', mitigation: '' };
function environment(quotaStatus = 200): Env {
  return { AI_ENABLED: 'true', OPENAI_API_KEY: 'test-only-not-real', CLASS_CODE: code, IP_HASH_SECRET: 'test-only-ip-hash-secret-32-characters', ALLOWED_ORIGINS: origin, CLASS_PER_MINUTE: '12', IP_PER_MINUTE: '20', DAILY_LIMIT: '200', MONTHLY_LIMIT: '2000', QUOTA: { idFromName: () => 'id', get: () => ({ fetch: async () => new Response('{}', { status: quotaStatus }) }) } as unknown as Env['QUOTA'] };
}
function request(body: unknown = input, headers: Record<string, string> = {}, method = 'POST', path = '/api/feedback') {
  return new Request(`https://proxy.test${path}`, { method, headers: { Origin: origin, 'Content-Type': 'application/json', 'X-Class-Code': code, ...headers }, ...(method === 'GET' || method === 'OPTIONS' ? {} : { body: JSON.stringify(body) }) });
}
const completed = (text = JSON.stringify({ concept: 'vibration', evidenceExcerpt: 'Pembaris' })) => ({ status: 'completed', output: [{ type: 'reasoning' }, { type: 'message', content: [{ type: 'output_text', text }] }] });
afterEach(() => vi.useRealTimers());
describe('proxy boundary', () => {
  it.each(['https://evil.example', 'null', ''])('rejects origin %s before provider call', async value => { const provider = vi.fn(); expect((await handle(request(input, { Origin: value }), environment(), provider)).status).toBe(403); expect(provider).not.toHaveBeenCalled(); });
  it('rejects missing Origin', async () => { const r = request(); r.headers.delete('Origin'); expect((await handle(r, environment())).status).toBe(403); });
  it('allows exact preflight, rejects extra headers/methods', async () => {
    const good = await handle(request(null, { 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type,x-class-code' }, 'OPTIONS'), environment());
    expect(good.status).toBe(204); expect(good.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    expect((await handle(request(null, { 'Access-Control-Request-Method': 'DELETE' }, 'OPTIONS'), environment())).status).toBe(403);
    expect((await handle(request(null, { 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'authorization' }, 'OPTIONS'), environment())).status).toBe(403);
  });
  it('rejects method/path, disabled and incomplete config', async () => {
    expect((await handle(request(null, {}, 'GET'), environment())).status).toBe(405);
    expect((await handle(request(input, {}, 'POST', '/v1/responses'), environment())).status).toBe(404);
    expect((await handle(request(), { ...environment(), AI_ENABLED: 'false' })).status).toBe(503);
    expect((await handle(request(), { ...environment(), CLASS_CODE: 'short' })).status).toBe(503);
  });
  it('health reveals only enabled flag and no secrets', async () => { const r = await handle(request(null, {}, 'GET', '/api/health'), environment()); expect(await r.json()).toEqual({ status: 'ok', aiEnabled: true }); });
  it.each(['', 'wrong'])('rejects code %s', async codeValue => { const provider = vi.fn(); expect((await handle(request(input, { 'X-Class-Code': codeValue }), environment(), provider)).status).toBe(401); expect(provider).not.toHaveBeenCalled(); });
  it('rejects wrong content type and invalid schemas', async () => { expect((await handle(request(input, { 'Content-Type': 'text/plain' }), environment())).status).toBe(415); expect((await handle(request({ ...input, audio: 'data' }), environment())).status).toBe(400); });
  it('caps declared and actual chunked body bytes', async () => {
    expect((await handle(request(input, { 'Content-Length': '9000' }), environment())).status).toBe(413);
    expect((await handle(request('x'.repeat(9000)), environment())).status).toBe(413);
    const stream = new ReadableStream<Uint8Array>({ start(c) { c.enqueue(new Uint8Array(5)); c.enqueue(new Uint8Array(5)); c.close(); } });
    await expect(readCapped(stream, 8)).rejects.toThrow('too_large');
  });
  it.each([429, 503])('quota %i fails closed without upstream call', async status => { const provider = vi.fn(); expect((await handle(request(), environment(status), provider)).status).toBe(status); expect(provider).not.toHaveBeenCalled(); });
  it('bad limit configuration cannot bypass quota', async () => { const provider = vi.fn(); expect((await handle(request(), { ...environment(), DAILY_LIMIT: 'NaN' }, provider)).status).toBe(503); expect(provider).not.toHaveBeenCalled(); });
  it.each(['vibration', 'detective'])('returns bounded text for %s from fixed endpoint only', async mission => {
    const provider = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) => new Response(JSON.stringify(completed())));
    const r = await handle(request({ ...input, mission, mitigation: mission === 'detective' ? 'Kurangkan hon.' : '' }), environment(), provider);
    expect(r.status).toBe(200); expect((await r.json() as { source: string }).source).toBe('openai');
    expect(provider.mock.calls[0][0]).toBe('https://api.openai.com/v1/responses');
    const sent = JSON.parse(provider.mock.calls[0][1]!.body as string); expect(sent.store).toBe(false); expect(sent.max_output_tokens).toBe(400);
    expect(r.headers.get('Cache-Control')).toBe('no-store');
  });
  it.each([{}, { status: 'incomplete', output: [] }, completed(''), completed('x'.repeat(1601)), completed('No next question.'), completed('What? Why?'), { status: 'completed', output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'no' }] }] }])('rejects malformed/refused/incomplete output %#', async output => { expect((await handle(request(), environment(), async () => new Response(JSON.stringify(output)))).status).toBe(502); });
  it('caps provider body and redacts provider errors', async () => {
    expect((await handle(request(), environment(), async () => new Response('x'.repeat(33000)))).status).toBe(502);
    const r = await handle(request(), environment(), async () => new Response('sensitive provider detail', { status: 401 }));
    expect(await r.text()).not.toContain('sensitive');
  });
  it('aborts slow provider without retry', async () => {
    vi.useFakeTimers();
    const provider = vi.fn(async (_url, init) => new Promise<Response>((_resolve, reject) => init!.signal!.addEventListener('abort', () => reject(new Error('aborted')))));
    const result = handle(request(), environment(), provider);
    // Let crypto/quota asynchronous work settle before advancing provider timeout.
    await vi.waitFor(() => expect(provider).toHaveBeenCalledOnce());
    await vi.advanceTimersByTimeAsync(20001);
    expect((await result).status).toBe(502); expect(provider).toHaveBeenCalledOnce();
  });
});
