# Master Data — วิเคราะห์ 3 ทาง (BC365 API ↔ mockup ↔ ERP เดิม) · 2026-07-06

เทียบ 3 master แกน (ลูกค้า·เจ้าหนี้·สินค้า) จาก 3 แหล่ง:
- **① BC API v2.0** — verify Microsoft Learn (general-purpose + dynamics-bc365 skill)
- **② mockup** — หน้าที่ออกแบบไว้ (md1/md2/sc3 · erp-design-architect)
- **③ ERP เดิม** — `MasterData-fields.md` (field legacy)

> ทั้ง 3 entity (customers/vendors/items) BC API รองรับ **GET/POST/PATCH/DELETE เต็ม** → create+update ผ่าน API ได้ทุกตัว ไม่มี read-only master

---

## 🔑 5 pattern สำคัญ (ข้ามทุก master)
1. **create/update ผ่าน standard API ได้เต็ม** — ไม่ต้องกลัว master แก้ไม่ได้
2. **กลุ่ม/ประเภท/8 มิติ = `defaultDimensions` entity** (Thai group → BC Dimension · POST/PATCH ผูก parentType+dimensionCode+value) → **ตรงกับ decision "BC dropdown"** เป๊ะ · พอร์ทัลอ่าน/ผูกค่า ไม่สร้าง field เอง
3. **standard ไม่มีเสมอ = Thai localization + tracking:** สาขาภาษี (TaxBranch) · unit ratio ต่อ item · serial/lot tracking → ทั้งหมดต้อง **table extension (field 50000+) + custom API page ใหม่** (standard API page extend field ไม่ได้ · ต้อง copy AL + `ODataKeyFields=SystemId`)
4. **"เครดิตวัน" = Payment Terms (FK)** ไม่ใช่ตัวเลข → พอร์ทัลต้องแปลง
5. ก่อน implement จริงต้องดึง `$metadata` ของ environment (field เปลี่ยนตาม version + custom)

---

## 1. ลูกค้า (Customer) — 🟢 พร้อมสุด
| field เดิม | ① BC API v2.0 | ② mockup | verdict |
|---|---|---|---|
| รหัส·ชื่อ·ที่อยู่·อำเภอ·จังหวัด·โทร·เลขภาษี·สกุลเงิน | ✅ standard (number·displayName·addressLine·city·state·phoneNumber·taxRegistrationNumber·currencyCode) | ✅ | **standard พอ** |
| ชื่อย่อ (POS) | ⚠️ custom | ❌ ขาด | **เติม mockup 1 field** |
| **สาขาภาษี (TaxBranch)** | ⚠️ **custom field+API** | ✅ | 🔧 **BC dev: table ext + custom API** (Thai loc) |
| คำนำหน้าไทย | ⚠️ (type มีแค่ Company/Person) | ✅ | 🔧 custom field |
| เครดิตวัน | ⚠️ paymentTermsId (FK) | ✅ Net 30/60 | แปลง |
| กลุ่ม/ประเภท/เขตขาย/tier | ✅ defaultDimensions | ✅ (dropdown tag 🔵) | 🔒 BC dropdown |
| เซลส์ผู้ดูแล | ✅ salespersonCode | ✅ owner card | standard |
| ประเภทสมาชิก+ส่วนลด+ช่วงวัน | ❌ (pricing engine) | ❌ | 🟡 **PM/BC · ไม่เข้า master** |
| PDPA/KYC/aging/credit history | — | ✅ (mockup เพิ่มเอง) | 🟠 portal เก็บได้ |

**สรุป:** mockup ครบ+เกิน · standard API เกือบพอ · **BC dev ต้องทำ custom:** TaxBranch, คำนำหน้าไทย, เขตขาย(หรือ dimension) · mockup เติมแค่ **ชื่อย่อ**

