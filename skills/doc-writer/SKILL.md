---
name: doc-writer
description: >
  Write and rewrite technical prose in clear STE-style English (docs, plans,
  READMEs, design docs, PR descriptions, error messages, release notes,
  runbooks, comments). Load this skill before drafting or editing any of those.
  Also use when the user wants plain writing, less AI slop, or a controlled
  style. Do not use for code, identifiers, or command syntax.
---

# doc-writer

Write technical prose in **STE** (ASD-STE100 Simplified Technical English),
plus a short house list of slop bans. Goal: docs and plans a human can scan
and trust. STE strips voice on purpose — do not use this for marketing copy,
essays, or anything that needs a brand voice.

**Code is out of scope.** Leave identifiers, APIs, paths, flags, and command
blocks unchanged. Prose around them follows this skill.

## Modes

Pick one per document. State it only if the user asks; otherwise choose and apply.

| Mode | Use for | Dictionary | Length caps |
|------|---------|------------|-------------|
| **strict** | procedures, runbooks, safety text, error messages, install steps | prefer common short words; no marketing words | instructions ≤20 words; descriptive ≤25 |
| **flavored** | READMEs, plans, design docs, PR bodies, release notes | same word and slop rules; technical nouns stay free | aim ≤25 words per sentence; split at ~30 |

**flavored** keeps enough range to read naturally. It does **not** drop the
word list, the slop bans, active voice, or one-idea sentences.

Default: **strict** for steps and errors; **flavored** for everything else.

## Substance first

Form is not a license to thin the text.

- Keep every concrete fact, knob, limit, name, and constraint from the source
  or the task. Shorten the sentence, not the content.
- If a README lists thresholds, TTLs, and namespaces, the rewrite still names
  them (a short list is fine).
- If a claim has no referent, keep it or flag it. Do **not** invent facts to
  sound complete. Do **not** delete real payload to chase a lower word count.
- This skill fixes the **form** of slop. It cannot make a hollow paragraph true.

## Rules

### Words

- One name for one thing. Do not rename the same item mid-document.
- Prefer the short common word:

  | Use | Avoid |
  |-----|--------|
  | start | begin, commence, initiate |
  | use | utilize, leverage |
  | help | facilitate |
  | make sure | ensure |
  | before | prior to |
  | after | subsequent to |
  | about | regarding, concerning |
  | get | obtain, acquire |
  | show | demonstrate |
  | also | additionally, furthermore, moreover |

- One meaning per word in a given text ("fall" = move down, not decrease).
- American spelling.
- No marketing adjectives: seamless, robust, powerful, cutting-edge,
  effortless, world-class, next-generation, revolutionary, and kin.

### Verbs

- Active voice when the actor is known: "the parser reads the file", not
  "the file is read by the parser".
- Use a verb for an action: "analyze the log", not "perform an analysis of
  the log".
- No stacked auxiliaries or throat-clearing: not "it is important to note
  that this may help to improve". Write "this improves X".
- Prefer a simple tense over an "-ing" main verb when both work.

### Sentences and paragraphs

- One instruction or one idea per sentence.
- No contractions. Use articles (a, an, the, this, these) where English wants them.
- No semicolons. Write two sentences.
- No em dashes. Use a period, a comma, or a list.
- One topic per paragraph. At most six sentences.

### Slop shapes (house bans, beyond base STE)

Cut these even if the sentence is otherwise legal:

- Triads used as decoration: "fast, reliable, and secure"
- "Not only X, but also Y" / "It is not just X, it is Y"
- Empty openers: "in today's fast-paced world", "delve", "landscape",
  "it is worth noting that"
- Fake weasels: "sensible defaults", "minimal friction", "battle-tested",
  "out of the box", "vendor lock-in" as decoration (state the real constraint)

### Structure by genre

**Plans** (implementation, migration, design):

1. Goal — one or two sentences: what done looks like.
2. Scope — in scope / out of scope as short bullets.
3. Steps — numbered vertical list, imperative, one action per item.
   Put conditions before the action ("If X fails, do Y").
4. Risks or open questions — only real ones; no filler.
5. Done when — checkable completion criteria.

Do not pad plans with overview theatre, "why this matters" essays, or
synergy paragraphs unless the user asked for rationale.

**Docs** (README sections, design notes, comments):

- Lead with what the thing does, then how to use it, then details.
- Prefer vertical lists for three or more parallel items.
- Error messages: what happened, why, what to do next. No apology fluff.

**PR descriptions:**

- What changed (bullets).
- Why (one short paragraph or bullets).
- How to verify (numbered steps).

## Output discipline

When the user asks for a rewrite or a draft of prose:

- Return only the requested text unless they ask for commentary.
- Match the genre structure above when drafting plans or PRs from scratch.
- Keep fenced code, headings levels, and link targets intact unless asked
  to restructure.

## Self-lint (completion criterion)

Before you return prose, check every item. Fix failures. Done only when all pass:

1. Any sentence over the mode cap? Split it.
2. Any semicolon or em dash? Replace with a period, comma, or list.
3. Any contraction? Expand it.
4. Any passive clause with a known actor? Make it active.
5. Any "-ing" main verb, nominalization ("perform an analysis"), or phrasal
   filler ("spin up" → "start") where a plain verb works? Replace it.
6. Same thing named two ways? Pick one name.
7. Any marketing adjective or slop shape from the house bans? Remove or
   replace with a concrete claim.
8. Any concrete fact from the source missing in the rewrite? Put it back.
9. Plan missing goal, steps, or done-when? Add the missing piece from
   available context; ask only if blocked.

## Examples

### README blurb (flavored)

Before:

> Traditional caches miss constantly in LLM workloads because users rarely
> phrase the same question identically — fluxcache solves this by embedding
> incoming prompts and matching them against previously cached queries within
> a configurable similarity threshold. It ships with sensible defaults so you
> can get semantic caching running in a few lines of code, while exposing the
> knobs — similarity thresholds, TTLs, namespacing, custom scoring — that real
> applications need as they scale.

After:

> A normal cache matches requests by exact text. A small change in wording
> causes a cache miss. fluxcache compares the meaning of a new prompt with the
> prompts already in the cache. If two prompts are close enough, fluxcache
> returns the stored response. You can set the similarity threshold, the TTL,
> the namespace, and the scoring function. Default values are enough for a
> first setup.

### Error message (strict)

Before:

> You've hit the rate limit. This ensures fair access for all users. Please
> wait and try again using the Retry-After header.

After:

> The API allows a maximum of 100 requests per minute for each account. Your
> application sent more requests than this limit allows. The server rejected
> the extra requests to protect the system for all users. Check the
> `Retry-After` header in the response for the exact wait time. Wait for this
> time, then send your request again.

### Plan step (flavored)

Before:

> Next we'll leverage the existing auth middleware to seamlessly facilitate
> token refresh across services, ensuring robustness prior to initiating the
> cutover.

After:

> 1. Extend the existing auth middleware so each service can refresh tokens.
> 2. Verify refresh on each service before cutover.

## Reference

Free official STE standard (do not paste it in full; it is copyrighted):
https://asd-ste100.org
