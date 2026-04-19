# AGENTS.md

## Purpose
This repository uses `.agents/` as a structured context workspace for Cowork sessions.
Keep this file short. Store policy here, not task history.

## Reading Order & Trust Priority
Before non-trivial work, read in this order. When information conflicts, higher items win.

1. Latest explicit user instruction
2. Verified codebase state
3. `.agents/AGENTS.md` (this file)
4. `.agents/active.md`
5. Most relevant file in `.agents/topics/`
6. Most recent file in `.agents/sessions/`
7. `.agents/index/repo-tree.md`

If notes conflict with the codebase, trust the codebase.

## Context System

| Path | Purpose |
|------|---------|
| `.agents/active.md` | งานที่กำลังทำอยู่ตอนนี้ — focus, blockers, next action |
| `.agents/topics/` | ความรู้ถาวรที่ใช้ได้หลาย session |
| `.agents/sessions/` | checkpoint และ session notes |
| `.agents/private/` | โน้ตส่วนตัว (gitignored) |
| `.agents/index/repo-tree.md` | แผนผัง directory (auto-generated) |

## Rules
- อ่าน `.agents/active.md` ก่อนเริ่มงานสำคัญทุกครั้ง
- อัปเดต `.agents/active.md` เมื่อ focus, blockers, หรือ next action เปลี่ยน
- สร้าง session note เมื่อถึง checkpoint
- เพิ่มข้อมูลใน `.agents/topics/` เฉพาะเมื่อเป็นความรู้ถาวร
- บันทึก evidence: file paths, คำสั่ง, ผลลัพธ์, การตัดสินใจ

Do not store: secrets, raw transcripts, chain-of-thought, speculative notes.
