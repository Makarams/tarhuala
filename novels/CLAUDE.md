# CLAUDE.md — Fiction Engine Rules

## Purpose
Improve the author's draft while preserving their voice. Prioritize specificity, tension, and consistency. Do not summarize or replace the author's voice with a literary one.

**Minimum:** 1500 words per chapter. If the source exceeds 1500 words, match or exceed it. Reach the minimum by deepening texture and physical detail within existing beats — not by padding or inventing new scenes.

---

## Genre
Fantasy, speculative fiction, or genre-blended worlds — all with LitRPG elements (stats, levels, skills, system notifications). Each story has its own genre definition in its story-specific CLAUDE.md; defer to that file for genre framing. Across all stories: politics may exist in the background but should not drive the plot. Prioritize story progression, humor, character traits, dialogue, and fight scenes. Groups and factions may exist in the world — do not overemphasize them unless they are directly relevant to the conflict.

---

## Naming
Names should feel deliberate and carry weight — concise, intentional, not generic filler. "Bob" or "John Smith" carry no weight; "Kael," "Sera," or "Jin Harrow" do. Chinese webnovel naming sensibility is a preference, not a rule: characters can come from anywhere, and names should fit their cultural background naturally. Do not force naming conventions where they don't belong. If the author's draft provides a name, use it.

- **Locations:** compound descriptive names evoking geography, element, or legend — e.g., Ashveil City, Ironmist Peak.
- **Factions/sects:** element or concept + structural suffix — e.g., Pale Ember Sect, Ironridge Hall.
- Once a name is assigned in continuity_log.json, it does not change.

---

## Chapter File Naming
Every chapter is saved as a `.docx` file. The filename format is:

```
Chapter_N_Chapter_Title.docx
```

Rules:
- `N` is the chapter number with no leading zeros: `Chapter_1`, `Chapter_14`.
- The title portion uses title case with underscores between words: `Chapter_1_New_Life`, `Chapter_6_Seeking_Class_Clue`.
- Titles are two to three words. One word is rare and only used when nothing else fits. Four or more words are forbidden.
- The title describes the chapter content plainly. It does not editorialize.
- The word "Revised" and any variant (Revised, Rewrite, Edit, Updated, Final, V2) are forbidden in the filename.
- Colons are forbidden in filenames.
- Em dashes are forbidden in filenames.
- The filename contains only the chapter number and title. It contains nothing else.

Correct examples: `Chapter_1_New_Life.docx`, `Chapter_3_Market_Fight.docx`, `Chapter_12_Veilstone.docx`
Wrong examples: `Chapter_1_New_Life_Revised.docx`, `Chapter_3_The_Market_Fight_Scene.docx`, `Chapter_12_Veilstone:_The_Ruin.docx`

---

## Point of View
POV is established by the author's draft and recorded in continuity_log.json on first appearance.

- **Third-person close:** "he / she / they." Thoughts in single quotes: 'Like this.'
- **First-person:** "I." The narrator's voice IS the character's voice. Single-quote thoughts used only for sharp self-interruptions that break through the narrating flow.

POV does not change mid-chapter unless the author's draft explicitly shifts it.

---

## Voice and Style
These are defaults, not rigid rules — choose what fits the context and story.

- Narration is close and readable, not literary or elevated
- Avoid LLM-sounding prose: neat cause-effect chains, tidy self-contained paragraphs, perfectly balanced rhythm — if it could appear in a published literary novel, it is too heavy
- Dialogue is casual and plain; contractions and casual grammar ("gonna," "kinda") are correct for this register
- Vary dialogue tags naturally; a beat can replace a tag; do not default to "said" every line, and do not strain for exotic tags either; do not use both a tag and a beat that repeat the same information
- Action beats go mid-dialogue or after speech, never before
- Action beats are concrete physical detail, not emotional summary — not "he looked uncomfortable" but a visible physical act
- Do not announce cause and effect — state the result; the context carries the reason
- Sound effects inline, capitalized, with exclamation mark: "The blade came down with a Slash! and the vine split." Part of the sentence, never standalone; reserve for impacts, sudden noises, fast action; multiple simultaneous sounds stay in sequence within the same sentence; never follow a sound effect with a sentence explaining it
- The narrator may make dry, light observations — not explanations of why characters do things
- System and LitRPG elements are presented matter-of-factly, not with wonder
- Include minor human detail to ground scenes; do not stack it
- Avoid hedge openers and AI pivot transitions — start the sentence with the substance, not the bridge ("Still," "And yet," "In that moment")
- Avoid AI flourish phrases ("a testament to," "the weight of," "hung in the air") and pseudo-poetic mood lines that add no new information
- Prefer one strong verb to verb-plus-adverb constructions; cut filler verbs ("began to," "started to") and stacked "-ly" adverbs
- **Tense:** use what fits the context. Present tense suits live action; past tense suits backstory, recollection, or established prose tradition. Do not mix tenses within a scene. Backstory and recollection passages must be written fully in their own tense.
- **Person:** first or third, whichever the author establishes. See Point of View.

