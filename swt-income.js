// swt-income.js — single source: ประเภทเงินได้ (VAT + WHT + GL) · แหล่งอัตราเดียวของระบบ
// เทียบระบบเดิม (2026-07-25): รวม CSWTAXTYPE(WHT) + CSTAXGROUP(VAT) + posting(GL) 3 ตาราง → "ประเภทเงินได้" ตัวเดียว (ตั้งใจ · Q2ข 07-21)
// ใช้: cf-master-settings (แก้ไข) · fi4 (dropdown+banner อ่านอย่างเดียว) · fi12 (rate-grid อ่านอย่างเดียว)
// ฐาน WHT = ก่อน VAT · GL = อ้างรหัส BC (CF-2.3 เจ้าของ) · ห้ามพิมพ์อัตราเองที่ fi4/fi12
window.SWT_INCOME = [
  {code:'GOODS',    name:'ค่าสินค้า',              vat:'7%',    wht:'0%', gl:'5010 ต้นทุนสินค้า', pnd:'-'},
  {code:'SERVICE',  name:'ค่าบริการ / จ้างทำของ',   vat:'7%',    wht:'3%', gl:'5310 ค่าบริการ',    pnd:'3/53'},
  {code:'RENT',     name:'ค่าเช่า',                vat:'ยกเว้น', wht:'5%', gl:'5320 ค่าเช่า',      pnd:'3/53'},
  {code:'ADV',      name:'ค่าโฆษณา',              vat:'7%',    wht:'2%', gl:'5330 ค่าโฆษณา',    pnd:'53'},
  {code:'TRANSPORT',name:'ค่าขนส่ง',              vat:'7%',    wht:'1%', gl:'5340 ค่าขนส่ง',    pnd:'53'},
  {code:'PROF',     name:'ค่าวิชาชีพ / ที่ปรึกษา / สอบบัญชี', vat:'7%', wht:'3%', gl:'5350 ค่าที่ปรึกษา', pnd:'3/53'}
];
// helper: อัตรา wht เป็นตัวเลข (ตัด %) สำหรับ dropdown value
window.SWT_INCOME_WHTNUM = function(w){ return parseInt((w||'0').replace('%',''),10) || 0; };
