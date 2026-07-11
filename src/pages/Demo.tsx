import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Sample bid data ─────────────────────────────────────── */
const BIDS = [
  { id: 1,  state: 'TX', agency: 'Office of the CIO',              title: 'Enterprise Cloud Migration Services',               cat: 'Cloud',    due: 'Aug 28', daysLeft: 47, value: '$5.2M' },
  { id: 2,  state: 'GA', agency: 'Dept. of Education',             title: 'Statewide Digital Learning Infrastructure',         cat: 'EdTech',   due: 'Aug 15', daysLeft: 34, value: '$2.4M' },
  { id: 3,  state: 'WA', agency: 'Office of Cybersecurity',        title: 'Statewide Endpoint Detection & Response',           cat: 'CyberSec', due: 'Sep 5',  daysLeft: 55, value: '$3.8M' },
  { id: 4,  state: 'IL', agency: 'Health & Human Services',        title: 'Healthcare Information Exchange Platform',          cat: 'HealthIT', due: 'Aug 22', daysLeft: 41, value: '$1.8M' },
  { id: 5,  state: 'CO', agency: 'Dept. of Labor',                 title: 'Unemployment Insurance System Modernization',      cat: 'ERP',      due: 'Oct 1',  daysLeft: 81, value: '$6.4M' },
  { id: 6,  state: 'VA', agency: 'Dept. of Veteran Services',      title: 'Benefits Case Management Platform',                cat: 'Software', due: 'Aug 19', daysLeft: 38, value: '$1.2M' },
  { id: 7,  state: 'FL', agency: 'Division of Emergency Mgmt.',    title: 'Emergency Communications System Upgrade',          cat: 'Telecom',  due: 'Sep 3',  daysLeft: 53, value: '$890K' },
  { id: 8,  state: 'NY', agency: 'Metropolitan Transit Authority', title: 'Real-Time Passenger Information System',           cat: 'Software', due: 'Sep 18', daysLeft: 68, value: '$2.7M' },
  { id: 9,  state: 'OH', agency: 'Dept. of Revenue',               title: 'Core Tax System Modernization',                   cat: 'Software', due: 'Aug 30', daysLeft: 49, value: '$3.1M' },
  { id: 10, state: 'AZ', agency: 'Dept. of Transportation',        title: 'Vehicle Fleet Telematics & GPS Platform',         cat: 'IoT',      due: 'Sep 10', daysLeft: 60, value: '$450K' },
  { id: 11, state: 'MN', agency: 'Office of MN.IT Services',       title: 'Identity & Access Management Modernization',      cat: 'CyberSec', due: 'Sep 22', daysLeft: 72, value: '$2.0M' },
  { id: 12, state: 'NC', agency: 'Dept. of Commerce',              title: 'Economic Development Data Analytics Platform',    cat: 'Software', due: 'Oct 8',  daysLeft: 88, value: '$780K' },
];

const CAT_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Cloud:    { bg: 'rgba(99,102,241,.1)',  color: '#a5b4fc', border: 'rgba(99,102,241,.25)' },
  EdTech:   { bg: 'rgba(16,185,129,.1)', color: '#6ee7b7', border: 'rgba(16,185,129,.25)' },
  CyberSec: { bg: 'rgba(239,68,68,.1)',  color: '#fca5a5', border: 'rgba(239,68,68,.25)'  },
  HealthIT: { bg: 'rgba(59,130,246,.1)', color: '#93c5fd', border: 'rgba(59,130,246,.25)' },
  ERP:      { bg: 'rgba(245,158,11,.1)', color: '#fcd34d', border: 'rgba(245,158,11,.25)' },
  Software: { bg: 'rgba(177,59,255,.1)', color: '#d8b4fe', border: 'rgba(177,59,255,.25)' },
  Telecom:  { bg: 'rgba(20,184,166,.1)', color: '#5eead4', border: 'rgba(20,184,166,.25)' },
  IoT:      { bg: 'rgba(249,115,22,.1)', color: '#fdba74', border: 'rgba(249,115,22,.25)' },
};