## 2. เจ้าหนี้ (Vendor) — 🚩 ขาดหน้า master
| field เดิม | ① BC API v2.0 | ② mockup | verdict |
|---|---|---|---|
| Code·Name·Address·อำเภอ·จังหวัด·Tel·TAXID·Currency | ✅ standard (field น้อยกว่า customer · ไม่มี creditLimit/salesperson/type) | ⚠️ มีแค่ search-panel (อ่าน) | **ยังไม่มีที่กรอก** |
| ที่อยู่/อำเภอ/จังหวัด/ชื่อย่อ/กลุ่มย่อย/PersonType | ✅ standard / defaultDimensions | ❌ **ขาด** | 🚩 **ไม่มีหน้า master เต็ม** |
| **TaxBranch** | ⚠️ custom field+API | ❌ | 🔧 BC dev |
| Title/PersonType(นิติ) | ⚠️ (vendor ไม่มีแม้ type) | ❌ | 🔧 custom |
| Group/Type/จ่ายชำระ | ✅ defaultDimensions | ✅ (dropdown) | 🔒 BC dropdown |
| AP aging/Lead time/Buyer/Commitment | — | ✅ (mockup เพิ่ม) | 🟠 portal |

**สรุป:** 🚩 **จุดที่ต้องตัดสิน** — พอร์ทัลยังไม่มี vendor master เต็ม (ที่อยู่/TaxBranch/PersonType/currency ไม่มีที่กรอก) · **ตัวเลือก:** (a) BC ถือ 100% พอร์ทัลอ่าน dropdown (เหมือน CF cut) · (b) สร้าง `md3-vendor-master` UI เบา (field portal ถือ + dropdown BC) → **ต้อง grill ก่อนสร้าง**

## 3. สินค้า (Item) — custom เยอะสุด แต่ mockup แข็งแรงสุด
| field เดิม | ① BC API v2.0 | ② mockup | verdict |
|---|---|---|---|
| รหัส·ชื่อ·ราคา·หน่วยหลัก·category·posting·VAT | ✅ standard (number·displayName·unitPrice·baseUnitOfMeasureId·itemCategoryId·postingGroup·taxGroupId) | ✅ | **standard พอ** |
| **8 มิติ (DIM1-8)** | ✅ **defaultDimensions** | ✅ (โชว์ครบ) | 🔒 BC dropdown |
| ต้นทุน Average (costing method) | ⚠️ unitCost มี · **Average/FIFO ไม่มีใน API** | ✅ Avg/Last/Std | 🔧 custom ถ้าตั้งผ่าน API |
| **หน่วย ratio (Qty per UoM)** | ⚠️ **custom API page** (v2.0 ตัด unitConversion) | ⚠️ ต้องเช็ค | 🔧 BC dev |
| **Serial tracking (Normal)** | ⚠️ **custom API** (Item Tracking Code ไม่มี v2.0) | ✅ Serial Tracking | 🔧 BC dev |
| ยี่ห้อ/รุ่น/หน่วยออกฟอร์ม/rebate | ⚠️/❌ custom/dimension | ✅ ยี่ห้อ/รุ่น · ⚠️ rebate ไม่เห็น | 🔧 custom/dimension |
| Barcode/GTIN | ✅ gtin (1 ค่า) · ต่อหน่วยต้อง custom | ✅ | บางส่วน |
| สถานะสีสินค้า (1.5.2.L) | — | ❌ | 🟢 **เพิ่ม cf-master-settings** |
| สินค้าทดแทน (1.5.2.M) | ✅ itemVariants (บางส่วน) | ❌ | เลื่อน phase หลัง |
| spec แอร์/Min-Max-ROP/landed cost | — | ✅ (mockup เพิ่ม) | 🟠 portal |

**สรุป:** mockup แข็งแรงสุด · แต่ **BC dev ต้อง custom เยอะ:** หน่วย ratio · serial tracking · costing method · ยี่ห้อ/รุ่น(หรือ dimension) · rebate · barcode ต่อหน่วย · เพิ่ม **สีสินค้า** (cf-master-settings) · ยืนยัน **rebate group**

---

## 📋 สรุป action (3 กลุ่ม)

