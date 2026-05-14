# Editorial conventions

The voice is the thing most likely to drift. Read this every time before writing.

## What Lecturas is not

- Not a transcript. Lecturas pieces are guided readings, not raw conversations. Quotes are cleaned up — "uh," repetitions, false starts, and the host's filler are removed. Meaning is preserved exactly.
- Not a summary. A summary collapses; Lecturas expands. Where the source moves quickly past something a careful reader would want context for, a Lecturas piece slows down and explains.
- Not neutral wire copy. The piece has a point of view about *what's worth attending to* in the source. That's what the section headings, exhibits, and pull-quote select for.
- Not a hot take. Lecturas doesn't argue with the source. It frames it for slow reading.
- Not a textbook. The piece should move, not lecture. If a paragraph feels like it belongs in a syllabus, rewrite it as narrative.

## Tone

The model is a magazine essay — *The New Yorker*, *Harper's*, *Granta*, *El País Semanal*, the long-form *Atlantic* — not a blog post and not an op-ed. Sentences earn their length. Paragraphs build. The voice is calm, knowing, slightly amused where appropriate, never breathless.

**But magazine essays are also stories.** The best long-form reads in the world are propulsive — they give you a reason to keep reading at the end of every section. The worst academic summaries give you no reason to keep reading after the first paragraph. Lecturas should feel closer to the former.

Three principles for fluidity:

1. **Lead with people, not concepts.** "Isabel Castaneda failed Spanish — her native language — because an algorithm said so" is better than "The IBO controversy illustrates the problems of algorithmic decision-making." Start sections with specific situations when the source provides them; reach for abstraction only after the concrete case has landed.

2. **Transitions pull forward, not backward.** Don't end sections by summarizing what was just said. End them by opening a question that the next section will answer, or by landing a beat that makes the reader want to know what happens next. The reader should feel continuity, not chapter breaks.

3. **Shorter paragraphs for dense material.** A paragraph in a geopolitics piece can run six or seven sentences because the material is narrative. A paragraph in an ai-policy or thesis piece should rarely exceed four sentences. Dense content needs white space. Let the reader breathe.

The opening paragraph (`p.lede`) is doing the most work in the piece. It should:
- Drop the reader directly into the substance — no "in this article" framing
- Make a specific, contestable claim (not a vague preview)
- Be concrete enough that a reader who only got that far still learned something
- Run 100-180 words

The drop cap is automatic via CSS. Don't make the lede too short or it looks lonely.

## Headline craft

Every Lecturas headline has exactly one phrase wrapped in `<em>` tags. The italic word should be the one that does the most work — usually a verb, sometimes a noun that names the central object. Examples from existing issues:

- N° 01: "The cycle Ray Dalio says America is *inside*"
- N° 02: "The toll booth, the triangle, and the *summit*"

The italicized phrase is the anchor — the word the headline is really about. Pick it deliberately.

Headlines should be specific to the source. "What X says about Y" is the basic pattern but too generic; lift one concrete thing from the source and lead with it.

## Dek (the italic subhead under the headline)

One sentence. 25-40 words. Sets up what the piece is doing. Italic by CSS, no further markup needed.

Pattern: `[Source/speaker] [verb] [the thing they're claiming or showing]. [Optional second clause that names what the reader will get.]`

Example: "Pepe Escobar, in conversation with Judge Andrew Napolitano, describes a war that ended without ending — and an alignment that has decided who runs the strait of Hormuz now."

## Section structure

**Section count is source-driven.** The default is five, but the range is two to seven. A short article with one argument might need three. A 90-page law review article might need six or seven. A podcast that elaborates a single thread might need two. Don't pad to hit five; don't compress to avoid six.

**Multi-part pieces.** For very long or very dense sources — a book chapter, a 90-page law review article, a three-hour testimony — a single piece may not be enough. In those cases, split into multiple pieces (Part I, Part II), each self-contained, each with its own slug (`topic-part-1`, `topic-part-2`). Each part should work on its own: a reader who only reads Part I should learn something complete. This is a last resort — most sources, even long ones, compress into one piece. Use multi-part only when one piece would exceed ~5,000 words and the compression would sacrifice the things that make it worth reading.

Each section has the same internal anatomy:

```
.section-number            "§ 01 — [name]" — short, oxblood
h2.section-title           Title with one <em> phrase, like the main headline
.section-standfirst        Italic, sets up what the section will do
[body paragraphs, exhibits, qa-blocks, context-boxes as needed]
```

Section titles follow the same one-italic-phrase pattern as the main headline.

The standfirst is essentially the section's own dek — it tells the reader what they're about to get. One sentence usually, two if needed.

## When to use each component

**Use a `context-box`** when a reference in the source assumes background most readers don't have. Examples: explaining what the JCPOA was, who Primakov was, what the Brussels Effect means, what a Suez moment refers to, what DMCA notice-and-takedown is, how Mathews v. Eldridge works. Two paragraphs maximum. The label is "Background — [question]" or "What is X?"

The context-box is doing what scholars call **glossing** — providing a brief explanation of an unfamiliar term, person, or reference that the source assumed the reader would already know. This is one of the most-loved features of Lecturas. Don't be stingy with context-boxes when the source genuinely demands them; a careful reader appreciates being given the background instead of having to look it up. But also don't gloss what doesn't need glossing — if the source explains something itself, don't repeat the explanation in a box.