const RADAR_BIDS = [
  { title: 'Enterprise Cloud Migration Services',         score: 97 },
  { title: 'Statewide Endpoint Detection & Response',     score: 91 },
  { title: 'Identity & Access Management Modernization',  score: 86 },
  { title: 'Healthcare Information Exchange Platform',    score: 74 },
  { title: 'Benefits Case Management Platform',          score: 63 },
];

/* ── Component ───────────────────────────────────────────── */
export default function Demo() {
  const [tab, setTab] = useState<'all' | 'foryou'>('all');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top Nav ─────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,6,23,.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', height: 56,
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 'auto' }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: 'linear-gradient(135deg, var(--purple), var(--pink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.7rem', fontWeight: 800, color: '#fff',
          }}>GS</div>
          <span style={{ fontWeight: 700, fontSize: '.95rem', color: 'var(--text)' }}>GovSignal</span>
          <span style={{
            marginLeft: 4, fontSize: '.6rem', fontWeight: 700, letterSpacing: '.12em',
            textTransform: 'uppercase', color: 'var(--purple)',
            background: 'rgba(177,59,255,.1)', border: '1px solid rgba(177,59,255,.25)',
            padding: '2px 7px', borderRadius: 6,
          }}>Preview</span>
        </Link>
        <Link to="/" style={{ color: 'var(--dim)', fontSize: '.82rem', textDecoration: 'none' }}>← Back to site</Link>
        <a href="/signup" className="btn-accent" style={{ fontSize: '.82rem', padding: '7px 16px' }}>
          Start Free — No CC Required
        </a>
      </nav>

      {/* ── Preview banner ──────────────────────────────── */}
      <div style={{
        marginTop: 56, background: 'linear-gradient(135deg, rgba(177,59,255,.12), rgba(255,45,146,.08))',
        borderBottom: '1px solid rgba(177,59,255,.2)', padding: '10px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.82rem', color: 'var(--muted)' }}>
          <LockIcon size={13} />
          <strong style={{ color: 'var(--text)' }}>Preview Mode</strong> — Agency names, contract values, and bid details are locked.
        </span>
        <a href="/signup" style={{
          fontSize: '.78rem', fontWeight: 600, color: 'var(--purple)',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
        }}>
          Sign up free to unlock all {BIDS.length * 200}+ bids →
        </a>
      </div>

      {/* ── Stats strip ─────────────────────────────────── */}
      <div style={{
        background: 'rgba(14,10,31,.6)', borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        display: 'flex', justifyContent: 'center', gap: 0,
      }}>
        <div style={{ maxWidth: 1100, width: '100%', display: 'flex', gap: 0 }}>
          {[
            { val: '1,000+', label: 'Active Bids' },
            { val: '+12',    label: 'New Today' },
            { val: '48',     label: 'Closing This Week' },
            { val: '50',     label: 'States Covered' },
          ].map((s, i, arr) => (
            <div key={s.label} style={{
              flex: 1, textAlign: 'center', padding: '8px 0',
              borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
                background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{s.val}</div>
              <div style={{ fontSize: '.7rem', color: 'var(--dim)', marginTop: 3, letterSpacing: '.08em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 120px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          <TabBtn active={tab === 'all'} onClick={() => setTab('all')}>All Bids</TabBtn>
          <TabBtn active={tab === 'foryou'} onClick={() => setTab('foryou')} locked>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
              For You — Radar AI
              <LockIcon size={11} />
            </span>
          </TabBtn>
        </div>

        {/* All Bids tab */}
        {tab === 'all' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Today's Opportunities</span>
                <span style={{ marginLeft: 10, fontSize: '.78rem', color: 'var(--dim)' }}>Showing {BIDS.length} of 1,000+ active bids</span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="badge badge-new" style={{ fontSize: '.65rem' }}>All States</span>
                <span className="badge badge-new" style={{ fontSize: '.65rem' }}>All Categories</span>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem', color: 'var(--dim)',
                  background: 'rgba(177,59,255,.06)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '5px 12px',
                }}>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  <span style={{ color: 'var(--muted)' }}>Filters locked — </span>
                  <a href="/signup" style={{ color: 'var(--purple)', textDecoration: 'none', fontWeight: 600 }}>Sign up to filter</a>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {BIDS.map(bid => (
                <BidCard
                  key={bid.id}
                  bid={bid}
                  hovered={hoveredCard === bid.id}
                  onHover={() => setHoveredCard(bid.id)}
                  onLeave={() => setHoveredCard(null)}
                />
              ))}
            </div>
          </>
        )}

        {/* For You tab — locked */}
        {tab === 'foryou' && <ForYouLocked onBrowseAll={() => setTab('all')} />}
      </div>

      {/* ── Sticky signup strip ──────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,6,23,.96)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(177,59,255,.25)',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '.88rem', color: 'var(--muted)' }}>You're viewing a sample of GovSignal. </span>
          <span style={{ fontSize: '.88rem', color: 'var(--text)', fontWeight: 600 }}>Unlock 1,000+ live bids — no credit card required.</span>
        </div>
        <a href="/signup" className="btn-accent" style={{ fontSize: '.9rem', padding: '10px 24px', flexShrink: 0 }}>
          Start Free — 7 Days →
        </a>
      </div>
    </div>
  );
}

/* ── Bid Card ─────────────────────────────────────────────── */
function BidCard({ bid, hovered, onHover, onLeave }: {
  bid: typeof BIDS[0];
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const catStyle = CAT_COLORS[bid.cat] ?? CAT_COLORS['Software'];
  const urgent = bid.daysLeft <= 21;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'rgba(20,14,44,.7)', border: `1px solid ${hovered ? 'rgba(177,59,255,.35)' : 'rgba(177,59,255,.12)'}`,
        borderRadius: 16, padding: 20, cursor: 'pointer',
        transition: 'border-color .2s, box-shadow .2s',
        boxShadow: hovered ? '0 0 30px rgba(177,59,255,.12)' : 'none',
      }}
    >
      {/* State badge + category */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{
          background: 'rgba(177,59,255,.15)', border: '1px solid rgba(177,59,255,.3)',
          color: 'rgba(177,59,255,.9)', borderRadius: 7, padding: '3px 10px',
          fontSize: '.65rem', fontWeight: 700, fontFamily: 'ui-monospace, monospace',
        }}>{bid.state}</span>
        <span style={{
          ...catStyle, borderRadius: 7, padding: '3px 10px',
          fontSize: '.65rem', fontWeight: 600, border: `1px solid ${catStyle.border}`,
        }}>{bid.cat}</span>
      </div>

      {/* Title */}
      <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text)', lineHeight: 1.45, marginBottom: 14 }}>
        {bid.title}
      </div>

      {/* Locked row — agency name */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
        padding: '7px 10px', borderRadius: 8,
        background: 'rgba(177,59,255,.04)', border: '1px solid rgba(177,59,255,.08)',
      }}>
        <LockIcon size={11} />
        <span style={{ fontSize: '.75rem', color: 'var(--dim)', flex: 1 }}>Agency name locked</span>
        <div style={{
          width: 110, height: 10, borderRadius: 4,
          background: 'linear-gradient(90deg, rgba(177,59,255,.15), rgba(255,45,146,.1))',
          filter: 'blur(2px)',
        }} />
      </div>

      {/* Due date + value row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.76rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: urgent ? '#f87171' : 'var(--dim)' }}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <span style={{ color: urgent ? '#fca5a5' : 'var(--muted)' }}>
            Due {bid.due}
            {urgent && <span style={{ marginLeft: 5, color: '#f87171', fontWeight: 600 }}>· {bid.daysLeft}d left</span>}
            {!urgent && <span style={{ marginLeft: 5, color: 'var(--dim)' }}>· {bid.daysLeft} days</span>}
          </span>
        </div>
        {/* Locked value */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.73rem' }}>
          <LockIcon size={10} />
          <div style={{ width: 40, height: 10, borderRadius: 4, background: 'rgba(177,59,255,.15)', filter: 'blur(2px)' }} />
        </div>
      </div>

      {/* Hover overlay */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 16,
          background: 'rgba(10,6,23,.82)', backdropFilter: 'blur(6px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--purple), var(--pink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LockIcon size={18} color="#fff" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text)', marginBottom: 4 }}>Unlock Full Details</div>
            <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>Agency · Value · Documents · AI Summary</div>
          </div>
          <a href="/signup" className="btn-accent" style={{ fontSize: '.82rem', padding: '9px 20px' }}>
            Sign Up Free →
          </a>
        </div>
      )}
    </div>
  );
}

