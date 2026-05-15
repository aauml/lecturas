import { useState } from 'react';

/**
 * ExplorableTimeline — vertical timeline where each event can be expanded
 * to reveal a context paragraph. Use when events benefit from background
 * the reader can choose to read or skip.
 *
 * Props:
 *   events: Array<{ year: string|number, label: string, context?: string }>
 *   label, title, subtitle, source: standard exhibit metadata
 */
export default function ExplorableTimeline({
  label = 'Timeline',
  title,
  subtitle,
  source,
  events = [],
}) {
  const [open, setOpen] = useState(null);

  return (
    <figure className="exhibit">
      <div className="exhibit-frame">
        <div className="exhibit-label">{label}</div>
        {title && <div className="exhibit-title">{title}</div>}
        {subtitle && <div className="exhibit-subtitle">{subtitle}</div>}
        <ol className="explorable-timeline">
          {events.map((e, i) => {
            const canExpand = !!e.context;
            const isOpen = open === i;
            return (
              <li key={i} className={`explorable-event${isOpen ? ' is-open' : ''}`}>
                <time className="explorable-year">{e.year}</time>
                <div className="explorable-marker" aria-hidden="true"></div>
                <div className="explorable-content">
                  {canExpand ? (
                    <button
                      type="button"
                      className="explorable-label-btn"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span>{e.label}</span>
                      <span className="explorable-cue" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                  ) : (
                    <div className="explorable-label">{e.label}</div>
                  )}
                  {isOpen && canExpand && (
                    <div className="explorable-context">{e.context}</div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        {source && <div className="exhibit-source"><strong>Source.</strong> {source}</div>}
      </div>
    </figure>
  );
}
