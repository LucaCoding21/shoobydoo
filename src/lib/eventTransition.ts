// Handshake for the homepage → event-gallery shared-element transition.
// Mirrors lib/introGate's pattern: module-scoped singletons instead of React
// context, so the grid (HeroSequence), the persistent overlay
// (EventTransitionLayer, mounted in the root layout) and the destination hero
// (EventHero) can talk across a route change without any shared tree.
//
// Flow: the grid calls beginEventTransition() with the clicked tile's rendered
// image + viewport rect, then client-navigates. The overlay paints a clone at
// that rect and covers the swap with a scrim. When the gallery page mounts,
// PhotoGallery reports its FIRST grid tile (which shows the same thumbnail —
// the gallery prepends it) via transitionTargetMounted(); the overlay measures
// it and morphs the clone from home-tile rect to grid-tile rect, then
// dissolves.

export type EventTransitionPayload = {
  /** Exact src the tile was showing (img.currentSrc) so the clone is a cache hit. */
  src: string;
  alt: string;
  /** Tile rect in viewport coordinates at click time. */
  rect: { top: number; left: number; width: number; height: number };
  href: string;
};

let beginListener: ((p: EventTransitionPayload) => void) | null = null;
let targetListener: ((el: HTMLElement) => void) | null = null;

export function onEventTransitionBegin(
  cb: (p: EventTransitionPayload) => void,
): () => void {
  beginListener = cb;
  return () => {
    if (beginListener === cb) beginListener = null;
  };
}

/**
 * Kick off the transition. Returns false when the overlay isn't mounted —
 * the caller should fall back to a plain navigation in that case.
 */
export function beginEventTransition(p: EventTransitionPayload): boolean {
  if (!beginListener) return false;
  beginListener(p);
  return true;
}

export function onTransitionTargetMount(
  cb: (el: HTMLElement) => void,
): () => void {
  targetListener = cb;
  return () => {
    if (targetListener === cb) targetListener = null;
  };
}

/**
 * Called by PhotoGallery with its first grid tile on mount. A no-op unless a
 * transition is in flight.
 */
export function transitionTargetMounted(el: HTMLElement): void {
  targetListener?.(el);
}
