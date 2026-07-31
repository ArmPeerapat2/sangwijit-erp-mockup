# Flow Fix Plan — ตารางแก้ต่อเมนู (2026-07-31)

จาก audit 6 flow · เรียงตามหน้า mockup · Pri: 🔴P1 ขัด decision/loop ไม่ปิด · 🟠P2 gate/control · 🟡P3 โครงสร้าง/ปลายสาย

---

## 🆕 channel master (จอใหม่ · CF/MD) — 🔴P1 prerequisite
| จุด | ตอนนี้ | ปรับเป็น (แนวทาง/field) |
|---|---|---|
| config ช่องทางการขาย | ไม่มีจอ | จอ list+form: `code · ชื่อช่องทาง · active` · เพิ่มช่องได้ · map ช่องเก่า (ProJect ปลีก/CA-CR ส่ง/LA ออนไลน์/EXPORT ส่งออก/GV/SR) · ราคา (pm1) reference by code |
> กรอบ: กัน hard-code Price1-7 ซ้ำระบบเก่า · เป็น prerequisite ของ pm1

## 💵 pm1-price-list — 🔴P1 / 🟠P2
| จุด | ตอนนี้ | ปรับเป็น (แนวทาง/field) |
|---|---|---|
| มิติราคา | คอลัมน์ "จำนวน (1-4/5+)" + "กลุ่มลูกค้า 1 ค่า" | **1 สินค้า = 1 แถว · คอลัมน์ราคา+Disc ต่อช่องทาง** (header dynamic จาก channel master) · **ตัดคอลัมน์จำนวน (qty) ออก** |
| cost floor | ไม่มี | guard ราคา < ต้นทุน ตอน Post → 🟡 เตือน / 🔴 บล็อก + badge (แม้ต้นทุนซ่อนจาก sales) |
| Maker≠Checker | ไม่ระบุ | ขั้นอนุมัติระบุ "คนตั้ง ≠ คนอนุมัติ" |
| โหมด ①/② | ประเภท dropdown มี Promo ปน | ตัด Promo ออก · pm1 = มาตรฐานล้วน · link → pm2 (โปร) |
| determination strip | "โปร → มาตรฐานตามกลุ่มลูกค้า" | "มาตรฐานตาม**ช่องทาง**ก่อน → โปรเข้าเงื่อนไข → ไม่เข้ากลับมาตรฐาน → VAT ท้ายสุด" |
| naming | "ใบขอเปลี่ยนราคา (PM-3)" | เลือกคำเดียวกับ record ("PCR") |

## 💵 pm5-price-simulator — 🟡P3
| จุด | ตอนนี้ | ปรับเป็น |
|---|---|---|
| base price | ค่าเดียว "จาก PM-1" | เลือก**ช่องทาง**ด้วย (หลัง pm1 มี channel) |
> GP block-save เป็นของ pm1 ตอน Post (pm5 view-only ถูกแล้ว)

---

## 🚚 sv6-delivery-install — 🔴P1 / 🟡P3
| จุด | ตอนนี้ | ปรับเป็น (แนวทาง/field) |
|---|---|---|
| ช่องทางส่ง | assign เลือกได้แค่ช่าง (internal/outsource) | assign เพิ่ม radio **ทีมเอง / 3PL** → 3PL: swap ช่าง เป็น `select carrier + input tracking + route` · ทีมเอง: คงเดิม (branch 1 field) |
| ประเภทงาน | ทุก job = ติดตั้งแอร์ | chip บน job-head: 🚚 ส่งเฉยๆ / 🔧 ส่ง+ติดตั้ง / ♻️ ส่งซ่อมคืน |
| ยกเลิกงาน | มี Partial = นัดใหม่ (ขัด) | ปุ่ม **❌ ส่งไม่สำเร็จ** → modal เหตุ + สถานะ `ยกเลิก (terminal)` + trigger คืนคลัง WH-1 (แยกจาก Partial) |

## 🚚 sv7-service-delivery — 🟠P2 / ❓
| จุด | ตอนนี้ | ปรับเป็น |
|---|---|---|
| branch 3PL | มีแค่ label "วิธีส่งมอบ" | ถ้า 3PL → ซ่อน signature · โชว์ `สถานะ delivered + tracking + upload สลิป POD + mark COD "เข้ารอบ → FI-3"` |
| scope ❓ | เป็น service delivery ล้วน (chain SV/vendor) | เคาะ: ครอบ **ส่งของขาย SL-4** ด้วยไหม → ถ้าใช่ ทำ variant ปิดกลับบิลขาย |

