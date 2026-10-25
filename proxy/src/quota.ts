export interface Limits { classMinute: number; ipMinute: number; day: number; month: number; }
export interface CounterState { minute: number; day: string; month: string; classes: Record<string, number>; ips: Record<string, number>; daily: number; monthly: number; }
export function reserve(previous: CounterState | undefined, limits: Limits, classId: string, ipId: string, now = Date.now()): CounterState | null {
  const date = new Date(now).toISOString();
  const minute = Math.floor(now / 60000), day = date.slice(0, 10), month = date.slice(0, 7);
  const state: CounterState = { minute, day, month,
    classes: previous?.minute === minute ? { ...previous.classes } : {}, ips: previous?.minute === minute ? { ...previous.ips } : {},
    daily: previous?.day === day ? previous.daily : 0, monthly: previous?.month === month ? previous.monthly : 0 };
  if ((state.classes[classId] ?? 0) >= limits.classMinute || (state.ips[ipId] ?? 0) >= limits.ipMinute || state.daily >= limits.day || state.monthly >= limits.month) return null;
  state.classes[classId] = (state.classes[classId] ?? 0) + 1;
  state.ips[ipId] = (state.ips[ipId] ?? 0) + 1;
  state.daily++; state.monthly++;
  return state;
}
