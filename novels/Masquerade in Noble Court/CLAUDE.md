# CLAUDE.md — Masquerade in Noble Court

## Synopsis
First-person narrative | Transmigration · Strategy · Political

"I know this story," I told the ceiling. "Mostly."

I woke up as Elena, a count's daughter the novel had already decided to discard. No magic, no position worth remembering, and five months before the family title expired and the story stopped needing her entirely.

The survival plan was simple: ignore the Crown Prince, ignore the heroine, don't die.

So I went to the imperial temple for a mana retest. It should have been a formality.

【Water Affinity Confirmed.】

The priest stopped mid-sentence.

I looked at the crystal again. It still said the same thing.

This wasn't in the book.

"Well. That's inconvenient."

---

## Purpose
Improve the author's draft while preserving their voice. Prioritize specificity, tension, and consistency. Do not summarize or replace the author's voice with a literary one.

**Minimum:** 1500 words per chapter. If the source exceeds 1500 words, match or exceed it. Reach the minimum by deepening texture and physical detail within existing beats — not by padding or inventing new scenes.

---

## Genre and Tone
Transmigration / Strategy / Political / LitRPG. 

Elena knows the story she landed in and intends to survive it by ignoring the plot. The tone is dry, self-aware, and functionally irritated — she is too busy solving real problems (magic testing, title expiration, corset infrastructure) to perform the emotional arc the narrative expects of her. Humor comes from the collision between Elena's modern pragmatism and the feudal world's assumptions. It is never broad or slapstick; it lives in understatement and deflection.

Political content exists in the court structure and the original story's plot — Elena is navigating around it, not through it. The Crown Prince, the Heroine, and the noble politics are hazards to be avoided or managed, not dramatic material to be explored for their own sake. Priority is Elena's practical maneuvering, survival countdown, and the gap between what the world expects and what she actually does.

Elena's approach is calculated and self-aware at all times. The narrative focus stays on political maneuvering, social pressure, and her deliberate rejection of the original storyline. Her actions should feel controlled and strategic — tension comes from how she navigates rigid power structures, social expectations, and time constraints. Any progression or advantage she gains must feel earned through observation and decision-making. Coincidence is not a valid delivery mechanism for her advancement. If something goes in her favor, the groundwork must be visible in prior scenes.

---

## Point of View
Primary: **first-person.** "I" narrates. Elena's modern-sensibility voice governs what gets noticed. She is aware she is inside a story and occasionally addresses that awareness flatly, without breaking the fourth wall into comedy.

POV shifts to other characters are permitted when they serve the scene — mark clearly and return to Elena's first-person promptly.

---

## Protagonist — Elena
Record in continuity_log.json on first appearance and preserve every chapter.

**Behavioral markers:**
- She approaches problems as systems: here is the variable, here is what moves it, here is the outcome I want. She makes checklists.
- She is not cold — she simply has a hierarchy. Survival first, comfort second, everything the original story wanted from her nowhere on the list.
- Modern inconveniences (corsets, no plumbing, no effective medicine) get genuine and specific irritation, not comedic winking at the audience.
- She does not fall for the Crown Prince. She does not find the Heroine interesting. She is not suppressing these reactions — she genuinely does not care.
- When she is composed in a room where others are shocked, it is not because she is performing composure. She has already moved on to the next calculation.
- She is allowed to be wrong. Her "I know this story" assumption has gaps and she knows it. She treats her story knowledge as a working hypothesis, not a fact — she acts on it until evidence contradicts it, then updates.
- Her humor is dry and delivered to herself: "The script says I'm forgettable. I've decided to ignore the script."

Do not let Elena become emotionally invested in court politics. Do not let her become warm or reflective without a specific earned reason.
If a chapter contradicts Elena's established personality, surface the conflict and resolve toward the established version unless the story provides an explicit reason for the shift.

---

## Elena's Plot Knowledge — Structural Rule
Elena's knowledge of the original story is her primary strategic advantage, but it is incomplete, possibly corrupted by the transmigration, and becoming less reliable as her actions diverge from the original plot. Treat her plot knowledge as a three-state system:

- **Confirmed:** she acted on the assumption, it played out as expected, record it as confirmed in continuity_log.json
- **Unverified:** she believes it from reading the original story but hasn't tested it yet — she acts on it but stays alert for disconfirmation
- **Contradicted:** something happened that the original plot says shouldn't, or didn't happen when it should — this must be surfaced in Elena's internal calculation and flagged in the log

When Elena's plot knowledge is wrong, the error should not be played for comedy or revelation. It should be treated as a logistical problem she now has to solve with one fewer piece of information than she thought she had. Her response is recalculation, not panic or epiphany.

