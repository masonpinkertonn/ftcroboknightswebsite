"""Remove the verified detached solid, using its original CAD bounds."""
from pathlib import Path
import json,shutil
import numpy as np
from OCP.STEPCAFControl import STEPCAFControl_Reader,STEPCAFControl_Writer
from OCP.TDocStd import TDocStd_Document
from OCP.TCollection import TCollection_ExtendedString
from OCP.TDataStd import TDataStd_Name
from OCP.TDF import TDF_Label
from OCP.collections import Sequence_TDF_Label
from OCP.XCAFDoc import XCAFDoc_DocumentTool
from OCP.IFSelect import IFSelect_RetDone
from OCP.TopLoc import TopLoc_Location
from OCP.BRepTools import BRepTools
from OCP.Bnd import Bnd_Box
from OCP.BRepBndLib import BRepBndLib
from OCP.TopExp import TopExp_Explorer
from OCP.TopAbs import TopAbs_SOLID
root=Path(__file__).resolve().parents[1];source=root/'Small Drive Base.step'
backup=root/'.cad-backups/Small Drive Base.before-isolated-removal.step'
if not backup.exists():shutil.copy2(source,backup)
doc=TDocStd_Document(TCollection_ExtendedString('Robot'));r=STEPCAFControl_Reader();r.SetNameMode(True)
print('Reading named assembly',flush=True);assert r.ReadFile(str(source))==IFSelect_RetDone;assert r.Transfer(doc)
tool=XCAFDoc_DocumentTool.ShapeTool_s(doc.Main());roots=Sequence_TDF_Label();tool.GetFreeShapes(roots);assert roots.Length()==1;main=roots.Value(1)
def name(label):
 a=TDataStd_Name();return a.Get().ToExtString() if label.FindAttribute(TDataStd_Name.GetID_s(),a) else ''
def count(shape):
 ex=TopExp_Explorer(shape,TopAbs_SOLID);n=0
 while ex.More():n+=1;ex.Next()
 return n
target=np.array([[-21.864310705374752,-17.757885185600678,-208.27744025289098],[21.864310705376187,25.970736225150564,-195.53160671955746]])
found=[]
def visit(label,location,path):
 cs=Sequence_TDF_Label();tool.GetComponents_s(label,cs,False)
 for i in range(1,cs.Length()+1):
  c=cs.Value(i);ref=TDF_Label();tool.GetReferredShape_s(c,ref);s=tool.GetShape_s(c).Moved(location)
  b=Bnd_Box();BRepBndLib.Add_s(s,b)
  if b.IsVoid():continue
  bounds=np.array([b.CornerMin().Coord(),b.CornerMax().Coord()])
  if np.allclose(bounds,target,atol=.02) and count(s)==1:found.append((c,ref,path+[name(c)]));continue
  if tool.IsAssembly_s(ref):visit(ref,location.Multiplied(tool.GetLocation_s(c)),path+[name(c)])
visit(main,TopLoc_Location(),[name(main)])
assert len(found)==1,[(p) for _,_,p in found]
print('Isolated component:',found[0][2],flush=True)
before=count(tool.GetShape_s(main));c,ref,path=found[0];tool.RemoveComponent(c);tool.UpdateAssemblies()
# Remove the definition only if unused after deleting the occurrence.
tool.RemoveShape(ref,True);tool.UpdateAssemblies();after=count(tool.GetShape_s(main));assert before-after==1
writer=STEPCAFControl_Writer();writer.SetNameMode(True);assert writer.Transfer(doc)
out=root/'Small Drive Base.cleaned.step';assert writer.Write(str(out))==IFSelect_RetDone;out.replace(source)
BRepTools.Write_s(tool.GetShape_s(main),'/tmp/roboknights-source.brep')
(root/'docs/isolated-part-removal.json').write_text(json.dumps({'removed_path':path,'bounds_mm':target.tolist(),'nearest_other_solid_gap_mm':122,'solids_before':before,'solids_after':after,'backup':str(backup.relative_to(root))},indent=2))
print('Saved cleaned STEP; solids:',before,after,flush=True)
