# Skill: Public Booking Intake

## Purpose
Accept customer booking requests from public channels and convert them into managed jobs.

## Inputs / Preconditions
- Public booking payload (name, contact, issue/service type, preferred slot, address).
- Shop routing context (QR code token, channel metadata).

## Validation Rules
- Minimal customer fields required before acceptance.
- Anti-spam/rate-limit policy for public endpoints.
- Booking status transitions are controlled.

## Lifecycle
- Booking: `pending -> confirmed -> converted` or `rejected/cancelled`.
- Converted booking must store linked `job_id`.

## Side Effects
- Create admin queue item for review/confirm.
- Emit notifications on confirm/reject/convert.
- Write lifecycle events to audit logs.

## API + Table Contracts
- Public endpoint (unauth) for create.
- Auth endpoints for review and conversion.
- Booking table includes channel and source metadata.

## Error Handling
- Invalid or expired booking token yields controlled rejection.
- Conversion conflict returns current state and linked job if exists.

## Acceptance Checklist
- Public submission works from mobile-first form.
- Shop can confirm/reject/convert with reason.
- Duplicate conversion is prevented.
