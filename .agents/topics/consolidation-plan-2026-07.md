# Consolidation Plan — ยุบ mockup ก่อนส่ง dev (5-agent audit · 2026-07-11)

> เป้า: ลดความซ้ำซ้อน/จำนวนหน้า ให้ dev ภายนอกรับงานง่าย · วิเคราะห์โดย 5 agent (SV · WH · CF+misc · FI+PO · SL+MD+PM+SC)
> สถานะ: **✅ DECISIONS LOCKED (2026-07-12)** — Peerapat ตอบครบ Q1-Q8 + C1-C6 · กำลัง execute

## 🔒 คำตอบที่เคาะแล้ว (2026-07-12)

**Q1-Q8 = ตามคำแนะนำทั้งหมด:** 1ก (WH คู่ R ยุบโค้ด·คงเมนู) · 2ก (sv7→แท็บ sv4) · 3ก (sv6→sv-q view ปฏิทิน) · 4ข (sv-order คงหน้าแยก+เพิ่มมัดจำ 6.1) · 5ก (fi3 cut ไป BC) · 6ก (bank-status→แท็บ 5 company-settings) · 7ก (ค่าส่วนตัวอยู่ user-profile) · 8ก (tr1 archive)

**C1-C6:**
- **C1=ข** — desktop กรอกแทนได้เต็ม → sv5 เป็นแท็บ "บันทึกงานช่าง" ในหน้างาน Job แบบ **editable เต็ม** (ไม่ใช่ read-only mirror ของ tech-mobile)
- **C2=ข** — SIR = เอกสารอ้างอิง/ข้อมูลประกอบ → ยุบเข้า tech-mobile (ฟอร์มประเมิน) + view ใน SQT · archive หน้า sir
- **C3=ทั้งคู่ได้** → เลือก ก: wh4r เป็นแท็บ "สร้างรอบนับ" ใน wh4 (รองรับทั้งคนเดียว/คนละคน)
- **C4=ตัดออก** — pm5-vat ไม่ได้ใช้ → archive + ถอด sidebar PM5V
- **C5=ก** — ทะเบียนเครื่องอ่านจาก BC (itemLedger+Serial) พอ → ตัด md6 stub + ถอด sidebar MD-6
- **C6=ข** — ex1 ทำ P1 เวอร์ชัน SWT เดี่ยว · section นิติบุคคล → ธง P2

## ตัวเลขรวม

| กลุ่ม | ก่อน | หลัง (build จริง) | วิธีลด |
|---|---|---|---|
| SV (+sqt/sir/clm) | 20 | **10** | แท็บ 4 (sv5·sv7·sv-order·posted) · config→CF 2 (sla·checklist) · sv6→sv-q · sv6-1/print=component · tech-report→cm1 |
| WH | 14 | **10** (โค้ด ~7 template) | R+จริง = ฟอร์มเดียว 2 โหมด (2R·3R) · 4R=แท็บ · Q1/Q2=component เดียว 2 route · q-dashboard archive |
| CF + standalone | 21 | **~12-13** | cut-ref 3 (cf2-1·cf2-9·config-hub) · ลบ stub 2 (cf3·cf5) · bank-status→แท็บ? · tr1 archive? · ex1=P2 |
| FI + PO | 19 | **15-16** | archive 3 (fi5·fi13·po3) · fi4 ตัดโซน WHT ซ้ำ · fi3 cut? |
| SL + MD + PM + SC | 27 | **15** + 3 component | sl5 archive · sl7→rp1 · pm5-vat=reference · sc demo 6 หน้า=reference · md6=backlog stub |
| **รวม** | **~101** | **~62 หน้า build** (Phase-1 จริง ~57 หลังหัก P2: pm×3 · ex1) | **ลด ~40%** |

## ✅ SAFE — ทำได้เลย ไม่ขัด decision ไหน

