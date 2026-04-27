# CLAUDE.md — Fiction Engine Rules

## Purpose
Write long-form fiction that does not read like an LLM produced it. Prioritize specificity, tension, irregularity, and consistency. Each novel folder has its own CLAUDE.md that overrides or extends these rules — defer to the story-specific file for genre, voice, and character framing.

These rules are defaults, not a rigid template. Break them when breaking them creates a clear, intentional improvement. The goal is prose that is recognizably human, not prose that satisfies a checklist.

---

## Core Behavior

- Use concrete, observable detail instead of abstraction
- Maintain tension; do not resolve conflicts quickly or cleanly
- Vary sentence length and structure; uneven rhythm is the goal
- Keep character knowledge, timeline, and continuity accurate
- Match the author's established voice; do not drift toward neutral, literary, or "publishable" register

---

## Avoid (LLM-recognizable patterns)

**Phrasing**
- Em dashes (—), en dashes (–), and double hyphens (--) anywhere in prose, dialogue, thoughts, system blocks, or headings: forbidden. Use a period, comma, or new sentence.
- Mirrored contrast scaffolds: "not X, but Y" / "It wasn't X. It was Y." / "More than X. It was Y." / "Not because X, but because Y" — state the thing directly
- Hedge openers and pivot transitions starting a sentence: "Still," "And yet," "Even so," "In that moment," "For a moment," "Somehow," "Somewhere"
- Predictive narrator tells: "He didn't know it yet, but…", "Little did she know…", "It would be hours before…"
- AI flourish phrases: "a testament to," "a stark reminder," "spoke volumes," "hung in the air," "etched in his mind," "dawned on him," "in that moment he knew," "the weight of," "the air was thick with"
- Pseudo-poetic mood lines that deliver no information ("The silence stretched.", "Time seemed to slow.", "The world held its breath.")
- "The kind of [noun] that [abstract clause]" — cut the framing
- "Despite himself" / "in spite of everything" / "against his better judgment" — show the action, drop the framing
- Period-comma swap for emotional emphasis: "She was tired. Tired in a way she couldn't name."
- Slow-motion narration without a perceiver

**Structure and rhythm**
- Triadic lists (A, B, C); two-item parallel lists stacked by comma; "and…and…" three-item chains
- Anaphora: three or more consecutive sentences beginning with the same word
- Negative inventory ("no voices, no engines, not even a dog") — convey absence through what is present and wrong
- Balanced sentence pairs with matched cadence (long–short, paired clauses, mirrored phrasing)
- Rule-of-three rhythmic closers ending paragraphs
- Echoed final words: ending a paragraph by repeating a word from the previous sentence for resonance
- Refrain repetition across a chapter unless genuinely load-bearing
- Tidy cause-and-effect chains; clean, symmetrical paragraphs

**Punctuation**
- Semicolons in narration used to balance two clauses for rhythm
- Ellipsis (…) in narration; only allowed inside dialogue or thoughts when a character genuinely trails off
- Parenthetical asides in narration; commit the information or cut it
- Colons in prose narration (allowed in system/LitRPG blocks or when read/spoken in text)
- Mixing straight and curly quotes within the same chapter

**Word-level**
- Adverb stacking: avoid more than one "-ly" adverb in a sentence; prefer a stronger verb
- Weasel hedges in narration ("seemed to," "appeared to," "almost," "as if," "as though"): use sparingly, do not stack
- "Began to" / "started to" as filler verbs — use the verb itself
- Multiple negatives in one sentence; "not just" as a qualifier; "No X, no Y, no Z" structures
- Explicit emotion labeling; clichés; overuse of similes or metaphors
- Generic or abstract-heavy narration

---

## Scene Rules

Each scene must:
- Include a decision
- Include a cost or tradeoff
- Change something (stakes, knowledge, or power)

Dialogue should:
- Include interruption, deflection, or misalignment
- Avoid perfect logic or structured debate

---

## Consistency

- Preserve established details (characters, setting, timeline)
- Prevent characters from knowing information they have not been given
- Maintain voice and cadence across chapters
- Defer to the story-specific CLAUDE.md and continuity_log.json before output

---

## Style Control

- Fewer, more precise details over many vague ones
- Allow fragments and uneven phrasing where they earn the space
- Include minor, non-essential human detail
- Reduce overly polished or "complete" sentences

---

## Self-Check

Before output:
- No em dashes, en dashes, or double hyphens anywhere
- No hedge openers, AI flourish phrases, or pseudo-poetic mood lines
- No mirrored-contrast scaffolds
- No banned phrasing or rhythmic templates (rule-of-three closers, balanced pairs, anaphora)
- No parentheticals or ellipses in narration
- Scene produces change or consequence
- Dialogue is not overly clean or explanatory
- Prose is not uniformly smooth, balanced, or symmetrical
- Voice matches established register; no literary drift

---

## Rule

If the writing feels clean, balanced, predictable, or "publishable," pull it back. Make it more specific, more uneven, and more recognizably the author's. The goal is fiction that no model would produce by default.
