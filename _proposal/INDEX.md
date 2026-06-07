# _proposal/ — โครงแยกตามโมดูล (interactive prototypes)

> แยก **Shared (กลาง · ใช้ทุกโมดูล)** ออกจาก **งานแต่ละโมดูล** เพื่อดูง่าย + อ้างไม่สับสน.
> ทุกตัว = interactive prototype (เปิดในเบราว์เซอร์กดได้จริง) · review ก่อน build จริง.

## _shared/ — Shared Components (9 ตัว · reusable)
| ตัว | สถานะ | ไฟล์ |
|---|---|---|
| SharedCustomerSearch | ✅ | `_shared/sc1-customer-search-proposal.html` |
| SharedItemSearch | ✅ | `_shared/sc2-item-search-proposal.html` |
| SharedDocReference | ✅ | `_shared/sc-docreference-proposal.html` |
| SharedPayment | ✅ | `_shared/sc-payment-proposal.html` |
| SharedDeposit | ✅ | `_shared/sc-deposit-proposal.html` |
| SharedDelivery | ✅ | `_shared/sc-delivery-proposal.html` |
| SharedSerialNumber | ✅ | `_shared/sc-serial-proposal.html` |
| SharedPromoPrice | ✅ | `_shared/sc-promoprice-proposal.html` |
| SharedTimeline | 🟢 มี (SC-7) | |

## sales/ — งานขาย (SL)
ใบเสนอราคา · ใบสั่งขาย · ขายเงินสด · เปิดขายเครดิต · (ใบลดหนี้)

## warehouse/ — งานคลัง (WH)
รับสินค้า · เบิก · โอน · รับเคลม · ส่งเคลม · ตรวจนับ · ปรับสต๊อก

## purchase/ — งานซื้อ (PO)
PR · PO · ตั้งหนี้ (AP)

## accounting/ — งานบัญชี (FI)
ตั้งหนี้ · ตัดชำระ (รับชำระ AR) · จ่ายเจ้าหนี้ · รับส่งเสริมการขาย

## service/ — งานบริการ (SV) — ทีหลัง

---
**ลำดับ build shared ที่เหลือ:** PromoPrice → Payment → Deposit → Delivery → Serial
**flow modules:** ทำหลัง shared เสร็จ (เริ่ม sales: ใบเสนอราคา)