**🟢 งาน mockup (พอร์ทัล · ทำเองได้):**
- ลูกค้า: เติม field **ชื่อย่อ**
- สินค้า: เพิ่ม **สีสินค้า** (`cf-master-settings`) · ยืนยัน **rebate group** ในฟอร์ม · เช็คหน่วย ratio conversion
- เจ้าหนี้: 🚩 **grill ก่อน** — ทำ md3-vendor-master หรือให้ BC ถือ

**🔧 งาน BC dev (custom extension + API page · ไม่ใช่งาน mockup):**
- **TaxBranch (สาขาภาษี)** — ทั้ง customer + vendor + โยง Entity Tag/Dual-Book
- **หน่วย ratio ต่อ item** (Qty per UoM · v2.0 ไม่มี)
- **Serial/Lot tracking API** (Item Tracking Code)
- คำนำหน้าไทย · costing method · ยี่ห้อ/รุ่น (หรือทำเป็น dimension) · rebate · barcode ต่อหน่วย
- **หลัก:** standard API page extend ไม่ได้ → ทุก custom field ต้องสร้าง custom API page ใหม่ (`ODataKeyFields=SystemId`)

**🔒 ใช้ BC standard (พอร์ทัลอ่าน dropdown · ไม่ทำ CRUD):**
- กลุ่ม/ประเภท/8 มิติ ทั้งหมด → **`defaultDimensions` entity** (นี่คือกลไก BC สำหรับ dimension)
- item category · posting groups · payment terms · currency · sales territory

**⏭️ ไม่ใช่งาน master:** ประเภทสมาชิก+ส่วนลด (→ PM/pricing) · ระดับราคา (→ pricing tables)

> 📊 เวอร์ชันอ่านง่าย (HTML): `_reference/MasterData-3way-analysis.html`

---

## 🖼️ ออกแบบการเก็บรูป / วิดีโอ / เอกสารสแกน
**หลักการทอง: อย่าเก็บ binary ใน BC** (DB บวม·ช้า·ไม่มี CDN) → ไฟล์จริงไป **external object storage (Azure Blob) · BC/พอร์ทัลเก็บแค่ URL/reference**

**แยก 2 ประเภท:**
| | 🖼️ รูปสินค้า/วิดีโอ | 📄 เอกสารสแกน |
|---|---|---|
| ที่เก็บ | **CDN bucket (public)** URL คงที่ | **private bucket + RBAC** signed URL หมดอายุ |
| ผูกกับ | item number | customer/vendor/promo |
| reuse | เว็บ/e-commerce ดึง URL ตรง | ไม่ reuse · แนบ+audit+version |

**สถาปัตยกรรม 4 ชั้น:** พอร์ทัล upload → resize/thumbnail/scan → Azure Blob → บันทึก reference `{entityType·entityId·fileType·url·filename·size·uploadedBy·date·tags·isPublic·version·sortOrder}`

**รูปสินค้า→เว็บ:** URL คงที่ต่อ item (gallery หลายรูป·sortOrder) · API คืน array image/video URL → เว็บ render ตรง · gen หลายขนาด (thumb/full) · วิดีโอ=ไฟล์+poster หรือฝัง YouTube เก็บลิงก์

**เอกสาร:** private + signed URL + RBAC · version (ไม่ทับเก่า) · audit log (ใคร upload/ดู) · tag (จดทะเบียน/สัญญา/โปรโมชัน) · OCR-ready อนาคต

**💡 เสนอ shared component `swt-media`** — รวม pattern แนบไฟล์ที่กระจายอยู่ (sv1 scan·po2 evidence·WH-5 photo·item image) เป็นตัวเดียว `swtRenderMedia(el,{entity,entityId,type,public,maxFiles})` — image/video=gallery · doc=attachment+version (เหมือน swt-payment/swt-master-editor)

**❌ ไม่ทำ:** base64/binary ใน BC/DB · URL ถาวรสำหรับ private · ไฟล์ใหญ่ผ่าน BC API
