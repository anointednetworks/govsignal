import { useReveal } from '../hooks/useReveal';

const FEATURES = [
  {
    num: '01',
    title: 'Daily Bid Alerts',
    desc: 'A curated email brief of every new tech bid matching your keywords lands before 6 AM — before your day starts, before your competitors see it.',
    preview: (
      <div style={{ background: 'rgba(14,10,31,.7)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, fontSize: '.75rem' }}>
        <div style={{ color: 'var(--dim)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="live-dot" />
          Your GovSignal Brief · 3 new matches
        </div>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>Enterprise Cloud Migration Services</div>
        <div style={{ color: 'var(--dim)', marginBottom: 10 }}>State of California · Closes Feb 14</div>
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 10 }} />
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>Cybersecurity Assessment & Pen Testing</div>
        <div style={{ color: 'var(--dim)' }}>Federal Agency · Closes Feb 21</div>
      </div>
    ),
  },
  {
    num: '02',
    title: 'AI-Matched For You',
    badge: { label: 'Radar', color: '#fcd34d', bg: 'rgba(245,158,11,.1)', border: 'rgba(245,158,11,.25)' },
    desc: 'We analyze your company profile and rank every active bid 0–100% by fit — with a plain-English reason. Skip the noise, see only what matches your capabilities.',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[['Cyber Warfare Engineering & Security', '100%', true], ['Intrusion Detection System (IDS)', '90%', true], ['Generic Hardware Procurement', '10%', false]].map(([title, pct, good]) => (
          <div key={String(title)} style={{ background: 'rgba(177,59,255,.05)', border: `1px solid ${good ? 'rgba(177,59,255,.14)' : 'rgba(177,59,255,.06)'}`, borderRadius: 10, padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '.8rem', color: good ? 'var(--text)' : 'var(--dim)' }}>{String(title)}</span>
            <span className={good ? 'badge badge-live' : 'badge'} style={good ? {} : { background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171' }}>{String(pct)}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '03',
    title: 'Shared Team Workspace',
    badge: { label: '2 free seats', color: 'var(--green)', bg: 'rgba(0,182,122,.1)', border: 'rgba(0,182,122,.25)' },
    desc: 'Every plan includes 2 free team seats on your company domain. One shared bid pipeline — a bid moved by anyone updates for everyone.',
    preview: (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { label: 'Watching', cards: ['Statewide Network Modernization'] },
          { label: 'Pursuing', cards: ['Cyber Ops Support', 'Cloud Hosting 3yr'] },
          { label: 'Won 🎉', cards: ['Public Safety Records'], win: true },
        ].map(col => (
          <div key={col.label} style={{ background: 'rgba(20,14,44,.7)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, minWidth: 130, flex: 1 }}>
            <div style={{ fontSize: '.6rem', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: col.win ? 'var(--green)' : 'var(--dim)', marginBottom: 8 }}>{col.label}</div>
            {col.cards.map(c => (
              <div key={c} style={{ background: 'rgba(177,59,255,.06)', border: `1px solid ${col.win ? 'rgba(0,182,122,.25)' : 'rgba(177,59,255,.14)'}`, borderRadius: 8, padding: '8px 10px', marginBottom: 6, fontSize: '.73rem', color: 'var(--muted)', lineHeight: 1.3 }}>{c}</div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '04',
    title: 'Smart Search & Filters',
    desc: 'Filter by category, state, contract value, agency type, and closing date. Every bid is classified at ingest — no sifting through irrelevant listings.',
    preview: (
      <div style={{ background: 'rgba(14,10,31,.7)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--dim)', fontSize: '.8rem' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" /><path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          Search technology bids...
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['California ×', 'Software ×', '$50K+ ×', 'Closing soon ×'].map(tag => (
            <span key={tag} style={{ background: 'rgba(177,59,255,.14)', border: '1px solid rgba(177,59,255,.3)', color: 'rgba(177,59,255,.9)', padding: '4px 12px', borderRadius: 100, fontSize: '.72rem', fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: '05',
    title: 'Simple Bid Tracker',
    desc: 'Save bids and move them through your pipeline — Watching, Pursuing, Submitted, Won. No complexity, just clarity on where every opportunity stands.',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { title: 'Cloud Hosting & Managed Services', badge: <span className="badge badge-soon">Pursuing</span> },
          { title: 'ERP System Modernization — DoD', badge: <span className="badge badge-new">Submitted</span> },
          { title: 'Public Safety Records System', badge: <span className="badge badge-live">Won 🎉</span> },
        ].map(row => (
          <div key={row.title} style={{ background: 'rgba(177,59,255,.05)', border: '1px solid rgba(177,59,255,.14)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '.8rem', color: 'var(--text)' }}>{row.title}</span>
            {row.badge}
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '06',
    title: 'Coast-to-Coast Coverage',
    desc: 'We monitor procurement portals across all 50 states and federal agencies. No technology bid slips through — from the smallest county to the DoD.',
    preview: (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['SAM.gov', 'TX SmartBuy', 'Colorado PG', 'NC eVP', 'IL BidBuy', 'LA County', 'NYC eVP', '+100 more'].map(s => (
          <span key={s} className="source-chip">{s}</span>
        ))}
      </div>
    ),
  },
];

export default function Features() {
  const ref = useReveal();

  return (
    <section id="features" style={{ padding: '100px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>

        <div ref={ref} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Features</div>
          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 16 }}>
            Everything your team needs to win.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '.975rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Purpose-built for IT companies pursuing government contracts — from your first bid alert to the win.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <FeatureCard key={f.num} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ num, title, badge, desc, preview }: {
  num: string; title: string; badge?: { label: string; color: string; bg: string; border: string }; desc: string; preview: React.ReactNode;
}) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div className="feature-num" style={{ marginBottom: 0 }}>{num}</div>
        {badge && (
          <span style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color, fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' as const, padding: '2px 8px', borderRadius: 6 }}>{badge.label}</span>
        )}
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '.875rem', lineHeight: 1.65, marginBottom: 20 }}>{desc}</p>
      {preview}
    </div>
  );
}