1. **Archive:** sl5-crm-followup · fi5-ar-audit (เนื้อ=FI-6 P2) · fi13-dual-book (P2 + ขัด doc-level tag) · po3-vendor-onboarding (ตายซ้อน: md3 แทน + VBL→PO-6) · wh-q-dashboard (เหลือแต่ KPI+ลิงก์ stale)
2. **Merge report:** sl7-sales-report → rp1 (rp1 มีหมวดขายแล้ว :665-744) · sv-tech-report → cm1 แท็บบริการ (cm1 มี section stage-9 แล้ว)
3. **Config → CF:** sv-sla-config + sv-checklist-template → cf-master-settings (schema ตรง swt-master-editor) · sv6-print-templates → cf2-7
4. **ลบ stub + repoint sidebar:** cf3-payment-hub (เนื้อจริงอยู่ cf-master-settings แล้ว) · cf5-bank-master (A3 เคาะ: BC ถือ · portal=cf-bank-status)
5. **Cut-reference (ไม่ส่งเป็นหน้า build):** cf2-1-tax · cf2-9-general-param · cf2-config-hub (แนบเป็น decision map · แก้ note Entity Tag stale ก่อน) · demo 6 หน้า: sc7 · sc10 · sc-payment · sc-media-demo · sc-shared-catalog · pm5-vat-simulator
6. **ตัด section ซ้ำ:** fi4 โซน "สรุป WHT เดือน" → ลิงก์ fi12 · ap1 แท็บ "ตั้งค่า Approval Flow" → ลิงก์ cf2-6 (Maker≠Checker)
7. **แก้ stale ก่อน handoff:** CLAUDE.md "CF-2.2=cut" ขัด ADR-0004 (Portal-managed) · dead iframe `swt-doc-finder.js:335` ชี้ bc365/ · `fi1q:114` ชี้ชื่อไฟล์ผิด · fiq การ์ด :364 (FI-5→FI-4) + :391 (ปิดงวด=BC) · sidebar sl5/SLR1-5 · fi12:59 label
8. **ห้ามแตะ:** sc1/sc2/sc3 = runtime จริง (iframe จาก swt-doc-finder) ไม่ใช่ demo · sv3≠WH-2 (gate ซาก) · sqt≠SL-1 (ประกัน+SIR) · clm≠SL-CN (คนละทิศเงิน) · fiq≠fi1q (dashboard vs rail) · po6≠po8 (เงิน vs ของ)

## ❓ ต้องเคาะ (Q1-Q8 · มีคำแนะนำ)

| # | เรื่อง | ตัวเลือก | แนะนำ |
|---|---|---|---|
| Q1 | **WH คู่ R+จริง (2R/3R)** — ขัด decision Q5 เดิม "ใบคำขอ=หน้าจริง" | ก. ยุบระดับโค้ด (ฟอร์มเดียว 2 โหมด) แต่คงเมนู/route แยก · ข. คงแยก 2 หน้า | **ก** (dev ประหยัด · user เห็นเหมือนเดิม · ล็อกโหมดตามสิทธิ์ กันเซลล์เห็นปุ่ม Post) |
| Q2 | **sv7 → แท็บใน sv4** — กระทบ doc-chain locked SV-...→4→7 | ก. ยุบเป็นแท็บ (สถานะ "ปิดงานแล้ว·รอส่งมอบ" ใน sv4) · ข. คงแยก | **ก** (ตาม decision B4 "SV-7=รับชำระเท่านั้น" · เอกสาร BC ยังแยกใบ) |
| Q3 | **sv6 จัดส่ง+ติดตั้ง → รวม sv-q** | ก. รวม (view ปฏิทินใน sv-q) · ข. คงแยก ถ้าทีมจัดส่งเป็นคนละทีมกับ dispatcher ซ่อม | ขึ้นกับหน้างานจริง — **ทีมเดียวกัน=ก · คนละทีม=ข** |
| Q4 | **sv-order → แท็บใน "หน้างาน Job"** (มีจุดเงิน: จ่าย vendor + มัดจำ 6.1) | ก. เป็นแท็บ (คง approval ในแท็บ) · ข. คงหน้าแยก | **ข** (จุดเงิน = จุดคุมเดียว · +1 หน้าไม่เจ็บ) |
| Q5 | **fi3 กระทบยอดธนาคาร** — BC มี native | ก. cut ใช้ BC ตรง (เหมือน CF-2.x) · ข. คง portal | **ก** (เดือนละครั้ง · คนทำ=บัญชีที่มีสิทธิ์ BC) |
| Q6 | **cf-bank-status** | ก. ยุบเป็นแท็บ 5 ของ cf-company-settings · ข. คงแยก (จอ monitor) | **ก** |
| Q7 | **ค่าส่วนตัว 2 ที่** (user-profile vs company-settings แท็บส่วนตัว) | ก. อยู่ user-profile ที่เดียว · ข. อยู่ company-settings ที่เดียว | **ก** (คลิกรูปตัวเอง=ธรรมชาติสุด · จุดคุมเดียว) |
| Q8 | **tr1-treasury** | ก. archive (BC Cash Flow Forecast ตรง) · ข. เก็บ P2 reference | **ก** |

## หมายเหตุ persona (จากทุก agent — หลักห้ามยุบข้าม)
- ช่างมือถือ (sv-tech-mobile) ≠ admin desktop — sv5 ยุบเป็นแท็บได้เพราะช่างกรอกทางมือถือ (ยืนยันแล้ว 07-08: "ช่างส่งงานส่วนมากผ่านมือถือ")
- เซลล์สร้างใบขอ ≠ คลัง Post — ฟอร์มรวมต้องล็อกโหมดตามสิทธิ์
- Doc-chain ใน BC ไม่เปลี่ยน — ยุบแค่ "หน้า" เลขเอกสาร/สถานะแยกเหมือนเดิม

---

## Lifecycle backlog — ข/ค (รอเคาะก่อนทำ · ตามกฎสร้างไฟล์: หน้าใหม่ต้องขอก่อน)

