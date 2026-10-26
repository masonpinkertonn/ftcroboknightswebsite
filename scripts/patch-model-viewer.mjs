import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// model-viewer 4.4.0 calls this hook on every orientation change, including
// outside AR. Its default null xrMode enters the world-space branch and tries
// to add a menu to a null presentedScene. Keep normal non-AR rendering working.
const path = fileURLToPath(new URL('../node_modules/@google/model-viewer/lib/three-components/ARRenderer.js', import.meta.url));
const original = '        this.onUpdateScene = () => {\n';
const patched = original + '            if (!this.isPresenting || this.presentedScene == null) return; // RoboKnights: no AR scene outside an AR session\n';
const source = readFileSync(path, 'utf8');
if (!source.includes(patched)) {
  if (source.split(original).length !== 2) {
    throw new Error('model-viewer AR update code changed; review the non-AR orientation guard.');
  }
  writeFileSync(path, source.replace(original, patched));
}
