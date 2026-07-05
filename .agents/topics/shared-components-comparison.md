# Shared Components — เปรียบเทียบ เดิม ↔ เสนอเพิ่ม (ทั้ง 9 ตัว)

> สำหรับ user review (2026-06-01). source: `_reference/docs/1 component_fw_clean.docx` §2 · เทียบ swt-* ปัจจุบัน.
> ทุกตัวเพิ่ม prop `mode` (create/edit/view[/approve]) + รับผลผ่าน Events. "เดิม" = ที่ swt/SC mockup มีจริง · "เสนอเพิ่ม" = contract ที่ขาด.
> หลัง review → build ทีละตัว (ขึ้น canvas).

---

## 1. SharedCustomerSearch (ค้นหา/เลือกลูกค้า) — 🟡 มีฐาน (SC-1)
| ด้าน | เดิม (SC-1 + swt) | เสนอเพิ่ม |
|---|---|---|
| ค้นหา | drawer: รหัส/ชื่อ/เบอร์/บัตร + filter (ประเภท·กลุ่มราคา·สถานะ) + Recent | wire หน้าจริงให้เปิด SC-1 (เลิก global palette) |
| ผลลัพธ์ | result-card: วงเงิน/ใช้/คงเหลือ + AR ค้าง/Blocked + modal ประวัติ | `creditStatus` ok/warning/over/blocked + prop `creditWarning` |
| props | — | `mode · docType(INVOICE/QUOTE/RSV/...) · preloadId · allowCreate` |
| Quick-Create | (ยังไม่ชัด) | ปุ่มสร้างลูกค้า Draft + event `customer:created` (ใช้ได้ทันที) |
| events | onclick→modal | `customer:selected`(→auto-fill+ดึง Price List) · `credit:blocked`(→ApprovalBanner) |
| API | mock | GET `/customers` · GET `/customers/{id}` · POST `/customers` |

## 2. SharedItemSearch (ค้นหา/เพิ่มสินค้า) — 🟡 ดีสุด (SC-2, 61 ไฟล์)
| ด้าน | เดิม | เสนอเพิ่ม |
|---|---|---|
| ค้นหา | SC-2 ค้นสินค้า + barcode scan | คง + แสดง **สต็อก real-time แยกคลัง** |
| props | `swt-item-input` (attr) | `mode · docType · customerId(→price list) · branchId · docDate · allowSerial · multiSelect` |
| events | (add row) | `item:added{item,qty,price,promo}` · `item:substitute` · `stock:warning{available}` |
| สินค้าทดแทน | — | ดึง substitutes เมื่อสต็อก 0 (พร้อมราคาเทียบ) |
| ราคา | — | หลังเลือก → ดึง Price List + promo (ผ่าน PromoPrice) |
| API | mock | GET `/items?$expand=itemVariants` · `/priceLists` · `/items/{id}/substitutes` |

## 3. SharedPayment (ชำระเงิน) — 🟢 BUILT (`swt-payment.js` · 2026-07-06)
| ด้าน | เดิม | เสนอเพิ่ม | **BUILT (swt-payment.js)** |
|---|---|---|---|
| รับชำระ | QR (customer/invoice) | **split payment หลายวิธี** (PaymentLine[] {method,amount,ref}) | ✅ split · `paid[]{method,label,amount}` + chip ลบได้ · auto-เติมยอดคงเหลือ |
| props | — | `mode · netAmount · vatAmount · depositAmt · customerId · allowedMethods · requireApproval` | `{total · ref · accounts[] · cardTypes[] · promptpay · onConfirm · onCancel}` |
| state | — | totalPaid · remaining · creditCheck · approvalRequired | ✅ Total/Remain (เขียวเมื่อ 0) · กันจ่ายเกิน · ⏳ creditCheck/approval ยังไม่ผูก |
| วิธีจ่าย | — | — | เงินสด · **QR PromptPay (โผล่หลังเลือกแท็บ)** · โอนธนาคาร · **บัตร/มาร์เก็ตเพลส +%ชาร์จจาก master** · เช็ค · AR/ผ่อน |
| events | — | `payment:changed` · `approval:required` · `payment:complete` | ⏳ ใช้ callback `onConfirm(paid[])` แทน event (พอสำหรับ mockup) |
| API | — | `swtRenderPayment(el,opts)` (inline) · `swtOpenPayment(opts)` (modal) · demo `sc-payment-mockup.html` |

**TODO เชื่อมต่อ:** เสียบ sv7/sl3/fiq/sl1 · ผูก credit-check + approval banner · %ชาร์จบัตรดึงจาก master ประเภทบัตร (1.5.1.A) จริง · อ้างอิง `_reference/ComponanceShare/payment` + `_reference/MasterDataSetup`

