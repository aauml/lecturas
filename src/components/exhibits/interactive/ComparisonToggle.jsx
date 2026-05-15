import { useState } from 'react';

/**
 * ComparisonToggle — switch between two or more readings/framings of the same material.
 *
 * Props:
 *   views: Array<{ label: string, paragraphs: string[] }>
 *   label, title, subtitle, source: standard exhibit metadata
 */
export default function ComparisonToggle({
  label = 'Comparison',
  title,
  subtitle,
  source,
  views = [],
}) {
  const [active, setActive] = useState(0);
  const v = views[active] || { paragraphs: [] };

  return (
    <figure className="exhibit">
      <div className="exhibit-frame">
        <div className="exhibit-label">{label}</div>
        {title && <div className="exhibit-title">{title}</div>}
        {subtitle && <div className="exhibit-subtitle">{subtitle}</div>}
        <div className="toggle-tabs" role="tablist" aria-label={title || label}>
          {views.map((view, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`toggle-tab${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              {view.label}
            </button>
          ))}
        </div>
        <div className="toggle-panel" role="tabpanel">
          {v.paragraphs.map((p, i) => (
            <p key={i} className="toggle-paragraph">{p}</p>
          ))}
        </div>
        {source && <div className="exhibit-source"><strong>Source.</strong> {source}</div>}
      </div>
    </figure>
  );
}
