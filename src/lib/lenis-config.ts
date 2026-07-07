import type { LenisOptions } from 'lenis'

/**
 * Shared Lenis tuning for the global page scroll and every SmoothScrollArea,
 * so sensitivity stays consistent across the app.
 *
 * Sensitivity knobs:
 * - `wheelMultiplier` / `touchMultiplier`: distance travelled per input.
 *   Higher = more sensitive (moves further per wheel notch / swipe).
 * - `lerp`: smoothing (0–1). Higher = snappier / catches up faster,
 *   lower = softer / floatier.
 */
export const DEFAULT_LENIS_OPTIONS = {
	lerp: 0.11,
	wheelMultiplier: 1.3,
	touchMultiplier: 1.3
} satisfies LenisOptions
