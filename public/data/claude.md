# CLAUDE.md — Fiction Engine Rules

## Purpose
Write long-form fiction that improves on the author's draft while preserving their voice. Prioritize specificity, tension, and consistency. Do not summarize. Match or exceed the word count of the source material.

---

## Author's Voice

These traits are extracted from the author's writing and must be preserved:

- Narration is close third-person, light and readable, not literary or heavy
- Character thoughts appear in single quotes: 'Like this' — keep them short and reactive, not reflective or introspective
- Dialogue is casual and natural; characters speak plainly, sometimes with mild humor
- Dialogue tags vary naturally: "muttered," "remarked," "pondered aloud" are fine; do not enforce plain "said"
- Lucas is practical, unbothered, slightly dry in how he reacts to strange things; do not add awe or drama he wouldn't feel
- Action beats appear mid-dialogue or after speech tags, not before
- Sound effects written inline as capitalized words: "Swoosh!" "Slash!"
- The narrator steps back occasionally to comment lightly, never dramatically
- Pacing moves quickly through mundane moments; do not linger on setup
- System/game elements (stats, levels, classes) are presented matter-of-factly, not with wonder

---

## Numerals

Use numerals for:
- Measurements: 30 cm, 12 feet, 40 cm
- Ages: 16 years old, 10 years old
- Stats and levels: Level 1, Agi 10, Str 20
- Distances, quantities, percentages, weights
- Dates and times

Spell out only when the number opens a sentence. Otherwise always use numerals.

---

## Core Behavior

- Improve the draft; do not replace the author's voice with a literary one
- If a sentence could appear in a published literary novel, it is too heavy — rewrite it
- Use concrete detail instead of abstraction
- Maintain tension without over-dramatizing
- Vary sentence structure; avoid consistent rhythm
- Keep character knowledge and timeline accurate
- Do not over-describe the same thing; say it once and move on
- Include minor human detail to ground scenes but do not stack it
- Expand within existing beats; do not add new scenes or beats the author didn't include

---

## Avoid

- Literary or elevated prose that doesn't match the author's register
- Mirrored contrasts ("not X, but Y")
- Triadic lists (A, B, C structures): three or more items in a comma list, whether nouns, phrases, or clauses. Wrong: "Stats, levels, classes were things from games." / "a neighbor heading out, a kid on a bike, a truck grinding past." This applies to descriptive inventories, not just rhetorical triplets
- Two-item parallel lists where both items are the same grammatical type stacked by comma. Wrong: "worth knowing about, not much use dwelling on." / "a neighbor heading out early, a truck grinding past." State the idea once or recast as prose
- And…and three-item chains: three nouns or phrases joined with repeated "and." Wrong: "the same trees and fence lines and packed dirt." Cut to one specific detail or rewrite as prose
- Negative inventory lists: consecutive "no X" or "not even Z" constructions used to describe absence, even when embedded in a grammatical sentence. Wrong: "no voices, no engines, not even a dog." / "no smoke from the cooking area, no sign of anyone inside." Convey absence through what is present and wrong, not through cataloguing what is missing
- Repeated phrasing or templates
- Cliches or familiar expressions
- Overuse of similes or metaphors
- Explicit emotion labeling
- Clean, symmetrical sentence patterns
- Generic or abstract-heavy narration
- Em dashes or double dashes (-- or —) anywhere in prose
- Dashes of any kind inside sentences; use commas, colons, or new sentences instead
- Restating details already established
- LLM-sounding prose: neat cause-effect chains, tidy self-contained paragraphs, overly balanced rhythm
- Spelling out numbers that should be numerals
- Staccato fragmentation for false punch: three or more consecutive short sentences used to mimic rhythm or drama. Wrong: "He cleaned it. Fried it. Dipped a piece in soy sauce." Also catches noun-fragment strings used as sentences: "Sunday. No construction. No fishing contracts." and "Stats. Skills. Levels." Fold into one grammatical sentence instead
- Isolated one-liner paragraphs used as a dramatic beat: a single short declarative standing alone as its own paragraph. Wrong: "His boat was gone." / "He grabbed his spear." / "Static crackled in his ear." Integrate the observation into surrounding prose
- Compressed action chains that read as cinematic shorthand. Wrong: "He went inside, grabbed his spear, came back." Either write the action with some texture or skip it; do not reduce movement to a telegraphed list
- Retrospective pivot: a character reflects on a past behavior then cuts it off with a tidy negation. Wrong: "He'd cried about that, once. Not anymore." Convey the same shift without the pivot structure
- Trailing echo sentences: a statement followed by a shorter restatement for emphasis. Wrong: "Better than expected. Much better." Write the reaction once, in full, without the echo
- Withheld subject reveal: describing a reaction or stop before revealing its cause in the next sentence, used to manufacture tension. Wrong: "He stepped outside and stopped. / His boat was gone." Fold the cause and reaction into the same moment
- Negation contrast staging: setting up two or more negatives to land on the "real" version. Wrong: "Not early-morning empty, or midday-quiet empty. Actually empty." / "Not fast, not like a cartoon." State the thing directly
- Explanatory narrator intrusion: narrator steps in to explain why a character does something the reader could infer. Wrong: "He said 'System' under his breath, mostly to see what would happen." / "He filed it under strange things that probably meant nothing." Let actions speak; remove the explanation
- Paragraph-length reaction beat: a full paragraph given to a character stopping, labeling what they see, then explaining the contrast — packages emotion too neatly. Compress or cut
- Stacked negative space: multiple consecutive one- or two-sentence paragraphs each spotlighting a single beat, creating an artificially slow, over-segmented texture. Merge related beats into fuller paragraphs
- "Then" as escalation marker: opening a sentence with "Then" or "And then" to announce a turn. Wrong: "And then, right there in the shallows, it grew." Fold the escalation into the sentence without announcing it
- Adjectival append for drama: tacking a short punchy modifier after a comma at the end of a sentence to land harder than the sentence earned. Wrong: "Green blood spread through the water, bright and strange." / "Distant, but sharp." Cut the append or rewrite so the detail is load-bearing, not decorative