## 🚚 wh2-issue — 🟡P3
| จุด | ตอนนี้ | ปรับเป็น |
|---|---|---|
| อ้าง JOB | อ้างแค่ SO + ISR | field **"อ้างอิงงานจัดส่ง (JOB · SV-6)"** + เพิ่ม node SV-6 ใน doc-chain |

---

## ♻️ clm-vendor-claim — 🔴P1 / 🟠P2
| จุด | ตอนนี้ | ปรับเป็น (แนวทาง/field) |
|---|---|---|
| S4 approval | note ล้วน + ปุ่มปฏิเสธ | **control จริง:** ช่องผู้อนุมัติ + tier + ปุ่มอนุมัติ + เลข VRA (Maker≠Checker) ก่อน write-off |
| bin 6 | ไม่มี field (CLM-7 = ซากอะไหล่ ②) | field **bin 6 + tracking ของทั้งชิ้น** ในโหมด ① |
| netting ref | ไม่มี (grep=0) | panel อ้างอิง **ARI(AR) ↔ PO-CN(AP) · Net C/V** (แสดง step แม้ post ที่ FI) |
| SLA reminder | countdown เฉยๆ | badge **ทวงอัตโนมัติ** เมื่อเกิน 7 วัน |
| น้ำหนักจอ | default ② (billing ARI) | (option) ยก ① เป็นหน้าเด่นตาม record |

## ♻️ wh1-receive — 🔴P1
| จุด | ตอนนี้ | ปรับเป็น |
|---|---|---|
| wire S2/S3 | อ้างได้แค่ PO/โอน | เพิ่ม **reference CLM** + โหมดรับ "ของแทน (S2) / ซ่อมกลับ (S3)" → ปิด loop เคลม |

## ♻️ po-cn-credit-note — 🟠P2
| จุด | ตอนนี้ | ปรับเป็น |
|---|---|---|
| อ้างบิลเดิม | GRN/AP/PO | เพิ่ม option **CLM / ARI** |
| netting | ไม่มี | panel Net C/V (คู่กับ clm) |

---

## 🔧 sv5-job-card — 🟡P3 (โครงสร้างใหญ่สุดของ SV)
| จุด | ตอนนี้ | ปรับเป็น |
|---|---|---|
| layout | desktop 1440px + sidebar | **mobile variant (ช่าง)** — หรือแก้ mapping ใน record ว่าเป็น desktop |
| stage-4 actions | มีแค่ "ส่ง Admin"/"รออะไหล่" | เติม **4.4 ยกเลิก+บังคับเหตุผล (terminal)** · 4.3 นัดถัดไป(→2.1) · 3.1 กดรับสินค้า+ถ่ายภาพตอนถึงหน้างาน |

## 🔧 sv4-service-close — 🟡P3
| จุด | ตอนนี้ | ปรับเป็น |
|---|---|---|
| label 5.3 | ปุ่ม "↩ ส่งกลับช่าง" | "→ 2.1 รอรับสินค้า" ให้ตรง record |

## 🔧 sv1-service-intake — 🟡P3 / ❓
| จุด | ตอนนี้ | ปรับเป็น |
|---|---|---|
| นัดหมาย (guard 1.2) | ผลักไป SV-2 ทั้งหมด | sync ↔ record (admin นัดได้ตั้งแต่รับเรื่อง?) · ปุ่ม ❌ ยกเลิกใบ capture เหตุผล |
| loaner ❓ | เบิกผ่าน WH-2R | เคาะ WH-2R หรือ WH-3 (record = WH-3) |

---

## 🎁 pm2-promotion — 🟠P2
| จุด | ตอนนี้ | ปรับเป็น (แนวทาง/field) |
|---|---|---|
| conflict-check | ไม่มี (PM-2.5 = stacking คนละเรื่อง) | section ก่อน Activate โชว์โปรทับซ้อน (item+ลูกค้า+ช่วง) → block/เตือน |
| ขอบเขตสาขา | ไม่มี field | field **SITECODE** ใน PM-2.2 เงื่อนไข |
| ของแถม gate | warning text | **stock gate:** badge ของพอ/ไม่พอ + block activate · BuyXGetY เช็ค 2 ตัว |
| status | ร่าง→ยืนยัน→Live→หมดอายุ | เพิ่ม **Cancel/Deactivate** ให้ครบ |

