# Interactive exhibits

React components rendered as Astro islands. Use `client:visible` so they only
hydrate when scrolled into view — no JS cost for pieces that don't reach them.

```mdx
import InteractiveMatrix from '../../../../components/exhibits/interactive/InteractiveMatrix.jsx';
import AnnotatedChart from '../../../../components/exhibits/interactive/AnnotatedChart.jsx';
import ComparisonToggle from '../../../../components/exhibits/interactive/ComparisonToggle.jsx';
import ExplorableTimeline from '../../../../components/exhibits/interactive/ExplorableTimeline.jsx';

<InteractiveMatrix client:visible columns={[...]} rows={[...]} />
```

## When to reach for interactive over static

The default is still static. Reach for interactive only when the interaction
adds genuine understanding, not when it adds motion. Test: would removing the
interaction make the piece worse, or just less shiny? If the latter, use the
static version.

- **InteractiveMatrix** — when the matrix has 6+ rows and the reader benefits
  from sorting by one dimension. Cells can carry a `context` field that opens
  a per-row paragraph on click. Use for thesis correspondence tables (e.g.
  EU AI Act ↔ NIST RMF) where each correspondence has nuance.
- **AnnotatedChart** — when a time-series or comparison chart has 3+ inflection
  points that need explanation. Static Bars is enough for simple comparisons.
- **ComparisonToggle** — when two readings of the same material are part of
  the editorial argument (Lectura A vs Lectura B, plain vs technical, etc.).
  Not for trivia like "metric vs imperial."
- **ExplorableTimeline** — when events benefit from optional context the reader
  can choose to read or skip. Static Timeline is enough if the labels carry
  the full weight.

## Props reference

### InteractiveMatrix

```jsx
<InteractiveMatrix
  client:visible
  label="Correspondence"
  title="EU AI Act ↔ NIST AI RMF"
  subtitle="High-risk system requirements"
  columns={['EU AI Act', 'NIST RMF', 'Substantial overlap']}
  rows={[
    {
      label: 'Risk management system',
      values: [true, true, true],
      context: 'Art. 9 of the AI Act and NIST RMF Map function both require a documented, lifecycle-spanning process. The mapping is direct.',
    },
    {
      label: 'Human oversight',
      values: [true, '≈', false],
      context: 'EU Art. 14 mandates specific human-in-the-loop arrangements; NIST RMF treats oversight as a Govern function objective. Different specificity.',
    },
  ]}
  source="Author's analysis"
/>
```

### AnnotatedChart

```jsx
<AnnotatedChart
  client:visible
  label="Debt cycle"
  title="U.S. federal debt as % of GDP"
  data={[
    { year: 1945, value: 119 },
    { year: 1980, value: 33 },
    { year: 2024, value: 124 },
  ]}
  xKey="year"
  yKey="value"
  yLabel="% of GDP"
  type="area"
  annotations={[
    { x: 1945, y: 119, label: 'WWII peak', description: 'Wartime spending pushed debt to record levels.' },
    { x: 2024, y: 124, label: 'Surpassed', description: 'First peacetime breach of the WWII high.' },
  ]}
  source="CBO historical tables"
/>
```

### ComparisonToggle

```jsx
<ComparisonToggle
  client:visible
  label="Two readings"
  title="What 'publicly available information' means"
  views={[
    {
      label: 'Lectura A — methodological',
      paragraphs: [
        'On this reading, the phrase narrows what counts as evidence in the analysis.',
        'It is a research-design constraint, not a substantive feature of the legal problem.',
      ],
    },
    {
      label: 'Lectura B — substantive',
      paragraphs: [
        'On this reading, public availability is itself part of the interoperability problem.',
        'A framework that depends on non-public artifacts cannot demonstrate compliance to an outside observer.',
      ],
    },
  ]}
/>
```

### ExplorableTimeline

```jsx
<ExplorableTimeline
  client:visible
  label="Legislative track"
  title="EU AI Act, key dates"
  events={[
    { year: 'Apr 2021', label: 'Commission proposal', context: 'First draft published with risk-tiered approach.' },
    { year: 'Dec 2023', label: 'Political agreement', context: 'Trilogue concluded after extended negotiations on foundation models.' },
    { year: 'Aug 2024', label: 'Entry into force', context: 'OJ publication starts the staged compliance calendar.' },
  ]}
  source="Official Journal of the EU"
/>
```

## Building new interactive components

If none of the four fits, the pattern for a new one:

1. Create a `.jsx` file in this directory. Default-export a function component.
2. Wrap the output in `<figure className="exhibit"><div className="exhibit-frame">...` so it inherits the Lecturas frame.
3. Use the exhibit-label / exhibit-title / exhibit-subtitle / exhibit-source classes for metadata.
4. Use CSS variables from `global.css` for colors (`var(--accent)`, `var(--ink)`, etc.).
5. Add new component-specific styles to `src/styles/global.css` under the `/* Interactive exhibits */` section so the styling stays centralized.
6. Test at 360px viewport width before shipping.

Avoid drawing maps, portraits, or scenes. The data-only constraint that
governs static exhibits applies to interactive ones too — the interaction
is for navigating data, not for representational illustration.