---

## Numerals
Use numerals for measurements, ages, stats and levels, distances, quantities, percentages, weights, dates, and times. Spell out only when a number opens a sentence.

---

## Character Consistency
On first appearance, record the main character's default register in continuity_log.json: how they think, speak, react under pressure, and what they care about — specific behavioral markers, not a general summary.

- Preserve these markers every chapter: what they joke about, what they ignore, what makes them uncomfortable, how they deflect
- Do not let stress or high stakes upgrade their voice into something more reflective or literary
- If a chapter contradicts the established personality, surface the conflict and resolve toward the established version unless the story provides an explicit reason for the shift

---

## Cultural Realism
Characters can come from anywhere. Even within the same culture, people vary widely — a character can be rude, violent, gentle, or anything else their role demands. Cultural differences between characters may produce discomfort, conflict, or nothing at all; all of these are realistic. Do not force cultural elements, naming conventions, or sensibilities where they do not fit the story or the character.

---

## Banned Patterns

These are default prohibitions for prose control. Apply unless breaking them creates a clear, intentional improvement. The goal is to keep the prose specific, uneven, and recognizably human — not to enforce a rigid template.

**LLM and literary drift**
- Literary or elevated prose; abstract-heavy or generic narration
- Explanatory narrator intrusion — let actions and observations speak; remove reasoning chains
- Overly analytical narration; paragraph-length reaction beats; step-by-step breakdowns
- Atmosphere that does not deliver specific, concrete information
- Explicit emotion labeling; clichés; overuse of similes or metaphors
- Hedge openers and pivot transitions starting a sentence: "Still," "And yet," "Even so," "In that moment," "For a moment," "Somehow," "Somewhere" — used to soften or balance the previous beat
- AI flourish phrases: "a testament to," "a stark reminder," "spoke volumes," "hung in the air," "etched in his mind," "dawned on him," "in that moment he knew," "the weight of," "the air was thick with"
- Pseudo-poetic mood lines that deliver no information: "The silence stretched.", "Time seemed to slow.", "The world held its breath."
- "The kind of [noun] that [abstract clause]" — cut the framing, state the noun
- Predictive narrator tells: "He didn't know it yet, but…", "Little did she know…", "It would be hours before…"
- "Despite himself" / "in spite of everything" / "against his better judgment" — show the action, drop the framing
- Slow-motion narration without a perceiver

**Punctuation and typography**
- Em dashes (—), en dashes (–), and double hyphens (--) anywhere in prose: forbidden. This applies to narration, dialogue, thoughts, system blocks, and headings without exception. Use a period, comma, or new sentence.
- Semicolons in narration used to balance two clauses for rhythm: forbidden; use a period
- Ellipsis (…) in narration: forbidden; allowed only inside dialogue or thoughts when a character genuinely trails off
- Parenthetical asides in narration: forbidden; commit the information or cut it
- Colons in prose narration: fold into the sentence or use a period; allowed in system/LitRPG blocks or when read/spoken in text
- Stay consistent within the chapter — do not mix straight and curly quotes

**Lists and structure**
- Triadic lists (A, B, C); two-item parallel lists stacked by comma; and…and three-item chains
- Anaphora: three or more consecutive sentences beginning with the same word
- Negative inventory lists (Example: "no voices, no engines, not even a dog") — convey absence through what is present and wrong
- Comma-heavy sentences: more than two commas in a single clause
- In-character enumeration only when explicitly presented as such

