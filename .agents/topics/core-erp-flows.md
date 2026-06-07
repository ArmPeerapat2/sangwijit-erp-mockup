# Core ERP Flows — worklist (SWT single-entity · 2026-05-31)

> scope core (ทำก่อน) ตามที่ user กำหนด. tax/Dual-Book/Price List = ส่วนเสริม defer (ดู master-flows.md).
> วิธีทำต่อ flow: ดึง Flow PDF + spec + เทียบหน้าเดิม → ตารางเก่า↔ใหม่ → ตัดสิน → (rebuild/canvas เมื่อสั่ง).

## 1. งานขาย (Sales)
| flow | Flow PDF | หน้าเดิม | สถานะ |
|---|---|---|---|
| ใบเสนอราคา | Sales/01 Sales Quote | sl1-quotation | ✓ มี |
| ใบสั่งขาย | Sales/02,03 Sales Order | sl2-reservation (ใบจอง=SO) | ✓ |
| **การขายเงินสด** (Cash Sale) | Sales/04,09 (mode) | sl4-invoice | 🟡 mode ยังไม่แยกชัด |
| **เปิดขายเครดิต** (Credit Sale) | Sales/04 + credit gate | sl4 + slf1-credit-approval | 🟡 mode |
| (ใบลดหนี้ขาย — เสริม) | Sales/07 Credit Memo | — | 🔴 gap SL-CN |

## 2. งานซื้อ (Purchase)
| flow | Flow PDF | หน้าเดิม | สถานะ |
|---|---|---|---|
| PR | Purchase/02 PR | po1-purchase-request | ✓ |
| PO | Purchase/03 PO | po4-purchase-order | ✓ |
| ตั้งหนี้ (AP) | Purchase/05 Invoice | po6-ap-invoice | ✓ |
| (รับของ — อยู่ในคลัง) | Purchase/04 Receipt | wh1/po5 | ✓ |

## 3. คลัง (Inventory)
| flow | Flow PDF | หน้าเดิม | สถานะ |
|---|---|---|---|
| รับสินค้า | Purchase/04 Receipt | wh1-grn | ✓ |
| เบิกสินค้า | Sales/08 Shipment | wh3-sales-issue | ✓ |
| โอนสินค้า | Warehouse/01 Transfer | wh2-stock-transfer | ✓ |
| รับเคลม | Service/06 Claim Intake | cl1-claims | 🟡 (เดิม P2) |
| ส่งเคลม (→Vendor) | Service/06 | clm-vendor-claim | 🟡 |
| ตรวจนับ | Warehouse/02 Counting | wh4-stock-count | ✓ |
| **ปรับสต๊อก** (Adjust) | — (ไม่มี flow PDF) | — | 🔴 gap/หา flow |

## 4. รับ-จ่าย (AR/AP)
| flow | Flow PDF | หน้าเดิม | สถานะ |
|---|---|---|---|
| ตั้งหนี้ | Account AR/AP | SL-4 (AR) · PO-6 (AP) | ✓ (ซ้ำกับขาย/ซื้อ) |
| ตัดชำระ (รับชำระ AR) | Finance/01 Cash Receive | fi1-ar-receive · fi1q | ✓ |
| จ่ายเจ้าหนี้ (AP) | Finance/02 Payment | fi2-ap-payment | ✓ |
| **รับส่งเสริมการขาย** | Promotion/02 Accrual Claim | po7-rebate-dashboard | 🟡 |

## ช่องว่าง/ต้องเคลียร์
- Cash Sale vs Credit Sale = mode ของใบขาย (ยังไม่แยกชัดในหน้าเดิม)
- ปรับสต๊อก (Stock Adjustment) — ไม่มี flow PDF · ต้องหา/เพิ่ม
- รับเคลม/ส่งเคลม — เดิม defer P2 · ตอนนี้อยู่ใน core คลัง
- รับส่งเสริมการขาย (rebate income) — ผูก Promotion/PO-7

## ลำดับเริ่ม: งานขาย → SL-1 ใบเสนอราคา (revenue engine · ใช้ Customer/Item master)
