# docx Pattern Reference — กลุ่มแสงวิจิตร

## Dependencies

```bash
npm install docx  # version 8.x
```

```js
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, SimpleField, PageBreak, AlignmentType, WidthType,
  BorderStyle, ShadingType, VerticalAlign, LevelFormat
} = require("docx");
const fs = require("fs");
```

---

## Color Palette (C object)

```js
const FONT = "TH Sarabun New";
const C = {
  navy:   "1A1A2E",   // header / section titles
  blue:   "1565C0",   // sub-headers
  lblue:  "1976D2",   // borders, accents
  lblue2: "BBDEFB",   // career path cell
  gold:   "F57F17",   // left-border accent on duty blocks
  orange: "E65100",   // TBD box / warning
  green:  "2E7D32",   // salary section header
  lgreen: "C8E6C9",   // career path cell
  steel:  "546E7A",   // career path cell
  darkt:  "263238",   // dark teal
  white:  "FFFFFF",
  lgray:  "F5F5F5",
};
```

---

## Core Helper Functions

### Text Runs
```js
const t = (text, color="222222", size=22) =>
  new TextRun({ text, font: FONT, size, color });

const b = (text, color=C.navy, size=22) =>
  new TextRun({ text, font: FONT, size, color, bold: true });
```

### Paragraph
```js
const para = (children, opts={}) => new Paragraph({
  children,
  alignment: opts.align || AlignmentType.LEFT,
  spacing: opts.spacing || { before: 60, after: 60 },
  ...(opts.numbering ? { numbering: opts.numbering } : {})
});
```

### Section Header (colored bar)
```js
function sectionHeader(text, color=C.navy) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        left:   { style: BorderStyle.SINGLE, size: 16, color },
        right:  { style: BorderStyle.NONE },
      },
      shading: { fill: C.lgray, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 160, right: 160 },
      children: [para([b(text, color, 23)], { spacing: { before: 0, after: 0 } })]
    })]})],
  });
}
```

### Info Table (2-column key-value)
```js
function infoTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2400, 6960],
    rows: rows.map(([label, value], i) => new TableRow({ children: [
      new TableCell({
        borders: { top: {style:BorderStyle.SINGLE,size:4,color:"E0E0E0"},
                   bottom: {style:BorderStyle.SINGLE,size:4,color:"E0E0E0"},
                   left: {style:BorderStyle.NONE}, right: {style:BorderStyle.NONE} },
        shading: { fill: i%2===0 ? "EEF2FF" : "F5F7FF", type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [para([b(label, C.navy, 20)], { spacing: { before: 0, after: 0 } })]
      }),
      new TableCell({
        borders: { top: {style:BorderStyle.SINGLE,size:4,color:"E0E0E0"},
                   bottom: {style:BorderStyle.SINGLE,size:4,color:"E0E0E0"},
                   left: {style:BorderStyle.NONE}, right: {style:BorderStyle.NONE} },
        shading: { fill: i%2===0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [para([t(value, "333333", 20)], { spacing: { before: 0, after: 0 } })]
      }),
    ]}))
  });
}
```

### Compensation Table
```js
function compTable(rows) {
  // rows: [label, ทดลองงาน, บรรจุ]
  const bdr = { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" };
  const borders = { top: bdr, bottom: bdr, left: bdr, right: bdr };
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: [
        new TableCell({ borders, shading:{fill:C.green,type:ShadingType.CLEAR},
          margins:{top:80,bottom:80,left:120,right:120},
          children:[para([b("รายการ",C.white,20)],{spacing:{before:0,after:0}})] }),
        new TableCell({ borders, shading:{fill:C.green,type:ShadingType.CLEAR},
          margins:{top:80,bottom:80,left:120,right:120},
          children:[para([b("ทดลองงาน",C.white,20)],{spacing:{before:0,after:0},align:AlignmentType.CENTER})] }),
        new TableCell({ borders, shading:{fill:C.green,type:ShadingType.CLEAR},
          margins:{top:80,bottom:80,left:120,right:120},
          children:[para([b("บรรจุ",C.white,20)],{spacing:{before:0,after:0},align:AlignmentType.CENTER})] }),
      ]}),
      ...rows.map(([label, trial, full], i) => new TableRow({ children: [
        new TableCell({ borders, shading:{fill:i%2===0?"F1F8E9":"FFFFFF",type:ShadingType.CLEAR},
          margins:{top:60,bottom:60,left:120,right:120},
          children:[para([b(label,C.navy,20)],{spacing:{before:0,after:0}})] }),
        new TableCell({ borders, shading:{fill:i%2===0?"F1F8E9":"FFFFFF",type:ShadingType.CLEAR},
          margins:{top:60,bottom:60,left:120,right:120},
          children:[para([t(trial,"444444",20)],{spacing:{before:0,after:0},align:AlignmentType.CENTER})] }),
        new TableCell({ borders, shading:{fill:i%2===0?"F1F8E9":"FFFFFF",type:ShadingType.CLEAR},
          margins:{top:60,bottom:60,left:120,right:120},
          children:[para([t(full,"444444",20)],{spacing:{before:0,after:0},align:AlignmentType.CENTER})] }),
      ]}))
    ]
  });
}
```