---

## Magic System and LitRPG
- System responses appear in 【】 brackets, plain text inside, matter-of-fact tone.
- System enclosed in `---` separators; no blank line between separator and content; no HTML or italics inside.
- System wording, phrasing style, and register must remain consistent throughout the chapter — do not let the system's tone shift between scenes.
- Magic mechanics are presented practically — what can this do, what does it cost, how does Elena use it to solve the 5-month problem.
- Do not dramatize affinity reveals or level-ups beyond the immediate tactical implication. Elena's reaction is always: how does this help.
- The countdown (5 months to title expiration) is a recurring pressure in Elena's calculations. It does not need to be stated every chapter, but it should be felt.

---

## Voice Defaults
These are defaults — choose what fits the context.

- Close, readable narration; not literary or elevated
- Avoid LLM-sounding prose: neat cause-effect chains, tidy balanced rhythm — rewrite anything that reads like a published literary novel
- Elena's narration is drily functional; she notices things that matter to survival and the things that annoy her, in roughly equal measure
- Contractions and casual grammar are correct for her inner voice; her spoken dialogue adjusts to the social register of whoever she is talking to
- Vary dialogue tags naturally; beats can replace tags; do not default to "said" every line, but do not strain for exotic tags either
- Action beats go mid-dialogue or after speech, never before
- Action beats are concrete physical detail, not emotional summary: not "she looked composed" but "she straightened her cuffs and waited"
- Do not announce cause and effect: not "Because the corset was too tight, she couldn't breathe" but "The corset was too tight and she got two sentences into her thought before losing it"
- Include minor human detail to ground scenes; do not stack it
- Tense: use what fits the context; do not mix within a scene
- Sound effects inline, capitalized, with `!`: part of the sentence, never standalone; do not over-use — reserve for impacts, sudden noises, fast action; multiple simultaneous sounds stay in sequence within the same sentence ("Crack! Snap!"); never follow a sound effect with a sentence explaining it
- Avoid hedge openers and AI pivot transitions — start the sentence with the substance, not the bridge ("Still," "And yet," "In that moment")
- Avoid AI flourish phrases ("a testament to," "the weight of," "hung in the air") and pseudo-poetic mood lines that add no new information
- Prefer one strong verb to verb-plus-adverb constructions; cut filler verbs ("began to," "started to") and stacked "-ly" adverbs

---

## Numerals
Use numerals for measurements, ages, stats, distances, quantities, percentages, weights, dates, and times. Spell out only when a number opens a sentence.

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

## Dialogue
- Each speaker gets their own paragraph
- Dialogue and its action beat belong in the same paragraph
- Action beats go mid-dialogue or after speech, never before
- Keep dialogue paragraphs short; a long speech should be broken by a beat or reaction before it continues
- Elena's spoken register adjusts to the room — more formal in court, less so in private
- She deflects romantic or political pressure with politeness and subject changes, not confrontation
- Other characters may misread her composure as arrogance, warmth, or cunning depending on what they expect — Elena does not correct them

---

## Thoughts
- Single quotes only: 'Like this.' No italics, no attribution tag
- Short and reactive; one thought per beat; no chaining
- No emotion labeling; no recapping known info; fragments are fine: 'Five months.'
- First-person: use sparingly — the narrating voice already carries Elena's perspective

---

## Webnovel Pacing
- Default paragraph length: 2 to 4 sentences; 5 to 7 acceptable for court scenes or magic mechanics
- A single sentence may stand alone only when it earns the space
- Open chapters mid-thought or mid-situation; end on a forward pull or an unresolved calculation
- Move quickly through court pleasantries Elena finds tedious; slow down when something actually changes the plan

---

## Scene Rules
Each scene should include a decision, a cost or tradeoff, and something that changes — stakes, knowledge, or resources. Scenes involving the Crown Prince or Heroine are obstacles or inconveniences, not emotional centers. Elena's primary relationship is with her own survival plan.

---

## Cultural Realism
The noble court has its own internal culture — class hierarchy, gender expectations, magic prestige — and Elena navigates it as a foreign system she understands theoretically but experiences with friction. Characters within the world vary widely in personality; not every noble is scheming, not every servant is loyal. Do not flatten secondary characters into types.

---


## Time, Date, and Age Progression
Chapters are not assumed to be consecutive. The gap between chapters can be days, weeks, or months — whatever the story requires. A time skip is a valid narrative tool, not a problem to solve.

**Handling time skips:**
- State the elapsed time naturally at the start of the chapter — in narration or through environmental detail, not as an announcement
- Do not pad the opening with a summary of what happened during the skip; start where the story resumes and let context carry what changed
- Update all time-sensitive tracking in the continuity log: current in-world date, title countdown, any social standing or plot-knowledge shifts that occurred during the skip

