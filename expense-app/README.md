# Sangwijit Expense Management

โปรเจ็คนี้**แยกต่างหาก**จาก Sangwijit ERP Portal mockup ที่อยู่ root ของ repo — เป็นแอปบริหารค่าใช้จ่ายแบบ Google Sheets-backed ไม่เกี่ยวกับ BC365 portal

## ส่วนประกอบ

- `Code.gs` — Google Apps Script backend (ผูกกับ Google Sheet, doGet/doPost API, auth โดเมน `sangwijit.co.th`, แจ้งเตือนผ่าน LINE Messaging + email, AuditLog) ดูคำสั่ง deploy ที่หัวไฟล์
- `index.html` — SPA frontend (Sarabun, Chart.js, dashboard งบ vs จ่ายจริง, multi-entity SWT/SWE/WMN/WPS) ทำงานเป็น HTML template ที่ Apps Script `doGet()` เสิร์ฟ หรือเปิดนอก Apps Script โดยตั้ง `APPS_SCRIPT_URL`

## Deploy

ดูขั้นตอนใน comment block ส่วนหัวของ `Code.gs` (Extensions → Apps Script → เพิ่ม Code.gs + HTML file ชื่อ `index` → Deploy เป็น Web app)
