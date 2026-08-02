import { FONT_FAMILY, sanitizeFontFamily } from './fonts.js';
import type { Scene } from './types.js';

export function normalizeSceneForRender(scene: Scene): Scene {
  return {
    ...scene,
    nodes: scene.nodes.map((node) => {
      if (node.type !== 'text') return node;
      return {
        ...node,
        fontFamily: sanitizeFontFamily(node.fontFamily),
      };
    }),
  };
}

export { FONT_FAMILY };
