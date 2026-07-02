# 05 — Page Catalog (รายละเอียด mockup ทุกหน้า)

> **Scope:** ตาราง reference ของ 58 mockup HTML files
> **ใช้เมื่อ:** หาหน้าที่เกี่ยวข้อง / ดูว่าหน้านี้มีอะไร / ตัดสินใจว่าจะสร้างหน้าใหม่หรือแก้ของเดิม

---

## 1. Index / Architecture / Spec (ไม่ใช่ module page)

| ไฟล์ | ชื่อ | วัตถุประสงค์ |
|-----|-----|-------------|
| `portal-mockup-index.html` | Portal Mockup Index | หน้ารวมลิ้งก์ mockup ทั้งหมด (landing) |
| `sangwijit-portal-architecture.html` | Module Architecture v3.0 | เอกสาร architecture 91 modules / 8 groups |
| `dev-handoff-spec.html` | Dev Handoff Spec | Spec สำหรับส่งต่อให้นักพัฒนา |

---

## 2. กลุ่ม SL — Sales (9 pages)

| ไฟล์ | Module | วัตถุประสงค์ | ฟิลด์หลัก |
|-----|--------|-------------|----------|
| `slq-sales-queue-mockup.html` | SL-Q | Queue รายงานงานขายรอดำเนินการ แยกตามสถานะ | รายการ Quote/Order/Invoice, SLA warning |
| `sl1-quotation-mockup.html` | SL-1 | ออกใบเสนอราคา QT-<YY>-<Running> | ลูกค้า, รายการสินค้า, ราคา, VAT, ยอดสุทธิ |
| `sl2-reservation-mockup.html` | SL-2 | จองสินค้า + ตัด stock preview | Ref quote, reservation date, item lines |
| `sl3-deposit-mockup.html` | SL-3 | รับเงินมัดจำ | Amount, payment method, reference order |
| `sl4-invoice-mockup.html` | SL-4 | บิลขายครบ 5 ส่วน (ใบกำกับ, ใบส่ง, ...) | Invoice detail, VAT breakdown, payment terms |
| `sl5-crm-followup-mockup.html` | SL-5 | ติดตามลูกค้า / Sales CRM | Activity log, next action, customer status |
| `sl6-promotion-setup-mockup.html` | SL-6 | ตั้งโปรโมชั่น (B1 conflict rule) | Priority, valid period, applicable items |
| `sl7-sales-report-mockup.html` | SL-7 | รายงานยอดขาย Dashboard | ยอดขายแยก sales/branch/product |
| `cm1-commission-mockup.html` | CM-1 | คำนวณคอมมิชชั่นรายพนักงาน | Base/Brand/Category bonus, total due |

---

## 3. กลุ่ม WH — Warehouse (5 pages)

| ไฟล์ | Module | วัตถุประสงค์ | ฟิลด์หลัก |
|-----|--------|-------------|----------|
| `wh-q-dashboard-mockup.html` | WH-Q | Queue คลังทั้งระบบ (receive/transfer/issue/count) | SLA, priority, aging |
| `wh1-receive-mockup.html` | WH-1 | รับสินค้า GRN จาก PO | PO ref, expected vs received, serial/lot |
| `wh3-transfer-mockup.html` | WH-2 | โอนย้ายระหว่างคลัง/สาขา | From-To location, transit, receive status |
| `wh4-count-mockup.html` | WH-3 | นับสต็อก + ปรับยอด | Count sheet, variance, adjustment reason |
| `wh-q2-issue-queue-mockup.html` | WH-R | เบิกสินค้า / Goods Issue | Issue type (sales/service), stock card |

---

## 4. กลุ่ม PO — Purchase (3 pages)

| ไฟล์ | Module | วัตถุประสงค์ | ฟิลด์หลัก |
|-----|--------|-------------|----------|
| `poq-purchase-queue-mockup.html` | PO-Q | Queue จัดซื้อ + PR ที่รอ | Pending PR, PO status, vendor |
| `po4-purchase-order-mockup.html` | PO-4 | ใบสั่งซื้อ PO + Approval | Vendor, item, price, terms, approvals |
| `po7-rebate-dashboard.html` | (support) | Dashboard ติดตาม Rebate ควรได้/เบิก | Vendor, target, actual, rebate amount |

---

## 5. กลุ่ม SM — SKU Management (3 pages)

