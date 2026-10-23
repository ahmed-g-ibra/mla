import zipfile, sys, re
import xml.etree.ElementTree as ET
NS='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
path=sys.argv[1]
z=zipfile.ZipFile(path)
ss=[]
try:
    root=ET.fromstring(z.read('xl/sharedStrings.xml'))
    for si in root:
        ss.append(''.join(t.text or '' for t in si.iter(NS+'t')))
except KeyError: pass
wb=ET.fromstring(z.read('xl/workbook.xml'))
rels=ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
RNS='{http://schemas.openxmlformats.org/package/2006/relationships}'
relmap={r.get('Id'):r.get('Target') for r in rels}
for sheet in wb.iter(NS+'sheet'):
    rid=sheet.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
    tgt=relmap[rid].lstrip('/')
    if not tgt.startswith('xl/'): tgt='xl/'+tgt
    print('=== SHEET:', sheet.get('name'), tgt)
    s=ET.fromstring(z.read(tgt))
    rows=[]
    for row in s.iter(NS+'row'):
        cells={}
        for c in row.iter(NS+'c'):
            ref=c.get('r'); col=re.match(r'[A-Z]+',ref).group()
            v=c.find(NS+'v'); isel=c.find(NS+'is')
            val=None
            if c.get('t')=='s' and v is not None: val=ss[int(v.text)]
            elif isel is not None: val=''.join(t.text or '' for t in isel.iter(NS+'t'))
            elif v is not None: val=v.text
            cells[col]=val
        rows.append((row.get('r'),cells))
    print('rows:',len(rows))
    for r,c in rows[:int(sys.argv[2]) if len(sys.argv)>2 else 3]:
        print(r, c)
