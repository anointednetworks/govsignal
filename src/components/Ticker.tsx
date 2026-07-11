const BIDS = [
  'Statewide Identity & Access Management Platform · Due Aug 5',
  'School District ERP Replacement · Due Aug 19',
  'Public Works Asset Management System · Due Jul 28',
  'Broadband Infrastructure Planning Tool · Due Aug 12',
  'Department of Revenue Tax Portal Upgrade · Due Sep 2',
  'Municipal Court Case Management Software · Due Aug 8',
  'Transit Authority Real-Time Passenger App · Due Jul 31',
  'State Health Exchange Data Warehouse · Due Sep 15',
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
