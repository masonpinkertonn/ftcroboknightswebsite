"""Simplify and spatially batch the converted robot for browser rendering."""
from pathlib import Path
import json
import numpy as np
import trimesh
root=Path(__file__).resolve().parents[1]
p=Path('/tmp/roboknights-assembled.glb')
scene=trimesh.load(p,force='scene')
original_faces=sum(len(g.faces) for g in scene.geometry.values())
original_bytes=p.stat().st_size
bins={};lo,hi=scene.bounds
for name in scene.graph.nodes_geometry:
 transform,geo=scene.graph[name];m=scene.geometry[geo].copy();mat=m.visual.material
 m.apply_transform(transform);m.merge_vertices()
 target=max(80,int(len(m.faces)*min(1,180000/max(original_faces,1))))
 if len(m.faces)>target:
  m=m.simplify_quadric_decimation(face_count=target,aggression=5)
 m.visual=trimesh.visual.TextureVisuals(material=mat)
 key=tuple(np.minimum(3,np.maximum(0,((m.centroid-lo)/(hi-lo)*4).astype(int))))
 key=(key,tuple(mat.baseColorFactor.tolist()))
 bins.setdefault(key,[]).append(m)
result=trimesh.Scene()
for key,meshes in bins.items():
 combined=trimesh.util.concatenate(meshes)
 combined.visual=trimesh.visual.TextureVisuals(material=meshes[0].visual.material)
 result.add_geometry(combined,node_name=str(key))
p=root/'public/models/robot-scroll.glb'
result.export(p)
report_path=root/'public/models/robot-conversion.json';report=json.loads(report_path.read_text())
report['optimization']={'input_triangles':original_faces,'output_triangles':sum(len(m.faces) for m in result.geometry.values()),'draw_groups':len(bins),'before_bytes':original_bytes,'output_bytes':p.stat().st_size}
report_path.write_text(json.dumps(report,indent=2));print(report['optimization'])

# Add a deterministic translation animation for each spatial group.
import struct
raw=p.read_bytes();json_len=struct.unpack_from('<I',raw,12)[0]
gltf=json.loads(raw[20:20+json_len]);binary=bytearray(raw[28+json_len:])
def accessor(values,kind):
 data=np.asarray(values,dtype='<f4');offset=len(binary);binary.extend(data.tobytes())
 view=len(gltf['bufferViews']);gltf['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':data.nbytes})
 index=len(gltf['accessors']);entry={'bufferView':view,'componentType':5126,'count':len(data),'type':kind}
 if kind=='SCALAR':entry.update(min=[float(data.min())],max=[float(data.max())])
 gltf['accessors'].append(entry);return index
times=accessor([0,1],'SCALAR');animation={'name':'Explode','samplers':[],'channels':[]}
for i,node in enumerate(gltf['nodes']):
 if 'mesh' not in node:continue
 mesh=result.geometry[result.graph[node['name']][1]]
 c=mesh.bounds.mean(axis=0);extent=np.maximum((hi-lo)/2,.001)
 direction=c/extent;strength=max(0,float(np.max(np.abs(direction)))-.2)
 delta=c*strength*2.5
 output=accessor([[0,0,0],delta.tolist()],'VEC3')
 node.pop('matrix',None);node['translation']=[0,0,0]
 animation['channels'].append({'sampler':len(animation['samplers']),'target':{'node':i,'path':'translation'}})
 animation['samplers'].append({'input':times,'output':output,'interpolation':'LINEAR'})
# Rotate the complete assembly gently around its vertical (Y) axis.
root_index=len(gltf['nodes']);scene_index=gltf.get('scene',0)
gltf['nodes'].append({'name':'ScrollRotation','children':gltf['scenes'][scene_index]['nodes']})
gltf['scenes'][scene_index]['nodes']=[root_index]
angle=np.deg2rad(50)/2
rotation=accessor([[0,0,0,1],[0,float(np.sin(angle)),0,float(np.cos(angle))]],'VEC4')
animation['channels'].append({'sampler':len(animation['samplers']),'target':{'node':root_index,'path':'rotation'}})
animation['samplers'].append({'input':times,'output':rotation,'interpolation':'LINEAR'})
gltf['animations']=[animation];gltf['buffers'][0]['byteLength']=len(binary)
js=json.dumps(gltf,separators=(',',':')).encode();js+=b' '*((-len(js))%4);binary.extend(b'\0'*((-len(binary))%4))
length=12+8+len(js)+8+len(binary)
p.write_bytes(struct.pack('<III',0x46546c67,2,length)+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(binary),0x004e4942)+binary)
print('Animated groups:',len(animation['channels']),'bytes:',p.stat().st_size)

report['optimization']['output_bytes']=p.stat().st_size
report['animation']={'name':'Explode','duration_seconds':1,'groups':len(animation['channels'])}
report_path.write_text(json.dumps(report,indent=2))

# Keep scroll framing synchronized with the exported geometry and animation.
import runpy
runpy.run_path(str(root / 'scripts/measure_robot_framing.py'))
