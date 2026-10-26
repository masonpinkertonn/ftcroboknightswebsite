"""Convert the source STEP into a simplified exploded GLB. Requires cadquery-ocp, trimesh, numpy."""
from pathlib import Path
import json
import numpy as np
import trimesh
from OCP.IFSelect import IFSelect_RetDone
from OCP.TopExp import TopExp_Explorer
from OCP.TopAbs import TopAbs_SOLID, TopAbs_FACE, TopAbs_REVERSED
from OCP.TopoDS import TopoDS
from OCP.Bnd import Bnd_Box
from OCP.BRepBndLib import BRepBndLib
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.BRep import BRep_Tool
from OCP.TopLoc import TopLoc_Location
root=Path(__file__).resolve().parents[1]
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.TDocStd import TDocStd_Document
from OCP.TCollection import TCollection_ExtendedString
from OCP.XCAFDoc import XCAFDoc_DocumentTool
from OCP.XCAFPrs import XCAFPrs
from OCP.collections import Sequence_TDF_Label, IndexedDataMap_TopoDS_Shape_XCAFPrs_Style_TopTools_ShapeMapHasher
from OCP.TopoDS import TopoDS_Iterator
from OCP.Quantity import Quantity_TOC_sRGB
source=root/'Small Drive Base.step'
print('Reading STEP geometry and original colors',flush=True)
doc=TDocStd_Document(TCollection_ExtendedString('Robot'))
r=STEPCAFControl_Reader();r.SetColorMode(True)
assert r.ReadFile(str(source)) == IFSelect_RetDone
assert r.Transfer(doc)
tool=XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
roots=Sequence_TDF_Label();tool.GetFreeShapes(roots)
styles=IndexedDataMap_TopoDS_Shape_XCAFPrs_Style_TopTools_ShapeMapHasher()
for i in range(1,roots.Length()+1):
 XCAFPrs.CollectStyleSettings_s(roots.Value(i),TopLoc_Location(),styles)
def color_for(shape,inherited):
 index=styles.FindIndex(shape)
 if index:
  style=styles.FindFromIndex(index)
  if style.IsSetColorSurf():
   return tuple(round(v*255) for v in style.GetColorSurf().Values(Quantity_TOC_sRGB))
 return inherited
parts=[]
def collect(shape,inherited=(180,180,180)):
 color=color_for(shape,inherited)
 if shape.ShapeType()==TopAbs_SOLID:
  s=TopoDS.Solid(shape);b=Bnd_Box();BRepBndLib.Add_s(s,b)
  bounds=np.array([b.CornerMin().Coord(),b.CornerMax().Coord()])
  parts.append((s,bounds,color));return
 children=TopoDS_Iterator(shape)
 while children.More():
  collect(children.Value(),color);children.Next()
for i in range(1,roots.Length()+1):collect(tool.GetShape_s(roots.Value(i)))
print('Collected color styles:',styles.Extent(),flush=True)
allbounds=np.array([b for _,b,_ in parts]); lo=allbounds[:,0].min(0);hi=allbounds[:,1].max(0);center=(lo+hi)/2;size=hi-lo
print('Parts:',len(parts),'bounds mm:',lo,hi,flush=True)
scene=trimesh.Scene(); report={'source':'Small Drive Base.step','source_parts':len(parts),'bounds_mm':[lo.tolist(),hi.tolist()],'omitted_small_parts':0,'transparent_plate_candidates':[],'triangles':0,'parts':[]}
materials={}
def material_for(rgb):
 if rgb not in materials:
  materials[rgb]=trimesh.visual.material.PBRMaterial(name='STEP RGB '+str(rgb),baseColorFactor=[*rgb,255],metallicFactor=.15,roughnessFactor=.65,alphaMode='OPAQUE',doubleSided=False)
 return materials[rgb]
for i,(s,bounds,color) in enumerate(parts):
 dims=bounds[1]-bounds[0];d=np.sort(dims)
 if abs(d[0]-6)<.15 and d[1]>40:
  report['transparent_plate_candidates'].append({'part':i,'dimensions_mm':dims.tolist()})
 BRepMesh_IncrementalMesh(s,1.2,False,.5,True)
 verts=[];faces=[];face_colors=[];ex=TopExp_Explorer(s,TopAbs_FACE)
 while ex.More():
  face=TopoDS.Face(ex.Current());loc=TopLoc_Location();tri=BRep_Tool.Triangulation_s(face,loc)
  if tri is not None:
   face_color=color_for(face,color)
   base=len(verts);t=loc.Transformation()
   for j in range(1,tri.NbNodes()+1):
    p=tri.Node(j).Transformed(t);verts.append((p.X(),p.Y(),p.Z()))
   for j in range(1,tri.NbTriangles()+1):
    a,b,cidx=tri.Triangle(j).Get()
    face_colors.append(face_color)
    faces.append((base+a-1,base+cidx-1,base+b-1) if face.Orientation()==TopAbs_REVERSED else (base+a-1,base+b-1,base+cidx-1))
  ex.Next()
 if not faces:continue
 v=np.asarray(verts)-center
 # CAD Z-up to glTF Y-up; millimeters to meters.
 v=np.column_stack((v[:,0],v[:,2],-v[:,1]))*.001
 face_array=np.asarray(faces);colors=np.asarray(face_colors)
 for rgb_array in np.unique(colors,axis=0):
  rgb=tuple(int(v) for v in rgb_array)
  mesh=trimesh.Trimesh(v,face_array[np.all(colors==rgb_array,axis=1)],process=False)
  mesh.remove_unreferenced_vertices()
  mesh.visual=trimesh.visual.TextureVisuals(material=material_for(rgb))
  name=f'part-{i}-rgb-{rgb[0]}-{rgb[1]}-{rgb[2]}'
  scene.add_geometry(mesh,node_name=name,geom_name=name)
 report['triangles']+=len(faces);report['parts'].append({'part':i,'triangles':len(faces),'dimensions_mm':dims.tolist()})
 if i%50==0:print('Meshed',i,'triangles',report['triangles'],flush=True)
path=Path('/tmp/roboknights-assembled.glb');scene.export(str(path))
report['material_colors_rgb']=[list(rgb) for rgb in materials]
report['all_parts_opaque']=True
report['included_6mm_plates']=len(report['transparent_plate_candidates'])
report['output_bytes']=path.stat().st_size
(root/'public/models/robot-conversion.json').write_text(json.dumps(report,indent=2))
print('DONE', {k:v for k,v in report.items() if k not in ['parts','transparent_plate_candidates']},'plate candidates',len(report['transparent_plate_candidates']),flush=True)
