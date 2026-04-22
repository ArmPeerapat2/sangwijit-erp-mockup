# 01 — Module List (91 modules / 8 groups)

> **Source:** `sangwijit-portal-architecture.html` v3.0 + 58 mockup HTML files
> **Legend:** ✅ = Core / 🆕 = NEW / ⭐ = Phase ถัดไป / 📋 = มี Mockup แล้ว

---

## 1. Prefix Code — ความหมาย

| Prefix | ความหมาย | หมวด |
|--------|---------|------|
| `SL-` | Sales / การขาย | 1 |
| `PM-` | Promotion / Price List | 1 |
| `CM-` | Commission | 1 |
| `PO-` | Purchase / จัดซื้อ | 2 |
| `SM-` | SKU / Slot Management | 2 |
| `WH-` | Warehouse / คลัง | 3 |
| `FI-` | Finance / บัญชี-การเงิน | 4 |
| `TR-` | Treasury | 4 |
| `SV-` | Service | 5 |
| `CL-` | Claim | 5 |
| `DL-` | Delivery | 5 |
| `MD-` | Master Data | 6 |
| `CF-` | Config / System Setup | 6 |
| `AP-` | Approval Center | 6 |
| `EX-` | Executive Dashboard | 6 |
| `RP-` | Report Center | 6 |
| `SC-` | Search / Shared tools | ทุกหมวด |
| `IA-` | Integration API | 8 |

**Suffix พิเศษ:**
- `-Q` = Queue Dashboard (รายการรอดำเนินการ)
- `-F1/F2` = Flow / Workflow-specific
- `-R` = Return / Reverse / Refund

---

## 2. กลุ่ม 1 — ขายและสัมพันธ์ลูกค้า (15 modules)

| Code | ชื่อ | สถานะ | Mockup |
|------|-----|------|--------|
| SL-Q | Sales Queue Dashboard | ✅ | 📋 `slq-sales-queue-mockup.html` |
| SL-1 | Quotation ใบเสนอราคา | ✅ | 📋 `sl1-quotation-mockup.html` |
| SL-2 | Reservation ใบจอง | ✅ | 📋 `sl2-reservation-mockup.html` |
| SL-3 | Deposit รับมัดจำ | ✅ | 📋 `sl3-deposit-mockup.html` |
| SL-4 | Invoice บิลขาย | ✅ | 📋 `sl4-invoice-mockup.html` |
| SL-5 | Credit Memo / CRM Followup | ✅ | 📋 `sl5-crm-followup-mockup.html` |
| SL-6 | Promotion Setup | ✅ | 📋 `sl6-promotion-setup-mockup.html` |
| SL-7 | Sales Report | ✅ | 📋 `sl7-sales-report-mockup.html` |
| SL-F1 | Credit Approval (ฝั่ง Sales) | ✅ B5 | — |
| PM-1 | Price List | ✅ | — |
| PM-2 | Promotion Scheme | ✅ B1 | — |
| PM-3 | Step Discount / Bundle | ✅ | — |
| PM-4 | Quota | ✅ | — |
| PM-5 | Simulator (VAT Rule + Net Cost) | ✅ | — |
| CM-1 | Commission | ✅ | 📋 `cm1-commission-mockup.html` |
| PM-5 | VAT Simulator (Golden Rule sandbox) | ✅ 🆕 | 📋 `pm5-vat-simulator-mockup.html` |
| ⭐ CRM Lead/Opportunity | Phase ถัดไป |  | — |
| ⭐ Sales Analytics | Phase ถัดไป |  | — |
| ⭐ B2B Customer Portal | Phase ถัดไป |  | — |

---

## 3. กลุ่ม 2 — จัดซื้อและลูกโซ่อุปทาน (12 modules)

| Code | ชื่อ | สถานะ | Mockup |
|------|-----|------|--------|
| PO-Q | Purchase Queue Dashboard | ✅ | 📋 `poq-purchase-queue-mockup.html` |
| PO-1 | Purchase Requisition (PR) | ✅ | — |
| PO-2 | RFQ / Vendor Compare | ✅ | — |
| PO-3 | Vendor Onboarding | ✅ | — |
| PO-4 | Purchase Order (PO) | ✅ B5 | 📋 `po4-purchase-order-mockup.html` |
| PO-5 | GRN (ใบรับสินค้า) | ✅ | — |
| PO-6 | AP Invoice | ✅ | — |
| PO-7 | Sale-In Accrual | 🆕 | — |
| PO-8 | Deposit Bill (บิลฝาก) | 🆕 | — |
| — | Rebate Dashboard | (support) | 📋 `po7-rebate-dashboard.html` |
| SM-1 | SKU Slot Planner | ✅ | 📋 `sm1-sku-slot-planner-mockup.html` |
| SM-2 | SKU Health Monitor | ✅ | 📋 `sm2-sku-health-mockup.html` |
| SM-3 | Vendor Report | ✅ | 📋 `sm3-vendor-report-mockup.html` |
| ⭐ Contract Management | Phase ถัดไป |  | — |
| ⭐ Vendor Evaluation | Phase ถัดไป |  | — |
| ⭐ Demand Planning | Phase ถัดไป |  | — |

