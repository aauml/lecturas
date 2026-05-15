import { useState } from 'react';

function scoreValue(v) {
  if (v === true || v === '✓') return 2;
  if (v === false || v === '✗') return 0;
  return 1;
}

function renderCell(v) {
  if (v === true || v === '✓') return { mark: '✓', cls: 'scorecard-mark-yes' };
  if (v === false || v === '✗') return { mark: '✗', cls: 'scorecard-mark-no' };
  return { mark: String(v), cls: 'scorecard-text' };
}

export default function InteractiveMatrix({
  label = 'Matrix',
  title,
  subtitle,
  source,
  columns = [],
  rows = [],
}) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('desc');
  const [expanded, setExpanded] = useState(() => new Set());

  const handleSort = (i) => {
    if (sortCol === i) {
      setSortDir(d => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortCol(i);
      setSortDir('desc');
    }
  };

  const toggleExpand = (i) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const rowOrder = sortCol === null
    ? rows.map((_, i) => i)
    : [...rows.map((_, i) => i)].sort((a, b) => {
        const av = scoreValue(rows[a].values[sortCol]);
        const bv = scoreValue(rows[b].values[sortCol]);
        return sortDir === 'desc' ? bv - av : av - bv;
      });

  const hasContext = rows.some(r => r.context);

  return (
    <figure className="exhibit">
      <div className="exhibit-frame">
        <div className="exhibit-label">{label}</div>
        {title && <div className="exhibit-title">{title}</div>}
        {subtitle && <div className="exhibit-subtitle">{subtitle}</div>}
        <div className="interactive-hint">
          {hasContext ? 'Tap a row to expand · tap a column to sort' : 'Tap a column to sort'}
        </div>
        <div className="scorecard scorecard-interactive" style={{ '--col-count': columns.length }}>
          <div className="scorecard-row scorecard-row-header">
            <div className="scorecard-cell scorecard-cell-corner" aria-hidden="true"></div>
            {columns.map((c, ci) => (
              <button
                key={ci}
                type="button"
                className={`scorecard-cell scorecard-cell-header scorecard-cell-sort${sortCol === ci ? ' is-active' : ''}`}
                onClick={() => handleSort(ci)}
                aria-label={`Sort by ${c}`}
              >
                <span>{c}</span>
                <span className="scorecard-sort-arrow">
                  {sortCol === ci ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                </span>
              </button>
            ))}
          </div>
          {rowOrder.map(ri => {
            const r = rows[ri];
            const isOpen = expanded.has(ri);
            const canExpand = !!r.context;
            return (
              <div key={ri} className={`scorecard-row${isOpen ? ' is-expanded' : ''}`}>
                {canExpand ? (
                  <button
                    type="button"
                    className="scorecard-cell scorecard-cell-rowlabel scorecard-cell-expand"
                    onClick={() => toggleExpand(ri)}
                    aria-expanded={isOpen}
                  >
                    <span>{r.label}</span>
                    <span className="scorecard-expand-cue" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                ) : (
                  <div className="scorecard-cell scorecard-cell-rowlabel">{r.label}</div>
                )}
                {r.values.map((v, vi) => {
                  const { mark, cls } = renderCell(v);
                  return (
                    <div key={vi} className={`scorecard-cell scorecard-cell-value scorecard-mark ${cls}`} data-col={columns[vi]}>
                      <span className="scorecard-mobile-col">{columns[vi]}</span>
                      <span className="scorecard-mark-text">{mark}</span>
                    </div>
                  );
                })}
                {isOpen && r.context && (
                  <div className="scorecard-context">{r.context}</div>
                )}
              </div>
            );
          })}
        </div>
        {source && <div className="exhibit-source"><strong>Source.</strong> {source}</div>}
      </div>
    </figure>
  );
}