| ไฟล์ | Module | วัตถุประสงค์ | ฟิลด์หลัก |
|-----|--------|-------------|----------|
| `sm1-sku-slot-planner-mockup.html` | SM-1 | วางแผน SKU slot ตามหมวด/vendor | Category, brand, allocation |
| `sm2-sku-health-mockup.html` | SM-2 | ตรวจสุขภาพ SKU (turnover, margin, non-move) | SKU metrics, action flag |
| `sm3-vendor-report-mockup.html` | SM-3 | Report vendor performance | Vendor score, delivery, quality |

---

## 6. กลุ่ม FI — Finance (5 pages)

| ไฟล์ | Module | วัตถุประสงค์ | ฟิลด์หลัก |
|-----|--------|-------------|----------|
| `fi1-ar-receive-mockup.html` | FI-1 | รับชำระลูกหนี้ | Customer, invoice ref, receipt amount |
| `fi2-ap-payment-mockup.html` | FI-2 | จ่ายชำระเจ้าหนี้ | Vendor, invoice ref, WHT calc |
| `fi3-tax-reconciliation-mockup.html` | FI-3 | กระทบยอดภาษี VAT in/out | VAT period, input vs output, diff |
| `fi4-expense-wht-mockup.html` | FI-4 | ค่าใช้จ่าย + หัก ณ ที่จ่าย | Expense type, WHT rate, WHT amount |
| `fi5-ar-audit-mockup.html` | FI-5 | ตรวจสอบลูกหนี้ | AR aging, dispute, action |

---

## 7. กลุ่ม TR — Treasury (1 page)

| ไฟล์ | Module | วัตถุประสงค์ | ฟิลด์หลัก |
|-----|--------|-------------|----------|
| `tr1-treasury-mockup.html` | TR-1 | Cash Flow + Treasury management | Bank balance, forecast, transfer |

---

## 8. กลุ่ม SV / DL — Service & Delivery (3 pages)

| ไฟล์ | Module | วัตถุประสงค์ | ฟิลด์หลัก |
|-----|--------|-------------|----------|
| `sv1-service-queue-mockup.html` | SV-Q/SV-1 | คิวงานซ่อม + intake | Job card, priority, SLA, technician |
| `sv2-service-invoice-mockup.html` | SV-2 | ใบแจ้งหนี้งานบริการ | Labor, parts, warranty status |
| `sv6-delivery-install-mockup.html` | SV-6 | จัดส่ง & ติดตั้ง + truck capacity | Route, truck load, installation |

---

## 9. กลุ่ม CL — Claims (1 page)

| ไฟล์ | Module | วัตถุประสงค์ | ฟิลด์หลัก |
|-----|--------|-------------|----------|
| `cl1-claims-mockup.html` | CL-1/2/3 | รับเคลม + ติดตาม + credit note | Claim type, status flow, refund |

---

## 10. กลุ่ม MD — Master Data (10 ไฟล์ / 5 modules)

| ไฟล์ | Module | เวอร์ชัน | วัตถุประสงค์ |
|-----|--------|---------|-------------|
| `md1-item-master-mockup.html` | MD-1 | v1 (legacy) | Item Master เดิม |
| `md1-item-master-mockup-v2.html` | MD-1 | v2 | ปรับปรุง layout |
| `md1-item-master-mockup-v3.html` | MD-1 | **v3 ✅** | ทะเบียนสินค้า (ใช้จริง) |
| `md2-customer-master-mockup.html` | MD-2 | v1 | legacy |
| `md2-customer-master-mockup-v3.html` | MD-2 | **v3 ✅** | ทะเบียนลูกค้า |
| `md3-vendor-master-mockup.html` | MD-3 | v1 | legacy |
| `md3-vendor-master-mockup-v3.html` | MD-3 | **v3 ✅** | ทะเบียน Vendor |
| `md4-employee-master-mockup.html` | MD-4 | v1 | legacy |
| `md4-employee-master-mockup-v3.html` | MD-4 | **v3 ✅** | ทะเบียนพนักงาน |
| `md5-branch-warehouse-mockup.html` | MD-5 | v1 | legacy |
| `md5-branch-warehouse-mockup-v3.html` | MD-5 | **v3 ✅** | สาขา & คลังสินค้า |

