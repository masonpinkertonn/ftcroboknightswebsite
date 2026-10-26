"""Remove named Pollen assembly components, preserving a local source backup."""
from pathlib import Path
import json, shutil
from OCP.STEPCAFControl import STEPCAFControl_Reader, STEPCAFControl_Writer
from OCP.TDocStd import TDocStd_Document
from OCP.TCollection import TCollection_ExtendedString
from OCP.TDataStd import TDataStd_Name
from OCP.TDF import TDF_Label
from OCP.collections import Sequence_TDF_Label as TDF_LabelSequence
from OCP.XCAFDoc import XCAFDoc_DocumentTool
from OCP.IFSelect import IFSelect_RetDone
from OCP.BRepTools import BRepTools
from OCP.TopExp import TopExp_Explorer
from OCP.TopAbs import TopAbs_SOLID
root=Path(__file__).resolve().parents[1];source=root/'Small Drive Base.step'
backup=root/'.cad-backups/Small Drive Base.original.step';backup.parent.mkdir(exist_ok=True)
if not backup.exists():shutil.copy2(source,backup)
doc=TDocStd_Document(TCollection_ExtendedString('Robot'))
r=STEPCAFControl_Reader();r.SetNameMode(True)
print('Reading assembly names and geometry',flush=True)
assert r.ReadFile(str(source))==IFSelect_RetDone
assert r.Transfer(doc)
tool=XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
def name(label):
 a=TDataStd_Name()
 return a.Get().ToExtString() if label.FindAttribute(TDataStd_Name.GetID_s(),a) else ''
def count(shape):
 ex=TopExp_Explorer(shape,TopAbs_SOLID);n=0
 while ex.More():n+=1;ex.Next()
 return n
roots=TDF_LabelSequence();tool.GetFreeShapes(roots);assert roots.Length()==1
main=roots.Value(1);before=count(tool.GetShape_s(main))
shapes=TDF_LabelSequence();tool.GetShapes(shapes);removals=[];definitions=[]
for i in range(1,shapes.Length()+1):
 label=shapes.Value(i)
 if 'pollen' in name(label).lower():definitions.append(label)
 components=TDF_LabelSequence();tool.GetComponents_s(label,components,False)
 for j in range(1,components.Length()+1):
  child=components.Value(j);ref=TDF_Label();tool.GetReferredShape_s(child,ref)
  if 'pollen' in (name(child)+' '+name(ref)).lower():removals.append((child,name(child),name(ref)))
print('Matched components:',[(n,r) for _,n,r in removals],flush=True)
assert len(removals)==4, f'Expected 4 Pollen instances; got {len(removals)}'
for label,_,_ in removals:tool.RemoveComponent(label)
tool.UpdateAssemblies()
for label in definitions:assert tool.RemoveShape(label,True)
tool.UpdateAssemblies();after=count(tool.GetShape_s(main));assert after<before
print('Solids before/after:',before,after,flush=True)
w=STEPCAFControl_Writer();w.SetNameMode(True);assert w.Transfer(doc)
out=root/'Small Drive Base.cleaned.step';assert w.Write(str(out))==IFSelect_RetDone
with out.open() as f:
 assert not any('pollen' in line.lower() for line in f), 'Pollen names remain in exported STEP'
out.replace(source)
BRepTools.Write_s(tool.GetShape_s(main),'/tmp/roboknights-source.brep')
(root/'docs/pollen-removal.json').write_text(json.dumps({'removed':[{'instance':n,'definition':r} for _,n,r in removals],'solids_before':before,'solids_after':after,'backup':str(backup.relative_to(root))},indent=2))
print('Cleaned STEP and conversion cache saved',flush=True)
