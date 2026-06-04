// Coordinates the homepage preloader with the hero intro. On first load the
// Preloader plays a 0→100 count; the hero's rush must NOT begin until that
// curtain lifts away. This module is the hand-off: the Preloader calls
// `openIntroGate()` as it starts its exit, and HeroSequence registers via
// `onIntroGateOpen()` to start its timeline at that moment.
//
// Module scope = per JS runtime, which gives exactly the behaviour we want:
//  - Hard refresh → fresh module, gate closed → preloader plays, hero waits.
//  - Client-side nav back to home → module still loaded, gate already open →
//    hero starts immediately and the preloader skips. This matches
//    HeroSequence's own `introPlayed` flag, so the two stay in lock-step.

let open = false;
const waiters = new Set<() => void>();

/** Open the gate (idempotent). Notifies and clears any registered waiters. */
export function openIntroGate() {
  if (open) return;
  open = true;
  for (const cb of waiters) cb();
  waiters.clear();
}

/**
 * Run `cb` once the gate is open. If it's already open, `cb` runs synchronously.
 * Returns an unsubscribe function for cleanup.
 */
export function onIntroGateOpen(cb: () => void): () => void {
  if (open) {
    cb();
    return () => {};
  }
  waiters.add(cb);
  return () => waiters.delete(cb);
}

/** Whether the gate is already open (used by the Preloader to decide to skip). */
export function isIntroGateOpen() {
  return open;
}
