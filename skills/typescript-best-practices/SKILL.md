---
name: typescript-best-practices
description: "TypeScript rules for Omakase: discriminated unions, branded types, constructive modeling, unknown over any, no unvalidated assertions, boundary parsing. Use when designing types, writing or reviewing TypeScript signatures, or a type-related bug appears."
---

# TypeScript best practices

Apply Omakase's interface discipline first. [`MODULES-AND-SEAMS.md`](../omakase-refine/MODULES-AND-SEAMS.md) names the seams and authority boundaries. This skill grounds that discipline in TypeScript syntax.

| Rule | Summary |
|------|---------|
| Discriminated unions | Model variants with a `kind` literal discriminant so impossible states can't be represented. No optional-field bags. |
| Branded types | Brand primitives so they cannot be mixed up. Validate in one constructor and keep the required assertion inside it. |
| Constructive modeling | Build the shape so the illegal value can't be constructed. `[T, ...T[]]` for non-empty, `[T, T][]` for even length, `start` plus `duration` for a range. Not a runtime guard, not a wish for refinement types. |
| Simplest total type | Keep `T[]` while every operation on it stays total. Strengthen to `NonEmpty<T>` only where the loose type forces `!`, a cast, or a "should never happen" throw. |
| `unknown` over `any` | External data is `unknown`. `any` disables type checking everywhere it touches. |
| No unvalidated assertions | Prefer narrowing and constructive parsing. Keep a required `as` local to a validated boundary or branded constructor. |
| Narrowing hierarchy | Discriminant switch > `in` operator > `typeof`/`instanceof` > user-defined type guard > validated local assertion. |
| Type guards | Must verify the claim. A lying guard is worse than `as` because the bug hides behind a name that says it's safe. Name them `isX` or `hasX`. |
| Exhaustiveness | Inline `const _exhaustive: never = x` in default arms so the compiler errors when a new variant is added. |
| `satisfies` over `as` | Validates the value without widening literal types. |
| Boundary validation | Validate where data crosses in, then trust types inside. Omakase boundaries include preload IPC, document operations, persisted data, and RPC payloads. |
| Schema-derived types | Reach for `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof` before declaring a new interface. |
| Object args | Pass objects, not positional, so argument order is self-documenting. Skip on hot paths (per-frame render, tokenizers, parsers). |
| Real tests | Don't mock what you can run. Prefer the framework's real test primitives with leak/disposable checks, and verify UI in a running build. Mock only what you can't run locally. |
| Diagnostics | Add bounded context to errors and warnings. Do not add raw debug logs. Use the existing telemetry stores only for durable product evidence. |

Examples: `references/patterns.md`.
