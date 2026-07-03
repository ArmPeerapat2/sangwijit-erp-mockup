# Document Inventory & Reconcile Map — 2026-07-02

> เทียบเอกสารสำคัญข้าม 3 branch · วันที่ · เวอร์ชันที่ใช้ · ตัวซ้ำ
> 3 branch (ทุกอันบน GitHub): `expense-management-app`(base a60b987) · `claude/compassionate-tu-ebb1cc`(session a7dbd5a) · `wip/primary-folder-2026-07-02`(wip 828fada)

## 1. สถานะเทียบ + วันที่ + action reconcile

**A. Spec ที่ wip ไม่แตะ → ใช้เวอร์ชัน session ได้เลย (ไม่ต้อง merge)**

| เอกสาร | วันที่ | เวอร์ชันใช้ | หมายเหตุ |
|---|---|---|---|
| SL_sales.md | 2026-07-02 | **session** | wip=base · session เพิ่ม SL-CN grill/Bill-to-Ship-to/auto-expire |
| PO_purchase.md | 2026-07-02 | **session** | wip=base · session เพิ่ม PO-8 rename/PO-7/serial |
| FI_finance.md | 2026-07-02 | **session** | wip=base · session เพิ่ม WHT จุดเดียว |
| WH_warehouse.md | 2026-07-02 | **session** | wip=base · session เพิ่ม Transfer ownership |
| CF_config.md | 2026-07-02 | **session** | wip=base · session เพิ่ม CF-2.6 canonical |

**B. แก้ทั้ง 2 ไลน์ → ต้อง merge เนื้อหาจริง (แค่ 4 ไฟล์)**

| เอกสาร | วันที่ | ต้องรวมอะไร |
|---|---|---|
| SKILL.md | 2026-07-02 | wip: refactor · session: Cross-Module Flow Rules |
| SV_service.md | 2026-07-02 | wip: ? · session: CL decomposed + Menu List sync |
| CLAUDE.md | 2026-07-02 | wip: ? · session: CF-7→CF-2.6 |
| active.md | 2026-07-02 | wip: ? · session: decision log 2 grill + closeout |

**C. Unique เฉพาะ session → เพิ่มตรง ๆ (ไม่ชน)**

| เอกสาร | วันที่ | สถานะ |
|---|---|---|
| svc-claim-jobtype-spec.md | 2026-07-02 | เฉพาะ session |
| flow-redundancy-analysis.md | 2026-07-02 | เฉพาะ session |
| file-status-audit.md | 2026-07-02 | ⚠️ ยังไม่ commit (worktree) |
| backup-storage-map.html | 2026-07-02 | ⚠️ ยังไม่ commit (worktree) |
| document-inventory.md (ไฟล์นี้) | 2026-07-02 | ⚠️ ยังไม่ commit (worktree) |

**D. wip ลบทิ้ง แต่ session เก็บไว้ (docs history)**

| เอกสาร | สถานะ |
|---|---|
| .agents/sessions/2026-04-16.md | session ✓ · wip ❌ ลบ |
| .agents/topics/session-handoff-2026-06-01.md | session ✓ · wip ❌ ลบ |
| .agents/sl-design-structure.md | session ✓ · wip ❌ ลบ |

---

## 2. เอกสารที่ซ้ำกัน (ต้องจัดการ)

### 🔴 ซ้ำแบบเนื้อหาเหมือนเป๊ะ (byte-identical) — ไม่อันตราย แต่ควรรู้
| ไฟล์ | ซ้ำที่ไหน | หมายเหตุ |
|---|---|---|
| flow-redundancy-analysis.html | session = wip (hash 3a0bf14) | เหมือนกัน 100% (copy ไปตอน session) |
| flow-workflow-map.html | session = wip (hash 621157a) | เหมือนกัน 100% |

### 🟡 ซ้ำแบบ topic เดียว 2 format (md + html)
| topic | ไฟล์ซ้ำ | แนะนำ |
|---|---|---|
| Flow Redundancy Audit | `flow-redundancy-analysis.md` + `.html` | เก็บ .html (อ่านง่าย) · .md เป็น source · ไม่ต้องลบ แต่รู้ว่าคู่กัน |

### 🟡 ซ้ำแบบ topic ทับกัน (ควรพิจารณายุบ)
| topic | ไฟล์ที่ทับ | แนะนำ |
|---|---|---|
| Shared Components | `shared-components.md` + `shared-components-comparison.md` + `shared-components-fielddesign.md` (3 ไฟล์) | ตรวจว่าเนื้อหาต่างมุมจริงไหม · ถ้าซ้ำ → ยุบเหลือไฟล์เดียว |
| Page/File status audit | `file-status-audit.md` (ใหม่) ทับ `reconcile-mockup-vs-flow-matrix.md` (เก่า) | 2 ตัวทำ audit สถานะหน้าเหมือนกัน · file-status-audit ใหม่กว่า+ครบกว่า → reconcile-matrix เป็น reference เก่า |

---

## 3. สรุป reconcile (ยึด wip เป็นฐาน)

- **merge จริงแค่ 4 ไฟล์:** SKILL.md · SV_service.md · CLAUDE.md · active.md
- **spec 5 ไฟล์ใช้ session ตรง ๆ:** SL/PO/FI/WH/CF _*.md (wip ไม่แตะ)
- **เพิ่ม unique 5 docs:** svc-claim-spec · flow-redundancy.md · file-status-audit · backup-storage-map · document-inventory
- **ทุกเวอร์ชันปลอดภัยบน GitHub** — เทียบ/กู้ได้ตลอด