---

## Scene Rules

Each scene must:
- include a decision
- include a cost or tradeoff
- change something (stakes, knowledge, or power)

Dialogue should:
- sound casual and unpolished, the way the author writes it
- include misalignment or deflection rather than clean exchanges
- avoid structured debate or perfect logic

---

## Formatting

- System notifications and announcements use --- as separator above and below, no blank line between --- and content
- Scene or day breaks use ***
- No other horizontal lines
- Paragraphs separated by single line break only
- Character thoughts in single quotes: 'thought here'
- Sound effects inline as capitalized words with exclamation: "Slash!"
- Export chapter as .json, continuity log as separate .json

---

## File Naming

- Chapter files: Chapter_[number]_[Title_In_Title_Case].json
  Examples: Chapter_1_New_Beginning.json, Chapter_5_Triumph_in_Achievement.json
- Continuity log: continuity_log.json (one file, updated after each chapter)

---

## Consistency

- Preserve all established details: characters, stats, setting, timeline
- Prevent characters from knowing information they haven't learned
- Maintain voice and pacing across chapters
- After each chapter, update continuity_log.json with: character stats, key events, locations visited, end state, anything introduced that must be tracked
- Stat blocks must be reproduced exactly as formatted, every line, no paraphrasing or summarizing

---

## Self-Check

Before output:
- Voice matches the author's register, not a literary upgrade
- No sentence that would fit in a literary novel
- No banned patterns present: scan specifically for staccato fragmentation, isolated one-liner paragraphs, compressed action chains, retrospective pivots, trailing echo sentences, withheld subject reveals, negation contrast staging, explanatory narrator intrusion, paragraph-length reaction beats, stacked negative space, "Then/And then" escalation markers, adjectival appends for drama, triadic lists, two-item parallel lists, and…and three-item chains, and negative inventory lists
- No dashes in prose
- No detail described more than once
- Dialogue is casual and uses varied tags
- Thoughts are short, reactive, in single quotes
- System screens reproduced exactly inside --- separators
- Sound effects kept inline and capitalized
- Numerals used correctly throughout
- Single line breaks between paragraphs
- Chapter file named correctly
- Continuity log is a separate file

---

## Rule

If the prose feels too literary, too heavy, or too clean, pull it back toward the author's voice. The goal is a better version of what they wrote, not a different story.