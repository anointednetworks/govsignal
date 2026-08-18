import { SignUpButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { useReveal } from './hooks/useReveal';

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <Stats />
      <DashboardPreview />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}

/* ── Shared CTA button — opens Clerk sign-up or goes to dashboard ── */
function CtaButton({ label, style }: { label: string; style?: React.CSSProperties }) {
  const { isSignedIn, isLoaded } = useUser();
  if (isLoaded && isSignedIn) {
    return <Link to="/dashboard" className="btn-accent" style={style}>{label}</Link>;
  }
  return (
    <SignUpButton mode="modal">
      <button className="btn-accent" style={{ border: 'none', cursor: 'pointer', ...style }}>{label}</button>
    </SignUpButton>
  );
}

/* ── Stats strip ─────────────────────────────────────────── */
const STAT_ITEMS = [
  { value: '2,400+', label: 'Active Bids' },
  { value: '180+',   label: 'New This Week' },
  { value: '50',     label: 'States Covered' },
  { value: '15+',    label: 'Tech Categories' },
];

function Stats() {
  return (
    <div style={{ padding: '60px 0', background: 'rgba(14,10,31,.4)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32, textAlign: 'center' }}>
        {STAT_ITEMS.map(s => <StatItem key={s.label} {...s} />)}
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      <div style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, background: 'linear-gradient(135deg, var(--purple), var(--pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{value}</div>
      <div className="eyebrow" style={{ marginTop: 6 }}>{label}</div>
    </div>
  );
}

/* ── Dashboard preview ───────────────────────────────────── */
const DASHBOARD_BIDS = [
  { state: 'TX', title: 'Enterprise Cybersecurity Operations Center',   cat: 'CyberSec', due: 'Sep 5'  },
  { state: 'VA', title: 'Cloud Infrastructure Modernization Program',  cat: 'Cloud',    due: 'Sep 12' },
  { state: 'FL', title: 'Statewide Network Security Assessment',       cat: 'CyberSec', due: 'Sep 19' },
  { state: 'OH', title: 'Digital Identity & Access Management Suite',  cat: 'Software', due: 'Oct 2'  },
  { state: 'WA', title: 'AI-Assisted Fraud Detection Platform',        cat: 'AI & ML',  due: 'Oct 9'  },
];

function DashboardPreview() {
  const textRef = useReveal();
  const dashRef = useReveal();

  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>

        <div ref={textRef} className="reveal">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Your Dashboard</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 20 }}>
            Every bid.<br /><span className="gradient-text">One place.</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '.975rem', lineHeight: 1.75, marginBottom: 32, maxWidth: 420 }}>
            Every U.S. technology contract in one place — classified by category, sorted by deadline, and ready to act on before your day begins.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <CtaButton label="Start Free Trial" />
            <a href="/demo" className="btn-primary">Preview Dashboard</a>
          </div>
        </div>

        <div ref={dashRef} className="reveal" style={{ background: 'rgba(14,10,31,.9)', border: '1px solid rgba(177,59,255,.2)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 0 80px rgba(177,59,255,.1), 0 40px 80px rgba(0,0,0,.5)' }}>
          <div style={{ background: 'rgba(20,14,44,.95)', borderBottom: '1px solid rgba(177,59,255,.12)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'block' }} />
            <div style={{ flex: 1, background: 'rgba(177,59,255,.08)', border: '1px solid rgba(177,59,255,.15)', borderRadius: 8, padding: '3px 12px', fontSize: '.65rem', color: 'rgba(177,59,255,.7)', fontFamily: 'ui-monospace, monospace' }}>
              govsignal.com/dashboard
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.65rem', color: 'var(--green)' }}>
              <span className="live-dot" /> Live
            </span>
          </div>

          <div style={{ padding: '12px 14px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '.85rem', color: 'var(--text)' }}>Today's Bids</div>
              <div style={{ fontSize: '.68rem', color: 'var(--dim)' }}>Showing latest technology opportunities</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="badge badge-new">All States</span>
              <span className="badge badge-new">All Types</span>
            </div>
          </div>

          {DASHBOARD_BIDS.map(bid => (
            <div key={bid.title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,.04)', fontSize: '.78rem' }}>
              <span style={{ background: 'rgba(177,59,255,.15)', border: '1px solid rgba(177,59,255,.25)', color: 'rgba(177,59,255,.9)', borderRadius: 6, padding: '2px 7px', fontSize: '.6rem', fontWeight: 700, flexShrink: 0, minWidth: 30, textAlign: 'center', fontFamily: 'ui-monospace, monospace' }}>{bid.state}</span>
              <span style={{ flex: 1, color: 'var(--text)', fontWeight: 500, fontSize: '.8rem' }}>{bid.title}</span>
              <span style={{ color: 'var(--dim)', fontSize: '.68rem', flexShrink: 0 }}>{bid.cat}</span>
              <span style={{ color: 'var(--gold)', fontSize: '.68rem', flexShrink: 0, fontFamily: 'ui-monospace, monospace' }}>{bid.due}</span>
            </div>
          ))}

          <div style={{ padding: '10px 14px', textAlign: 'center' }}>
            <a href="#pricing" style={{ fontSize: '.72rem', color: 'var(--purple)', textDecoration: 'none' }}>Showing 5 of 1,000+ active bids — Start free to see them all →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ───────────────────────────────────────────── */
function CTA() {
  const ref = useReveal();
  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(rgba(177,59,255,0.14) 0%, rgba(255,45,146,0.06) 40%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div ref={ref} className="reveal">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Start Today</div>
          <h2 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--text)', marginBottom: 20, lineHeight: 1.06 }}>
            The bid is posted.<br /><span className="gradient-text">Be first to see it.</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: 460, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Join IT companies across the U.S. who start every morning with GovSignal — the complete picture of what's out there, matched to your business.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <CtaButton label="Start Free — 7-Day Trial →" style={{ fontSize: '1rem', padding: '14px 32px' }} />
            <a href="#features" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>See how it works</a>
          </div>
        </div>
      </div>
    </section>
  );
}