**Context-box density depends on the source type:**
- **Conversational sources** (podcasts, interviews): 2–4 context boxes. The speaker usually explains their own references; you gloss what they skip.
- **Journalistic sources** (news articles, magazine pieces): 3–5. The journalist explains some things; you fill in what they assumed.
- **Academic/legal sources** (law review articles, policy papers, doctoral work): 5–8. Academic writing assumes a specialist reader. A Lecturas reader is smart but not necessarily a specialist. Gloss every concept the source treats as given that a non-specialist would need to look up. This is where context-boxes earn their keep.

Pattern: ask yourself, "If a smart but non-specialist reader hit this passage cold, what one piece of background would unlock it?" That question is the context-box.

**Use a `qa-block`** when the conversational rhythm itself matters — the back-and-forth, the question that triggered the answer. Don't qa-block everything; the article isn't a transcript. Use it for the moments where the exchange is part of the meaning. Edit ruthlessly for clarity.

**Use an `inline-note`** for tangents that interrupt the main argument briefly — clarifications, technical specs, "the X referenced above is Y" callouts. Sans-serif, smaller, top + bottom rule. One per article maximum, ideally zero.

**Use the `pull-quote`** exactly once per article. It's the line the source itself elevates — usually a direct, vivid statement that lands in three seconds. Don't pull-quote a long passage; if it doesn't fit on three screen lines, it's not a pull-quote, it's a block quote, and Lecturas doesn't use those.

**Use a `callback`** when the new piece picks up themes from an earlier issue. It goes immediately after the lede paragraphs (before the first section divider). Format: `<strong>Continues themes from N° XX</strong> · [one sentence on what's continuing]`.

## Partisan and contested sources

Some sources have a clear ideological frame. Pepe Escobar is openly committed to a multipolar/anti-imperial reading of the world. Other voices may be openly committed to other readings. Lecturas doesn't sanitize these voices — sanitizing them would lose the thing the reader came to read.

The way to handle a partisan source is **not** to launder the voice. It's to introduce the voice up front, in the lede or in an early paragraph, so the reader knows what they're reading. Two patterns work:

1. **Inline characterization** in the lede paragraphs. "Escobar is a particular voice. Brazilian by birth, journalist by trade, longtime correspondent for Asia Times and contributing editor at outlets across what he would call the multipolar world. He has spent the last fifteen years arguing — to use his own phrase — that wealth and power are pivoting east..."
2. **Context box on the speaker** when there's more to say than fits inline.

Once the framing is established, use "Escobar argues" / "in Escobar's view" / "in Escobar's account" throughout the body. Never just state contested claims as fact.

For colorful or aggressive language in the source ("toxic combination of stupidity and nastiness," "stupid Zionists"), preserve it as the speaker's words in qa-blocks or pull-quotes. Don't repeat the framing in your own editorial voice. After such a quote, a single editorial sentence acknowledging the rhetorical register without endorsing it goes a long way: "The line is harsh, and it is X's. It is also the kind of formulation that, on his own terms, only makes sense if you already share his diagnosis."

## Coda

Two or three short paragraphs at the end. No exhibits, no qa-blocks, no context boxes. The pattern that's worked:

1. **What's still uncertain** — the open questions
2. **What is not uncertain** — what the source has clearly established or what's already true
3. **What the reader is left with** — meta-reflection on how to use the piece

The coda is where Lecturas earns its "annotated reading" claim. It explicitly tells the reader what the piece was for.

## Cross-issue continuity

When two pieces touch the same theme, link them. The continuity doesn't have to be heavy — one mention, one callback, one analogy reused across pieces. N° 01 and N° 02 share:
- The strait of Hormuz (mentioned in both, mapped in N° 01, reframed as toll booth in N° 02)
- The Suez 1956 analogy (used by Dalio for British decline, by Escobar for American credibility)

When you spot this kind of resonance, surface it. The reader who has read both pieces should feel rewarded.

## Things to avoid

- **Sycophantic openings.** Never "What an interesting source!" or "This is a fascinating conversation." Just start.
- **Meta-commentary about the response itself.** Don't write "as we'll see in the next section" or "the following exhibit shows."
- **Hedging strings.** Not "perhaps it could be argued that, in some sense..." Make the claim or don't.
- **Em-dash overuse.** One per paragraph maximum is a good rule. They become a tic if let.
- **Bullet points in the body.** The body is prose. Lists belong in exhibits, not in the article.
- **AI-tells.** "It's worth noting," "in essence," "ultimately," "it's important to remember." Cut them.
- **Restated summaries.** Don't end sections by summarizing what you just said. End them by setting up what's next, or by letting the last paragraph land.
- **Scaffolding prose.** "The first reason is... The second reason is... The third reason is..." reads like a lecture outline. Weave arguments together. Use the source's own structure only if the source's structure is itself interesting.
- **Bureaucratic calques.** "Decisores" when "quienes deciden" works. "Progenitores" when "padres" is what you mean. "Implementar" when "aplicar" or "poner en marcha" say it better. This applies to both languages but especially to Spanish.

## Length targets

- Total article: 2,500-5,000 words (source-driven, not formula-driven)
- Lede: 100-180 words
- Section standfirst: 25-50 words  
- Section body (excluding exhibits): 200-600 words (shorter for dense material, longer for narrative)
- Coda: 150-300 words total

These are guides, not rules. Don't pad to hit the target; don't truncate beats that need their space. A short piece that's alive is better than a long piece that's thorough but dead.