---

## 🤝 po7-rebate-dashboard + po2 — 🔴P1 / 🟠P2
| จุด | ตอนนี้ | ปรับเป็น (แนวทาง/field) |
|---|---|---|
| Sell-in 2 โหมด | mode m1/m2/m3 = สูตรส่วนลด (คนละเรื่อง) | po2 field **"วิธีให้ส่วนลด: หักบนบิล PO / accrue ตามหลัง"** → po7 อ่าน · on-bill = ไม่ดึงเข้า accrual (chip "หักบนบิลแล้ว · terminal") |
| รับปาก | evidence chip cosmetic | **badge 🟡 บน status strip** + gate เตือนตอน Realize ถ้ายังรับปาก + ช่อง Sales เซ็นรับทราบที่ PO-7 |
| Recon/netting | ไม่มีจอ | **tab "Recon/กระทบยอด"** (Accrual vs รับจริง + netting ห้าง) หรือชี้ FI-8 |
| Form per-type | ขับด้วย dropdown 1 ข้อตกลง | Form create-accrual แยกต่อ type (4 types) |
| wording | pill "Accrued (รับรู้)" | "บันทึกความจำ · ยังไม่ลง GL" |

---

## ✅ เคาะแล้ว 07-31 (7 จุด)
| จุด | มติ | งานที่เกิด |
|---|---|---|
| **loaner** | **เปิดบิล "รอเก็บเงินค้างหนี้" (AR hold)** ให้ลูกค้า (ไม่ใช่แค่เบิก) · คืนแล้วเคลียร์ · ไม่คืน=เก็บจริง | 🆕 clm/sv1 loaner → เพิ่มการเปิดบิล AR hold + เคลียร์เมื่อคืน (แทน/เสริม WH-2R) |
| **sanction** | **ไม่ fix 30/60 — ระบุกรอบเวลาในใบ** · PO มีอายุ/กรอบยืน · ฝั่งขายใบเสนอราคาระบุอายุใบ | 🆕 po7/po sanction = อ่านจาก field อายุใบ · เพิ่ม field "อายุ/กรอบยืนใบ" ที่ PO + ใบเสนอราคา (SL-1) |
| **SV-7 scope** | SV-7 = ซ่อมคืนเท่านั้น · **แยกหน้าใหม่สำหรับส่งของขาย SL-4** | 🆕 สร้างหน้าใหม่ "ส่งของขาย" (DL flow · SL-4→POD→ปิดบิลขาย · ไม่ใช่ ARI/vendor) |
| **sv1 นัด** | **นัดที่ SV-2** · sv1 แค่เก็บความสะดวก | แก้ record guard 1.2 (align mockup) |
| spec 742 | แก้ให้ตรง 674 (GL ตอน Realized) | ✅ แก้ PO_purchase.md 742 |
| determination wording (pm1) | align เป็น "มาตรฐานตามช่องทางก่อน" | รวมในงาน pm1 |
| PCR/PM-3 naming | ใช้ "PCR" | รวมในงาน pm1 |

> 🆕 **งานใหม่ที่เพิ่มจากการเคาะ:**
> 1. **หน้า "ส่งของขาย" (DL)** — pipeline SL-4→SV-6 คิว→POD→ปิดบิลขาย (แยกจาก SV-7 ซ่อมคืน)
> 2. **AR-hold bill** สำหรับ loaner (clm/sv) — บิลค้างเก็บเงิน เคลียร์เมื่อคืนเครื่อง
> 3. **field "อายุ/กรอบยืนใบ"** ที่ PO + ใบเสนอราคา (SL-1) → ใช้เป็นเกณฑ์ sanction/หมดอายุ

---

## ลำดับแนะนำ
1. **เคาะ ❓ 7 จุด** (loaner/sanction/742/SV-7 scope/determination/naming/sv1-นัด) — หลายอันกำหนดว่าจะแก้ยังไง
2. **channel master** (prerequisite) → **pm1** (P1 ราคา)
3. **wh1 wire S2/S3** + **clm S4 control** (P1 เคลม)
4. **sv6 ช่องทางส่ง 3PL** (P1 จัดส่ง)
5. **po2/po7 sell-in 2 โหมด + รับปาก** (P1 rebate)
6. P2 gates (pm2 conflict/สาขา/ของแถม · pm1 cost floor · rebate Recon)
7. P3 (sv5 mobile · sv7 3PL · label fixes)