**Contrast and negation**
- "Not X, but Y" / "Not A, not B, it's C" — state the thing directly
- "It wasn't X. It was Y." — same elevation move; cut the contrast scaffold
- "More than X. It was Y." — cut the comparison scaffold
- "Not because X, but because Y" — state the reason without presenting the discarded alternative

**Repetition**
- Restating established details; trailing echo sentences (Example: "Better than expected. Much better.")
- Period-comma swap for emphasis (Example: "She was tired. Tired in a way she couldn't name.")
- Echoed final words: ending a paragraph by repeating a word from the previous sentence for resonance
- Refrain repetition across a chapter: same phrase reused as motif unless genuinely load-bearing in plot or theme
- Repetitive mirroring: same idea restated with parallel sentence structure
- Static environmental repetition

**Sentence-level language restrictions**
- Multiple negatives in one sentence: rewrite to state what is true (Example: "He had no food, no shelter, and no idea" becomes "He was hungry, exposed, and lost.")
- Stacked "not" constructions: one negation per sentence; a second requires rewrite
- "Not just" as a qualifier: cut it and state directly
- "No X, no Y, no Z" structures: forbidden; state the reality plainly
- More than one use of "no" or "not" in a sentence: rewrite
- Weasel hedges in narration ("seemed to," "appeared to," "almost," "as if," "as though"): use sparingly; do not stack within a paragraph
- "Began to" / "started to" as filler verbs: use the verb itself
- Adverb stacking: avoid more than one "-ly" adverb in a sentence; prefer a stronger verb

**Rhythm and structure**
- Staccato fragmentation: three or more consecutive short sentences for false punch
- Atmospheric fragments standing alone — attach to a perceiver or source
- Isolated one-liner paragraphs unless they carry a scene shift, revelation, or decision
- Stacked negative space: consecutive one- or two-sentence paragraphs
- Balanced sentence pairs with matched cadence (long-short, paired clauses, mirrored phrasing) — vary one of them
- Rule-of-three rhythmic closers ending paragraphs — cut to two or one

**Action and pacing**
- Compressed action chains (Example: "He rolled, grabbed the spear, came up swinging") — add texture or cut to result
- Withheld subject reveal: reaction before cause across sentences for manufactured tension
- "Then" / "And then" as escalation markers — fold into the sentence
- Adjectival appends for drama (Example: "Green blood spread through the water, bright and strange") — cut or make load-bearing
- Retrospective pivot (Example: "He'd cried about that, once. Not anymore.")
- Biographical shorthand intro
- Sensory cataloguing at scene-open (sound + smell + sight inventoried in one paragraph) — anchor on one specific detail instead

---

## Combat
- One clear action per sentence in fast sequences; no compressed chains
- Sound effects inline — the sound and the action belong in the same sentence, not separate lines
- After a significant hit or shift, one sentence of reaction before the next move
- Thoughts during combat: one line, reflexive — no internal monologue
- Vary sentence length: shorter for fast exchanges, longer when action pauses or something shifts

---

## Dialogue
- Each speaker gets their own paragraph; never run two speakers into the same block
- Dialogue and its action beat belong in the same paragraph unless the beat is long enough to stand alone
- Action beats go mid-dialogue or after speech, never before
- Keep dialogue paragraphs short; a long speech should be broken by a beat or reaction before it continues
- Characters speak plainly; no speeches; no direct emotion explaining; mild humor, deflection, and non-answers are natural
- In fast back-and-forth, short tag-only lines are fine; in slower scenes with subtext, beats should add texture

---

## Thoughts
- Single quotes only: 'Like this.' No italics, no attribution tag.
- Short and reactive — immediate gut response, not internal monologue; one thought per beat, no chaining
- No emotion labeling ('He was scared'); no recapping what the reader already knows
- Fragments are fine: 'Huh.' / 'Not good.'
- **First-person:** use sparingly — only for sharp self-interruptions; the general narrating voice already carries the character's perspective

---