**Title countdown:** The 5-month countdown to title expiration is the story's primary structural pressure. It must advance with elapsed time every chapter. Elena does not need to state it aloud, but it should be felt. The continuity log must always show the updated time remaining.

**Age:** Characters do not stay the age they were introduced at. If enough in-world time passes, update ages in the continuity log.

**In-world date tracking:** The continuity log tracks the current in-world date and title countdown in parallel. Every chapter update must include both. If the author does not specify elapsed time, infer from context and state the assumption in the log.

## Country References
No real-world country names in the narrative. Use consistent symbolic descriptors. Once assigned, use the same descriptor every time.

---

## Naming
Names should be deliberate and carry weight. If the author provides a name, use it. Noble titles, locations, and factions get consistent compound names; once assigned in continuity_log.json, they do not change.
---

## Chapter File Naming
Every chapter is saved as a `.docx` file. The filename format is:

```
Chapter_N_Chapter_Title.docx
```

Rules:
- `N` is the chapter number with no leading zeros: `Chapter_1`, `Chapter_14`.
- The title uses title case with underscores between words.
- Titles are two to three words. One word is rare and only used when nothing else fits. Four or more words are forbidden.
- The title describes the chapter content plainly. It does not editorialize.
- The word "Revised" and any variant of it (Revised, Rewrite, Edit, Updated, Final, V2) are forbidden in the filename.
- Colons are forbidden in filenames.
- Em dashes are forbidden in filenames.
- The filename contains only the chapter number and title. Nothing else is appended.

Correct examples: `Chapter_1_New_Life.docx`, `Chapter_3_Market_Fight.docx`, `Chapter_12_Veilstone.docx`
Wrong examples: `Chapter_1_New_Life_Revised.docx`, `Chapter_3_The_Long_Market_Fight.docx`, `Chapter_12_Veilstone:_The_Ruin.docx`

---

## Formatting
- System blocks: `---` above and below; no blank line between separator and content; plain text only
- Scene/day breaks: `***`; no other horizontal lines
- Paragraphs: single paragraph break only; no blank lines in source or DOCX
- Thoughts: single quotes; sound effects: inline, capitalized, with `!`
- Export chapter as `.docx`; continuity log as `.json`
- Do not include chapter number or title inside the document

---

## Continuity
- Read continuity_log.json before each chapter: chapter number, end state, active continuity, POV, countdown status
- If no chapter is provided, check continuity_log.json for last known state and continue from where the chapter left off, following all rules in this file
- Each chapter is the next in sequence — never a restart; infer number from log if not stated
- Do not reintroduce established information without a clear in-story reason
- Surface continuity conflicts; do not silently resolve them
- Update log after every chapter: magic stats, title countdown, key events, social standing shifts (track who now knows about Water Affinity and how they are responding — the offended priest, the shocked parents, and any ripple effects in court perception), personality markers, active plot threads, Elena's plot knowledge ledger (list confirmed assumptions, unverified assumptions, and any contradicted assumptions — note what the contradiction was and what Elena's updated working hypothesis is)
- Stat blocks reproduced exactly — no paraphrasing
- In-world time updated in log: current date, title countdown updated, elapsed time since last chapter stated explicitly

---

## Self-Check Before Output
- Word count ≥ 1500; chapter number correct and sequential
- POV consistent with log; shifts marked and returned from promptly
- Voice matches Elena's register: dry, functional, mildly irritated — no romantic pull, no literary upgrade
- Banned patterns absent
- No em dashes, en dashes, or double hyphens anywhere; no parentheticals or ellipses in narration
- No hedge openers, AI flourish phrases, or pseudo-poetic mood lines
- No mirrored-contrast scaffolds ("not X, but Y" / "It wasn't X. It was Y." / "More than X. It was Y.")
- No rule-of-three closers, balanced sentence pairs, or anaphora across consecutive sentences
- Adverb and weasel-hedge counts kept low; no filler "began to" / "started to"
- Character markers consistent with log
- System notifications matter-of-fact, non-theatrical
- Title countdown tracked in log
- In-world time and title countdown updated in continuity log; elapsed time since last chapter stated
- Elena's plot knowledge ledger updated: any confirmed, newly contradicted, or newly unverified assumptions recorded; contradictions trigger recalculation, not surprise or comedy
- Tense consistent within each scene
- No real-world country names; no HTML or italics in system blocks
- Continuity log updated

---

## Rule
If the prose feels too literary, too heavy, or too clean — pull it back. The goal is a better version of what they wrote, not a different story.