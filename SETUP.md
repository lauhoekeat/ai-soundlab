# Secure setup · AI SoundLab

The four-mission frontend and secured proxy follow the approved POC. Owner approved public repository visibility for free Pages on 25 October 2026. Node 22 or later and Git are required. Run commands from the repository directory. The app is https://lauhoekeat.github.io/ai-soundlab/ and the hosted proxy is https://ai-soundlab-proxy.ai-soundlab.workers.dev . The original diagnostic remains available with `?diagnostic`.

## 1. Install and validate without a key

```powershell
npm ci
npm run check
npm run proxy:dry
node scripts/init-local.mjs
```

The last command exclusively creates ignored `proxy/.env`, with random class access code and IP-hash salt. It never overwrites an existing file and prints no values. AI starts disabled. This server env is deliberately outside Vite's root env loading. Do not create `VITE_OPENAI_API_KEY` or put any provider secret in the root `.env`, frontend, GitHub secrets, issues or chat.

## 2. Add your existing key locally, only after the runtime checks pass

Open `proxy/.env` privately in your editor. Set `OPENAI_API_KEY` to your existing restricted project key, set `AI_ENABLED=true`, preserve the generated `CLASS_CODE` and `IP_HASH_SECRET`, and save. Do not paste the file or key in chat. `git check-ignore proxy/.env` must print `proxy/.env`. Never run commands that print the env file. The only public frontend variable is `VITE_PROXY_URL` (a URL, not a credential).

Open two terminals:

```powershell
npm run proxy:dev
```

```powershell
npm run dev
```

Open `http://127.0.0.1:5173/ai-soundlab/`. Privately copy `CLASS_CODE` from the server env into **Kod kelas & persetujuan** in an AI panel, not the OpenAI key. Class code remains in tab memory; do not embed it in source or URL. Tick text-only consent. Test M1 with your own ruler observation, then M4 with a student-labelled safe sound and reason/mitigation. Feedback is live only when returned by the proxy; failures remain explicit. To inspect the original diagnostic, append `?diagnostic`.

Optional transport check (makes **two paid provider requests**, no automatic retries):

```powershell
npm run test:live
```

This prints synthetic adult fixture feedback and latency, never the credential. It does not automatically pass science or real-device gates. Keep school/pupil information out of fixtures. Stop both terminals after testing. Rotate the class code if exposed. To disable AI, set `AI_ENABLED=false` and restart the Worker.

## 3. Hosted serverless proxy

Cloudflare login is required for deployment. The owner completed sign-in and the protected proxy has been deployed; these steps remain for reproducible setup/maintenance. Do not use an anonymous temporary hosting account for a pupil app. Confirm Workers/Durable Objects plan terms and quotas in your own account.

```powershell
npx wrangler login
```

Change `proxy/wrangler.jsonc` `ALLOWED_ORIGINS` to the exact Pages origin `https://lauhoekeat.github.io` (an Origin has no `/ai-soundlab/` path). Retain localhost only while required. Use three separate private prompts to upload server-side secrets:

```powershell
npx wrangler secret put OPENAI_API_KEY --config proxy/wrangler.jsonc
npx wrangler secret put CLASS_CODE --config proxy/wrangler.jsonc
npx wrangler secret put IP_HASH_SECRET --config proxy/wrangler.jsonc
```

Paste values only into Wrangler's private terminal prompt. Provider key minimum privileges and model/project access must be verified. Set `AI_ENABLED=true` in server vars only after testing. Then `npm run proxy:deploy`. Keep the returned HTTPS Worker URL for the public `VITE_PROXY_URL`. Durable storage is for atomic quota counters only; no pupil/audio/answer database. Host logs are disabled by config; do not add request-body logging.

## 4. GitHub Pages

GitHub Free normally serves Pages from public repositories. Owner has explicitly approved public source for this project; the publication check must still confirm no key in tracked history or frontend bundle. Historical planning-only privacy restrictions are superseded by docs/approvals.md.

Repository Settings → Pages → Source: GitHub Actions. The repository **Actions variable** `VITE_PROXY_URL` is set to `https://ai-soundlab-proxy.ai-soundlab.workers.dev`. It is a public URL, not a secret. No provider key or class code in GitHub. Merge the tested branch; Actions → Deploy AI SoundLab → Run workflow. The workflow uses Pages environment and OIDC, and runs checks before upload. Site URL: `https://lauhoekeat.github.io/ai-soundlab/`. Check successful workflow status before claiming a new version is live.

Release check: open HTTPS site on teacher laptop and physical mobile; verify class code, consent, two live AI interactions, capture permissions/stop/playback, text-only network requests, quota rejection, IndexedDB reload/export/clear, science teacher signoff and exact competition eligibility/submission instructions. Record evidence in docs/2026-10-25/POC-REPORT.md. Do not call a diagnostic site competition-ready.

## 5. Trial-data cleanup and fallback

No names/login. Record objects, not people. Audio is memory-only and disappears on reload/exit or Delete audio. IndexedDB keeps anonymous text until Clear all records; exported JSON files must be deleted separately. AI requires internet and a working proxy. If unavailable, retain answers and use a visibly labelled teacher example; never present it as AI feedback. Full offline assets and multi-device class aggregation are outside this POC.
