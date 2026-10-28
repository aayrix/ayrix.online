/**
 * Backward compatibility facade for Ayrix 3D Engine
 * Re-exports from ayrix-universe.js
 */

export { AyrixUniverse as Ayrix3DEngine, initCard3DTilt, init3DEntrance } from './ayrix-universe.js';

export function initHeader3DParticles() {
  // Gracefully handled by the persistent Three.js universe
  return true;
}