/* ── For You locked state ─────────────────────────────────── */
function ForYouLocked({ onBrowseAll }: { onBrowseAll: () => void }) {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', padding: '40px 0' }}>

      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: 18, margin: '0 auto 24px',
        background: 'linear-gradient(135deg, rgba(177,59,255,.2), rgba(255,45,146,.15))',
        border: '1px solid rgba(177,59,255,.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b13bff"/><stop offset="1" stopColor="#ff2d92"/></linearGradient></defs>
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
        </svg>
      </div>

      <div className="eyebrow" style={{ marginBottom: 12 }}>Radar AI</div>
      <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 14, lineHeight: 1.15 }}>
        Bids ranked for<br /><span className="gradient-text">your business.</span>
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.75, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
        Sign up and tell us your company website. Radar AI builds a profile of your capabilities and scores every active bid 0–100% by fit — with a plain-English reason for each match.
      </p>

      {/* Preview of what it looks like — blurred cards */}
      <div style={{ position: 'relative', marginBottom: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, filter: 'blur(3px)', opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }}>
          {RADAR_BIDS.map(b => (
            <div key={b.title} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(177,59,255,.06)', border: '1px solid rgba(177,59,255,.14)',
              borderRadius: 12, padding: '12px 16px',
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{b.title}</div>
                <div style={{ fontSize: '.7rem', color: 'var(--dim)' }}>Matched to your profile</div>
              </div>
              <div style={{
                minWidth: 44, height: 28, borderRadius: 8,
                background: b.score >= 80 ? 'rgba(177,59,255,.2)' : 'rgba(177,59,255,.1)',
                border: '1px solid rgba(177,59,255,.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.78rem', fontWeight: 700, color: 'rgba(177,59,255,.9)',
              }}>{b.score}%</div>
            </div>
          ))}
        </div>
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 14, background: 'rgba(10,6,23,.55)', backdropFilter: 'blur(2px)',
        }}>
          <div style={{
            background: 'rgba(20,14,44,.95)', border: '1px solid rgba(177,59,255,.3)',
            borderRadius: 14, padding: '16px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
              Activate Radar AI with your profile
            </div>
            <div style={{ fontSize: '.72rem', color: 'var(--dim)' }}>Takes 60 seconds · no technical setup</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/signup" className="btn-accent" style={{ fontSize: '.9rem', padding: '11px 24px' }}>
          Set Up My Radar Profile →
        </a>
        <button onClick={onBrowseAll} className="btn-primary" style={{ fontSize: '.9rem', padding: '11px 20px', border: 'none', cursor: 'pointer' }}>
          ← Browse All Bids
        </button>
      </div>

      {/* 3 steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 48, textAlign: 'left' }}>
        {[
          { n: '1', t: 'We learn your business', d: 'Your website is analyzed into capabilities, services, and procurement keywords.' },
          { n: '2', t: 'Every bid gets a score', d: 'Each active bid is ranked 0–100% with a plain-English explanation of why it fits.' },
          { n: '3', t: 'It sharpens over time', d: 'Thumbs up/down on any bid refines your profile and improves future matches.' },
        ].map(s => (
          <div key={s.n} style={{
            background: 'rgba(20,14,44,.5)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 16,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 7, marginBottom: 10,
              background: 'linear-gradient(135deg, var(--purple), var(--pink))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.7rem', fontWeight: 800, color: '#fff',
            }}>{s.n}</div>
            <div style={{ fontWeight: 700, fontSize: '.82rem', color: 'var(--text)', marginBottom: 5 }}>{s.t}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)', lineHeight: 1.55 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tab button ───────────────────────────────────────────── */
function TabBtn({ children, active, onClick, locked }: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  locked?: boolean;
}) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', cursor: 'pointer',
      padding: '10px 16px', marginBottom: -1, fontSize: '.84rem', fontWeight: 600,
      color: active ? 'var(--purple)' : locked ? 'var(--dim)' : 'var(--muted)',
      borderBottom: active ? '2px solid var(--purple)' : '2px solid transparent',
      transition: 'color .15s, border-color .15s',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {children}
    </button>
  );
}

/* ── Lock icon ────────────────────────────────────────────── */
function LockIcon({ size = 14, color = 'var(--dim)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