### KPI Table
```js
function kpiTable(rows) {
  // rows: [indicator, weight, unit, target, score5, score4, score3, score2]
  const bdr = { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" };
  const borders = { top: bdr, bottom: bdr, left: bdr, right: bdr };
  const hdr = (txt) => new TableCell({ borders,
    shading:{fill:C.navy,type:ShadingType.CLEAR},
    margins:{top:60,bottom:60,left:100,right:100},
    children:[para([b(txt,C.white,18)],{spacing:{before:0,after:0},align:AlignmentType.CENTER})] });
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 700, 800, 1000, 1000, 1000, 1000, 1060],
    rows: [
      new TableRow({ children: ["ตัวชี้วัด","น้ำหนัก","หน่วย","เป้าหมาย","⭐⭐⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐","⭐⭐"].map(hdr) }),
      ...rows.map(([ind,wt,unit,tgt,s5,s4,s3,s2], i) => new TableRow({ children: [
        new TableCell({ borders, shading:{fill:i%2===0?"F8F9FA":"FFFFFF",type:ShadingType.CLEAR},
          margins:{top:60,bottom:60,left:100,right:100}, children:[para([t(ind,"222222",19)],{spacing:{before:0,after:0}})] }),
        ...[wt,unit,tgt,s5,s4,s3,s2].map(v => new TableCell({ borders,
          shading:{fill:i%2===0?"F8F9FA":"FFFFFF",type:ShadingType.CLEAR},
          margins:{top:60,bottom:60,left:80,right:80},
          children:[para([t(v,"333333",19)],{spacing:{before:0,after:0},align:AlignmentType.CENTER})] }))
      ]}))
    ]
  });
}
```

### Bullet List
```js
function bulletList(items) {
  return items.map(text => new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 21, color: "333333" })],
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 30, after: 30 },
  }));
}
```

### Page Title Block
```js
function pageTitle(docCode, position, subtitle) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 8, color: C.navy },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: C.lblue },
        left:   { style: BorderStyle.SINGLE, size: 24, color: C.gold },
        right:  { style: BorderStyle.NONE },
      },
      shading: { fill: "F0F4FF", type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 240, right: 240 },
      children: [
        para([b(position, C.navy, 32)], { spacing: { before: 0, after: 40 } }),
        para([t(subtitle, C.blue, 20)], { spacing: { before: 0, after: 40 } }),
        para([t(`รหัสเอกสาร: ${docCode}`, "888888", 18)], { spacing: { before: 0, after: 0 } }),
      ]
    })]})],
  });
}
```

### TableCell Helper
```js
function cell(children, opts={}) {
  const bdr = { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" };
  return new TableCell({
    borders: { top: bdr, bottom: bdr, left: bdr, right: bdr },
    shading: { fill: opts.bg || C.white, type: ShadingType.CLEAR },
    margins: opts.margins || { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    children,
  });
}
```

---

## Document Wrapper Pattern

```js
const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0,
    format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
  }]}]},
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },  // A4
        margin: { top: 1000, right: 900, bottom: 1000, left: 900 }
      }
    },
    headers: { default: new Header({ children: [/* header table */] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      children: [
        new TextRun({ text: "CONFIDENTIAL — สำหรับใช้ภายในองค์กรเท่านั้น  |  หน้า ", font: FONT, size: 16, color: "888888" }),
        new SimpleField("PAGE"),
      ],
      alignment: AlignmentType.CENTER,
    })]})},
    children: allContent,
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outputPath, buf);
  console.log("Saved:", outputPath);
});
```

---

## TBD Box Pattern

ใช้เมื่อข้อมูลยังไม่ครบ (เช่น เงินเดือน/Commission ยังไม่ได้ตกลง):

```js
function tbdBox(fields) {
  const lines = fields.map(f => `• ${f}`).join("  |  ");
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 4,  color: C.orange },
        bottom: { style: BorderStyle.SINGLE, size: 4,  color: C.orange },
        left:   { style: BorderStyle.SINGLE, size: 12, color: C.orange },
        right:  { style: BorderStyle.NONE },
      },
      shading: { fill: "FFF3E0", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 160, right: 160 },
      children: [
        para([b("⚠️  ต้องการข้อมูลเพิ่มเติม (TBD)", C.orange, 20)]),
        para([t(lines, "444444", 19)])
      ]
    })]})],
  });
}
```

**กฎ TBD:** ต้องมี TBD Summary Page ท้ายไฟล์เสมอ ถ้ามี TBD ≥ 1 จุดในไฟล์

---

## Output Path

```
/mnt/user-data/outputs/[ชื่อไฟล์].docx
```

Validate หลัง generate:
```bash
python3 /home/claude/scripts/office/validate.py /mnt/user-data/outputs/[file].docx
```