---

## 4. กลุ่ม 3 — สินค้าคงคลัง / คลังสินค้า (9 modules)

| Code | ชื่อ | สถานะ | Mockup |
|------|-----|------|--------|
| WH-Q | Warehouse Queue (SLA) | ✅ | 📋 `wh-queue-mockup.html` |
| WH-1 | GRN + Transfer Receipt | ✅ | 📋 `wh1-grn-mockup.html` |
| WH-2 | Stock Transfer | ✅ | 📋 `wh2-stock-transfer-mockup.html` |
| WH-3 | Sales Issue / Stock Count | ✅ | 📋 `wh4-stock-count-mockup.html` |
| WH-4 | Stock Count | ✅ | (รวมกับ WH-3) |
| WH-R | Stock Card / Goods Issue | ✅ | 📋 `wh3-sales-issue-mockup.html` |
| WH-NM | Non-Move Report | 🆕 | — |
| ⭐ Auto Replenishment | Phase ถัดไป |  | — |
| ⭐ Pick / Pack / Ship | Phase ถัดไป |  | — |

---

## 5. กลุ่ม 4 — การเงินและบัญชี (15 modules)

| Code | ชื่อ | สถานะ | Mockup |
|------|-----|------|--------|
| FI-Q | Finance Queue Dashboard | ✅ 🆕 | 📋 `fiq-finance-queue-mockup.html` |
| FI-1 | AR Receipt | ✅ | 📋 `fi1-ar-receive-mockup.html` |
| FI-2 | AP Payment | ✅ | 📋 `fi2-ap-payment-mockup.html` |
| FI-3 | Bank Reconciliation / Tax | ✅ | 📋 `fi3-tax-reconciliation-mockup.html` |
| FI-4 | Journal Voucher / Expense WHT | ✅ | 📋 `fi4-expense-wht-mockup.html` |
| FI-5 | Expense Voucher (P2) / AR Audit | (P2) | 📋 `fi5-ar-audit-mockup.html` |
| FI-6 | Credit Control | (P2) | — |
| FI-7 | Period Close | (P3) | — |
| FI-8 | Accrual Monitor | 🆕 | — |
| FI-9 | Fixed Asset Create + Depreciation | 🆕 F | — |
| FI-10 | FA Disposal by Sale | 🆕 | — |
| FI-11 | FA Write-Off | 🆕 | — |
| FI-12 | WHT (ภ.ง.ด.3/53) | 🆕 | — |
| FI-13 | Dual-Book (A หลัก / B ภาษี) · Entity Tag 1/2/3/novat | ✅ 🆕 | 📋 `fi13-dual-book-mockup.html` |
| TR-1 | Treasury / Cash Management | ✅ | 📋 `tr1-treasury-mockup.html` |
| ⭐ Report Center | Phase ถัดไป |  | 📋 `rp1-report-center-mockup.html` |

---

## 6. กลุ่ม 5 — บริการและหลังการขาย (9 modules)

| Code | ชื่อ | สถานะ | Mockup |
|------|-----|------|--------|
| SV-Q | Service Queue | ✅ | 📋 `sv1-service-queue-mockup.html` |
| SV-1 | Service Intake | ✅ | (รวมกับ SV-Q) |
| SV-2 | Job Card / Service Invoice | ✅ | 📋 `sv2-service-invoice-mockup.html` |
| SV-3 | Parts Requisition | ✅ | — |
| SV-4 | QA Close | ✅ | — |
| SV-6 | Delivery & Installation | ✅ | 📋 `sv6-delivery-install-mockup.html` |
| CL-1 | Claim Intake | ✅ | 📋 `cl1-claims-mockup.html` |
| CL-2 | Claim Tracking | ✅ | — |
| CL-3 | Claim Credit Note | ✅ | — |
| ⭐ Fleet/Vehicle Tracking | Phase ถัดไป |  | — |

---

## 7. กลุ่ม 6 — Master Data + Config (17 modules)

### Master Data (MD)
| Code | ชื่อ | สถานะ | Mockup |
|------|-----|------|--------|
| MD-1 | Item Master | ✅ | 📋 `md1-item-master-mockup-v3.html` |
| MD-2 | Customer Master | ✅ | 📋 `md2-customer-master-mockup-v3.html` |
| MD-3 | Vendor Master | ✅ | 📋 `md3-vendor-master-mockup-v3.html` |
| MD-4 | Employee Master | ✅ | 📋 `md4-employee-master-mockup-v3.html` |
| MD-5 | Branch & Warehouse | ✅ | 📋 `md5-branch-warehouse-mockup-v3.html` |
| MD-6 | Price List | ✅ | — |

