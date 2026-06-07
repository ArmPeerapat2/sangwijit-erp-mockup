import sys, zipfile, re
path = sys.argv[1]
ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
import xml.etree.ElementTree as ET
z = zipfile.ZipFile(path)
xml = z.read('word/document.xml').decode('utf-8', 'ignore')
root = ET.fromstring(xml)
out = []
for p in root.iter(ns+'p'):
    # heading style?
    style = ''
    pPr = p.find(ns+'pPr')
    if pPr is not None:
        ps = pPr.find(ns+'pStyle')
        if ps is not None:
            style = ps.get(ns+'val','')
    text = ''.join(t.text or '' for t in p.iter(ns+'t'))
    if not text.strip():
        continue
    if 'Heading' in style or 'Title' in style:
        out.append('\n## [%s] %s' % (style, text))
    else:
        out.append(text)
# also tables
for tbl in root.iter(ns+'tbl'):
    out.append('  [TABLE]')
print('\n'.join(out))
