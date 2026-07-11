const BIDS = [
  'Pacific Data Recompete · Due Jul 22',
  'UI DMS Modernization Assessment · Due Aug 14',
  'Statewide Video Sharing Solution · Due Jul 20',
  'Aeronautics Program Management System · Due Aug 10',
  'Cybersecurity Tabletop Exercises · Due Jul 30',
  'Enterprise Service Management Licenses · Due Jul 15',
  'HubSpot CRM Implementation · Due Jul 14',
  'Cloud Migration Services Phase 2 · Due Aug 1',
];

export default function Ticker() {
  const items = [...BIDS, ...BIDS]; // duplicate for seamless loop

  return (
    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '14px 0', overflow: 'hidden', background: 'rgba(14,10,31,.5)', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(to right, rgba(14,10,31,.9), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(to left, rgba(14,10,31,.9), transparent)', zIndex: 2, pointerEvents: 'none' }} />

      <div className="marquee-track">
        <TickerLive />
        {items.map((bid, i) => (
          <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 28px', borderRight: '1px solid var(--border)', fontSize: '.78rem', fontWeight: 500, color: 'var(--dim)', whiteSpace: 'nowrap' }}>
            <span className="badge badge-new">New</span>
            {bid}
          </div>
        ))}
      </div>
    </div>
  );
}

function TickerLive() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 28px', borderRight: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
      <span className="live-dot" />
      <span style={{ color: 'var(--green)', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>Live</span>
    </div>
  );
}
