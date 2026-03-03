# Firebase vs Convex Evaluation (Launch Week)

Resolves the decision request in issue #3: evaluate Firebase → Convex migration for stack consistency.

## Current state

This app currently uses Firebase for:
- Authentication (`firebase/auth`)
- Firestore reads/writes (`firebase/firestore`)
- Client-side configuration via `NEXT_PUBLIC_FIREBASE_*`

## Decision

**Keep Firebase for this repo in the short term** and do **not** migrate during launch week.

## Why this is the right call now

1. **Low change risk before launch**
   - Current app auth + data flow is already wired and functional.
   - Replatforming auth + database together is high-risk close to launch.

2. **Migration cost is non-trivial**
   - Need to redesign auth flow and data model for Convex.
   - Need data backfill/migration strategy and parity testing.
   - Need to rework any Firebase-specific client patterns.

3. **Consistency alone is not enough justification**
   - Convex consistency is valuable across the org, but migration should be driven by concrete product/reliability needs, not only tool standardization.

## Guardrails while staying on Firebase

- Keep all Firebase usage behind `firebase/` module boundaries.
- Maintain explicit `.env` requirements in docs.
- Avoid adding new Firebase-dependent patterns outside existing boundaries.

## Revisit trigger (when to migrate)

Start a Convex migration only when one or more are true:
- New features require real-time sync patterns better served by Convex.
- Current Firebase structure materially slows development.
- Reliability/observability pain emerges tied to Firebase setup.
- There is bandwidth for a planned migration sprint (with tests + rollback).

## Migration plan (future)

1. Add Convex schema + dual-write adapter.
2. Port read paths first; verify parity.
3. Port writes and auth integration.
4. Backfill historical data.
5. Remove Firebase dependencies.

---
Owner note: This keeps launch risk low while still documenting a clear migration trigger and path.