**✅ ก (edge cases) = ทำแล้ว** 2026-07-12: เติมสายพิเศษ (void/reverse/reprint/ตีกลับ/รับเกิน-ขาด) ท้าย flow-sl/po/fi/wh-status.html · SV ครบอยู่แล้ว

### ข — lifecycle เพิ่ม (โมดูลที่มี flow จริง)
> **สถานะ (เคาะ 2026-07-12):** ข1 CM = ✅ ทำแล้ว (รวมใน flow-sl · สาย 4) · ข2 PM + ข3 FA = ⏸️ พัก P2 (FA ยังไม่มี mockup) · ค1 MD = ✅ ใส่กล่องใน DEV-HANDOFF แล้ว (ไม่ทำไฟล์แยก)
| # | โมดูล | สาย lifecycle | ไฟล์ | new/extend | เมื่อไหร่ (เสนอ) |
|---|---|---|---|---|---|
| ข1 | **CM คอมเซลล์** | รอบเดือน → คำนวณ → ตรวจ → อนุมัติ → จ่าย (คู่กับ stage 9 ช่าง) | รวมใน flow-sl-status หรือ flow-cm-status.html | ⚠️ ถ้าแยก = **new file ต้องขอ** | **ทำได้เลย** (mockup cm1 มี) |
| ข2 | **PM โปรโมชั่น** | ราคา(PM-1)+โปร(PM-2): ร่าง→อนุมัติ→ใช้งาน→หมดอายุ/ยกเลิก | flow-pm-status.html | ✅ **new — ต้องขอ** | **P2** (PM parked P2 อยู่แล้ว) |
| ข3 | **FA สินทรัพย์ (FI-9/10/11)** | 3 สาย: สร้าง+ค่าเสื่อม / ขาย / ตัดจำหน่าย-สูญหาย | เพิ่มใน flow-fi-status | extend (ไม่ต้องขอ) | **P2** (mockup FA ยังไม่มี · flow อ้าง Flow Design/Account 10-12) |

### ค — MD state (CRUD สั้น · ไม่ใช่ flow เดินเอกสาร)
| # | โมดูล | state | ไฟล์ | new/extend | เมื่อไหร่ |
|---|---|---|---|---|---|
| ค1 | **MD-1..5** ทะเบียนหลัก | Draft → รอ KYC/verify → Active → Blocked → Inactive (soft-delete) | flow-md-status.html (1 ตารางรวม 5 master) | ✅ **new — ต้องขอ** | ทำได้เลย แต่สั้น — คุ้มไหม? |

> **กฎที่ยึด:** flow-*-status.html = เอกสาร reference (ไม่ใช่ mockup page) แต่ยัง "หน้าใหม่" → ลิสต์+ขอก่อนสร้าง ตาม CLAUDE.md · FA = extend ไฟล์เดิม ไม่ต้องขอ

---

## Status Q&A — เคาะครบ (2026-07-12) · lock ลง flow-*-status.html แล้ว

**WH:** W1 ชื่อสถานะใช้ได้ (5 สายลิสต์ครบ) · **W2 รับของ+นับ = มือถือ/สแกนได้ (+desktop)** → เพิ่ม Mobile surface · **W3 กดตั๋วจากคิว = เข้าฟอร์มเลย** (ไม่ใช่ popup)
**SL:** **S1 เมนูขายสร้างใบเสนอราคา/ใบสั่งขายได้ + ดูราคา+สต๊อกเบื้องต้น** · S2 popup ในฟอร์ม · S3 รวมจออนุมัติเดียว (วงเงิน+CN) · S4 SL-Q โชว์ค้างชำระ · **S5 CM = รายงานสรุป ไม่ใช่ flow เดินเอกสาร** (RP-1/cm1)
**PO:** **Q1 คงคำอังกฤษ (Accrued/Realized/Settled) + คุย/อธิบายใช้ไทยประกอบ** · Q2 PO-CN มีอนุมัติก่อน Post (2 ที่มา: สร้างตรง/จากส่งเสริมการขาย) · Q3 popup AP-1 · **Q4 Settle = กำหนดตามสิทธิ์ RBAC** (ไม่ fix ว่าใคร)
**FI:** F1 ชื่อสถานะใช้ได้ + ทำ legend อธิบายในโมดูล · **F2 คนกดยืนยันทุกก้อน · ยังไม่กำหนดวันเตือน · อนาคตทำ API PromptPay → ระบบจับคู่เบื้องต้นแล้วคนยืนยัน** · **F3 ไม่ต้องทำการ์ดเตือน** (เป็นสถานะรอกระทบอยู่แล้ว) · **F4 ไม่บังคับแนบสลิป แต่ soft-flag เตือน "ยังไม่แนบ/ไม่ระบุวิธีชำระ"**

> ทุกข้อ flip เป็น ✅ ในไฟล์ flow แล้ว · CM ปรับเป็น "รายงาน" (S5) · WH surface +Mobile/−popup (W2/W3)