**กติกา:** ใช้ v3 เป็นหลัก, v1/v2 เก็บเป็น reference เท่านั้น (ห้ามลิ้งก์จาก sidebar)

---

## 11. กลุ่ม CF — Config (8 pages)

| ไฟล์ | Module | วัตถุประสงค์ |
|-----|--------|-------------|
| `cf1-rbac-permission-mockup.html` | CF-1 | สิทธิ์ผู้ใช้ RBAC 9 roles |
| `cf2-config-hub-mockup.html` | CF-2 | Hub ตั้งค่าระบบ (parent) |
| `cf2-1-tax-setup-mockup.html` | CF-2.1 | ตั้งค่าภาษี VAT (BC Setup) |
| `cf2-2-number-series-mockup.html` | CF-2.2 | Number Series (BC) |
| `cf2-5-tech-template-mockup.html` | CF-2.5 | Template ช่าง / technician |
| `cf2-6-approval-matrix-mockup.html` | CF-2.6 | Approval Matrix (B5 Credit Tier) |
| `cf2-7-doc-template-mockup.html` | CF-2.7 | Document Template + Running No. |
| `cf2-9-general-parameter-mockup.html` | CF-2.9 | ค่าตั้งต้นระบบ (BC) |

---

## 12. กลุ่ม AP / EX / RP — Admin / Oversight (3 pages)

| ไฟล์ | Module | วัตถุประสงค์ |
|-----|--------|-------------|
| `ap1-approval-center-mockup.html` | AP-1 | ศูนย์อนุมัติรวม (cross-module approval) |
| `ex1-executive-dashboard-mockup.html` | EX-1 | Dashboard ผู้บริหาร (multi-company) |
| `rp1-report-center-mockup.html` | RP-1 | ศูนย์รายงาน (Phase ถัดไป) |

---

## 13. กลุ่ม SC — Shared Tools (3 pages)

| ไฟล์ | Module | วัตถุประสงค์ | ใช้ที่ไหน |
|-----|--------|-------------|----------|
| `sc1-customer-search-mockup.html` | SC-1 | Search ลูกค้า component | Embed ใน SL-*, FI-1 |
| `sc2-item-search-mockup.html` | SC-2 | Search สินค้า component | Embed ใน SL-*, PO-*, WH-* |
| `sc7-timeline-mockup.html` | SC-7 | Timeline component (activity log) | Embed ใน SL-*, SV-* |

---

## 14. Version Tracking — หน้าล่าสุดของแต่ละ module

| Module | ไฟล์ล่าสุด |
|--------|-----------|
| MD-1 | `md1-item-master-mockup-v3.html` |
| MD-2 | `md2-customer-master-mockup-v3.html` |
| MD-3 | `md3-vendor-master-mockup-v3.html` |
| MD-4 | `md4-employee-master-mockup-v3.html` |
| MD-5 | `md5-branch-warehouse-mockup-v3.html` |
| อื่นๆ | ใช้ `<module>-mockup.html` (ไม่มี version suffix) |

---

## 15. ที่ยังไม่มี Mockup (P1-P2 backlog)

**Phase 1 ต้องทำก่อน BC integration:**
- FI-Q Finance Queue
- PO-1 Purchase Requisition (detail page)
- PO-2 RFQ / Vendor Compare
- PO-3 Vendor Onboarding
- PO-5 GRN (หน้าแยกจาก WH-1)
- PO-6 AP Invoice
- SL-F1 Credit Approval (workflow page)
- PM-1 ~ PM-5 Promotion/Pricing
- SV-3 Parts Requisition
- SV-4 QA Close
- WH-NM Non-Move Report

**Phase 2+:**
- CRM modules (Lead/Opportunity/Analytics)
- FI-8~FI-13 (Accrual, Fixed Asset, WHT, Dual-Book)
- CF-3~CF-9 (sub-config pages)
- Auto Replenishment, Pick/Pack/Ship
- Mobile app, B2B Customer Portal

---

## 16. ตำแหน่งไฟล์ในโครงสร้าง Module (Cross-Reference)

| ต้องการหา... | ไปที่ |
|-------------|-------|
| รายละเอียด module หลัก | `01-module-list.md` |
| SOP ของ module นี้ | `skills/sangwijit-<dept>/` |
| Flow cross-module | `00-overview.md` 7 |
| ฟิลด์ BC ที่ผูก | `04-bc365-integration.md` 2 |