## 4. SharedDelivery (จัดส่ง/ติดตั้ง) — 🔴 ขาด
| ด้าน | เดิม | เสนอเพิ่ม |
|---|---|---|
| ทั้งตัว | — | props `mode · customerId(ที่อยู่ default) · branchId · showInstall · preloadAddress` |
| ที่อยู่/นัด | — | ที่อยู่ส่ง · วันนัด · วิธีส่ง · ผู้รับ |
| ติดตั้ง | — | toggle "ต้องการติดตั้ง" → **spawn Service Work Order หลัง Post** |
| events | — | `delivery:changed` · `install:toggled` · `install:triggerService{workOrderDraft}` |

## 5. SharedDocReference (ดึงเอกสารต้นทาง) — 🔴 ขาด (มีแค่ breadcrumb)
| ด้าน | เดิม | เสนอเพิ่ม |
|---|---|---|
| แสดง chain | breadcrumb (DOC_MAP) read-only | คง (display) |
| **ดึงต้นทาง** | — | ค้น + ดึงข้อมูลจาก Quote/RSV/Deposit/PO + **Partial Pull** (ดึงบางบรรทัด) |
| Cascading | — | INVOICE←Quote/RSV/Deposit · RSV←Quote · PO←PR/RFQ · GR←PO · SERVICE←INVOICE (auto-fill) |
| props | — | `mode · docType · customerId · sourceTypes` |
| events | — | `doc:pulled{mappedData}` · `doc:partial` · `source:closed`(เตือนห้ามดึงซ้ำ) |

## 6. SharedDeposit (รับ/ตัดมัดจำ) — 🔴 ขาด (กระจายใน SL-3)
| ด้าน | เดิม | เสนอเพิ่ม |
|---|---|---|
| มัดจำ | SL-3 หน้าแยก | panel ตัดมัดจำในบิล — **หลายใบต่อบิล** |
| props | — | `mode · customerId · invoiceAmt · preloadDepositIds` |
| validate | — | ตัดไม่เกินยอดบิล · auto-close เมื่อใช้ครบ |
| events | — | `deposit:applied{totalApplied}`(→update Payment) · `deposit:created` · `deposit:fullyUsed` |

## 7. SharedTimeline (ประวัติ/เส้นทาง) — 🟢 มี (SC-7)
| ด้าน | เดิม | เสนอเพิ่ม |
|---|---|---|
| Doc Chain | `swtRenderBreadcrumb` + `swtAppendTimeline` | คง |
| props | (call API) | `docId · docType · allowComment · collapsed` |
| sub-panels | Chain + Activity (timeline) | **+ Comment panel** (internal note · mention @ · แนบไฟล์) |
| API | mock | GET `/documentLinks` · `/auditLog` · GET/POST `/comments` |

## 8. SharedSerialNumber (จัดการ Serial) — 🔴 ขาด
| ด้าน | เดิม | เสนอเพิ่ม |
|---|---|---|
| ทั้งตัว | — | inline panel ใน item line · กรอก/สแกน/**Upload CSV** |
| props | — | `mode · itemId · docType(INVOICE/TRANSFER/GRN/SERVICE) · qty · required · allowBulk` |
| ตรวจ | — | ตรวจซ้ำ real-time (debounce 200ms) · บล็อกถ้าใช้แล้ว · lifecycle (ว่าง/ใช้/ซ่อม/เคลม) |
| events | — | `serial:added`(→unlock Confirm) · `serial:duplicate` · `serial:invalid` |
| API | — | GET `/itemTrackingEntries?serialNo=` · `/items/{id}/serials` · POST (เมื่อ Post) |

## 9. SharedPromoPrice (โปร/ราคาขาย) — 🔴 ขาด (PM-5 แยก)
| ด้าน | เดิม | เสนอเพิ่ม |
|---|---|---|
| ราคา | PM-5 simulator แยก · promo-pill counter | inline ใน item line + Summary panel |
| props | — | `mode · customerId · branchId · docDate · channel(retail/wholesale/online/project) · items` |
| logic | — | priceList priority สูงสุด → line discount → promo active → **conflict: priority win (ไม่ stack)** |
| events | — | `price:calculated` · `promo:applied{freeItems,totalDiscount}` · `price:locked` · `commission:calc{pc,amount}` |
| API | — | GET `/priceLists?customerId=&date=` |
| dependency | — | ผูก Price List (MD-6) ที่ defer → ทำ skeleton + manual ก่อน |

---

## สรุปสำหรับ review
- 🟢 2 (Timeline · **Payment ✅ build 2026-07-06**) · 🟡 2 (Customer/Item — ปรับให้ครบ contract + wire) · 🔴 5 (สร้างใหม่ตาม contract)
- หัวใจ: ทุกตัว **mode + Events contract** · DocReference = ตัวเชื่อม chain (Cascading + Partial Pull)
- หลัง user อนุมัติ → build ทีละตัว (ขึ้น canvas) ตามลำดับ: CustomerSearch → ItemSearch → DocReference → PromoPrice → Payment/Deposit/Delivery/Serial
