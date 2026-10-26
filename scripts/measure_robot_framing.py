"""Measure origin-centered bounds for the generated Explode animation.

Rotations preserve these radii. Linear interpolation between sampled radii is
conservative because each vertex follows a linear translation before rotation.
"""
from pathlib import Path
import json, struct
import numpy as np
root = Path(__file__).resolve().parents[1]
raw = (root / 'public/models/robot-scroll.glb').read_bytes()
json_length = struct.unpack_from('<I', raw, 12)[0]
gltf = json.loads(raw[20:20 + json_length])
binary_start = 28 + json_length

def values(index):
    accessor = gltf['accessors'][index]
    view = gltf['bufferViews'][accessor['bufferView']]
    assert accessor['componentType'] == 5126 and 'byteStride' not in view
    columns = {'SCALAR': 1, 'VEC3': 3, 'VEC4': 4}[accessor['type']]
    offset = binary_start + view.get('byteOffset', 0) + accessor.get('byteOffset', 0)
    return np.frombuffer(raw, dtype='<f4', count=accessor['count'] * columns, offset=offset).reshape(-1, columns).astype(float)

animation = next(a for a in gltf['animations'] if a['name'] == 'Explode')
radii = np.zeros(41)
for channel in animation['channels']:
    if channel['target']['path'] != 'translation':
        continue  # Root rotation does not affect distance from the origin.
    node = gltf['nodes'][channel['target']['node']]
    sampler = animation['samplers'][channel['sampler']]
    assert sampler['interpolation'] == 'LINEAR'
    translations = values(sampler['output'])
    assert translations.shape == (2, 3)
    for primitive in gltf['meshes'][node['mesh']]['primitives']:
        vertices = values(primitive['attributes']['POSITION'])
        for i, progress in enumerate(np.linspace(0, 1, len(radii))):
            positions = vertices + translations[0] * (1 - progress) + translations[1] * progress
            radii[i] = max(radii[i], np.linalg.norm(positions, axis=1).max())
assert np.all(radii > 0)
(root / 'robot-framing.json').write_text(json.dumps({'radii_m': radii.tolist()}, indent=2) + '\n')
print('Framing radii, assembled/expanded:', radii[0], radii[-1])