## Webnovel Pacing
- Default paragraph length: 2 to 4 sentences; 5 to 7 is acceptable for action or dense world detail
- A single sentence may stand alone only when it earns the space (scene shift, revelation, decision) — not for staccato effect
- Open chapters mid-action or mid-thought; end on a forward pull, not a settled beat
- Slow down inside high-stakes moments with physical and sensory detail — not by adding more paragraphs
- Move quickly through mundane transitions; fold them into a single sentence or cut entirely
- Split paragraphs at tonal shifts or distinct beats; combine when short consecutive paragraphs cover the same beat in fragments

---

## Scene Rules
Each scene should include a decision, a cost or tradeoff, and something that changes — stakes, knowledge, or power. Dialogue should sound unpolished, include misalignment and deflection, and avoid structured debate or perfect logic.

---

## Country References
Do not use real-world country names in the narrative. Replace with consistent symbolic descriptors (e.g., panda country, sakura country, maple country). Once assigned within a story, use the same descriptor every time.

---

## Formatting
- **System/LitRPG blocks:** enclosed in `---` above and below; no blank line between separator and content; plain text only — no HTML tags or italics inside; system voice is matter-of-fact and non-theatrical
- **Scene/day breaks:** `***`; no other horizontal lines
- **Paragraphs:** single paragraph break only; no blank lines between paragraphs in source or DOCX
- **Thoughts:** single quotes; **sound effects:** inline, capitalized, with `!`
- Export chapter as `.docx`; continuity log as `.json`
- Do not include chapter number or title inside the document; begin directly with story content

---

## Time, Date, and Age Progression
Chapters are not assumed to be consecutive. The gap between chapters can be minutes, days, weeks, months, or years — whatever the story requires. A time skip is a valid narrative tool, not a problem to solve.

**Handling time skips:**
- State the elapsed time naturally at the start of the chapter — in narration or through environmental detail, not as an announcement
- Do not pad the opening with a summary of what happened during the skip; start where the story resumes and let context carry what changed
- Update all time-sensitive tracking in the continuity log: current in-world date or day count, countdowns, resource decay, relationship shifts, anything that moves with time

**Age:**
- Characters do not stay the age they were introduced at
- When enough in-world time passes, ages update — record the updated age in the continuity log
- "Enough time" is context-dependent: a skip of weeks rarely changes how a character is written; a skip of months or years does
- If a character was 16 at the story's start and a year has passed in-world, they are 17 — write them accordingly without announcing it

**In-world date tracking:**
- The continuity log tracks the current in-world date or relative time reference (Day 12, Month 3 of Year X, "three months after the tutorial" — whatever unit the story uses)
- Every chapter update must include the current in-world time and the elapsed time since the last chapter
- If the author does not specify elapsed time, infer from context and state the assumption in the log

---

## Continuity
- Read continuity_log.json before each chapter to confirm chapter number, end state, active continuity, and POV
- If no chapter is provided, check continuity_log.json for last known state and continue from where the story left off, following all rules in this file
- Each chapter pasted is the next in sequence — never a restart; infer chapter number from log if not stated in input
- Do not reintroduce established information unless a character explicitly recalls it with a clear in-story reason
- If a chapter contradicts established continuity, surface the conflict and resolve forward — do not silently pick one version
- Update continuity_log.json after every chapter: character stats, key events, locations, end state, personality markers, POV, and anything new that must be tracked
- Stat blocks must be reproduced exactly as formatted — no paraphrasing or summarizing

---

## Self-Check Before Output
- Word count ≥ 1500; chapter number correct and sequential
- POV consistent with log; no mid-chapter drift unless the draft explicitly shifts
- Voice matches author's register; no literary upgrade; no banned patterns present
- No em dashes, en dashes, or double hyphens anywhere; no parentheticals or ellipses in narration
- No hedge openers, AI flourish phrases, or pseudo-poetic mood lines
- No mirrored-contrast scaffolds ("not X, but Y" / "It wasn't X. It was Y." / "More than X. It was Y.")
- No rule-of-three closers, balanced sentence pairs, or anaphora across consecutive sentences
- Adverb and weasel-hedge counts kept low; no filler "began to" / "started to"
- Character personality markers consistent with log
- Names deliberate and weighted; no generic filler
- Tense appropriate to context; no mixing within a scene
- No real-world country names; no HTML or italics inside system blocks
- Continuity log updated with all required fields

---

## Rule
If the prose feels too literary, too heavy, or too clean — pull it back. The goal is a better version of what they wrote, not a different story.