### Config (CF)
| Code | ชื่อ | สถานะ | Mockup |
|------|-----|------|--------|
| CF-1 | RBAC (9 roles) / Tax Setup | ✅ | 📋 `cf1-rbac-permission-mockup.html` |
| CF-2 | System Config Hub | ✅ | 📋 `cf2-config-hub-mockup.html` |
| CF-2.1 | Tax Setup (BC) | ✅ | 📋 `cf2-1-tax-setup-mockup.html` |
| CF-2.2 | Number Series (BC) | ✅ | 📋 `cf2-2-number-series-mockup.html` |
| CF-2.5 | Technician Template | ✅ | 📋 `cf2-5-tech-template-mockup.html` |
| CF-2.6 | Approval Matrix | ✅ B5 | 📋 `cf2-6-approval-matrix-mockup.html` |
| CF-2.7 | Document Template | ✅ | 📋 `cf2-7-doc-template-mockup.html` |
| CF-2.9 | General Parameter (BC) | ✅ | 📋 `cf2-9-general-parameter-mockup.html` |
| CF-3~8 | Posting Groups / Bin / etc. | ✅ | (รวมใน CF-2) |
| CF-9 | Entity Tag (บัญชี 2 เล่ม) | 🆕 D | — |

### Admin / Oversight
| Code | ชื่อ | สถานะ | Mockup |
|------|-----|------|--------|
| AP-1 | Approval Center | ✅ | 📋 `ap1-approval-center-mockup.html` |
| EX-1 | Executive Dashboard | ✅ | 📋 `ex1-executive-dashboard-mockup.html` |
| ⭐ DMS | Phase ถัดไป |  | — |

---

## 8. กลุ่ม 7 — การปฏิบัติตามกฎหมายไทย (9 modules)

| Code | ชื่อ | สถานะ | Note |
|------|-----|------|------|
| — | VAT Input/Output | ✅ | รวมใน FI-3 |
| — | WHT (ภ.ง.ด.3/53) | ✅ | = FI-12 |
| — | e-Tax Invoice | ✅ | Generate ออก SL-4 |
| — | e-Filing | (P3) | P3 |
| — | Digital Signature | ✅ | ใช้กับ e-Tax Invoice |
| — | TFRS Reporting | ✅ | รายงานประจำปี |
| — | Buddhist Era Date | ✅ | ทุกหน้าต้อง พ.ศ. |
| — | FX Rate | ✅ | ใช้ใน WPS Export |
| — | PDPA Compliance | ✅ | Log + Consent |

---

## 9. กลุ่ม 8 — BI / Mobile / E-Commerce / API (10 modules)

| Code | ชื่อ | สถานะ |
|------|-----|------|
| ⭐ Management Dashboard | Phase ถัดไป |  |
| ⭐ Mobile App | Phase ถัดไป |  |
| ⭐ B2B E-Commerce | Phase ถัดไป |  |
| IA-Q | BC Sync Monitor (Integration Dashboard) | ✅ 🆕 📋 `iaq-bc-sync-monitor-mockup.html` |
| IA-1 | BC Sync Monitor (detail view · รวมใน IA-Q) | ✅ (ฝังใน IA-Q) |
| IA-2 | Error Log & Retry | ✅ |
| IA-3 | Webhook Config | ✅ |
| IA-4 | Marketplace Connector | (P3) |
| IA-5 | BC Entity Explorer | (P3) |

---

## 10. Mockup ที่ไม่อยู่ใน Architecture (Shared Tools)

| Code | ชื่อ | Mockup |
|------|-----|-------|
| SC-1 | Customer Search | 📋 `sc1-customer-search-mockup.html` |
| SC-2 | Item Search | 📋 `sc2-item-search-mockup.html` |
| SC-7 | Timeline | 📋 `sc7-timeline-mockup.html` |

**หมายเหตุ SC-* :** ใช้ข้าม module — embed เป็น modal หรือ link จาก SL/PO/WH/SV

---

## 11. Mockup สถิติ

| ประเภท | จำนวน |
|-------|------|
| Mockup HTML ทั้งหมดใน `/Design Ai/` | 64 ไฟล์ |
| Mockup page จริง (แยกจาก index/architecture/dev-handoff) | 61 หน้า |
| หน้า v3 ที่ใช้งานล่าสุด | 5 หน้า (MD-1~MD-5) |
| หน้า v1/v2 ที่ยังเก็บไว้ใน `_archive/` | 5 หน้า (MD-* เดิม + v2) |
| Core pages ที่ Mockup แล้ว | ~39 หน้า |
| Module ยังไม่มี Mockup | ~52 modules |
| Tier-1 round (17 เม.ย. 26) | FI-13, IA-Q, PM-5, FI-Q — 4 หน้า |

**รายละเอียดแต่ละหน้า → `05-page-catalog.md`**
