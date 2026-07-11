export default function Hero() {
  return (
    <section style={{ minHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 60px', position: 'relative', overflow: 'hidden', marginTop: 64 }}>
      {/* Radial glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', width: 800, height: 600, borderRadius: '50%', background: 'radial-gradient(rgba(177,59,255,0.16) 0%, rgba(255,45,146,0.07) 40%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 840, margin: '0 auto' }}>

        {/* Badge pill */}
        <div className="ha1" style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(177,59,255,.1)', border: '1px solid rgba(177,59,255,.28)', borderRadius: 100, padding: '5px 14px 5px 7px', cursor: 'pointer' }}>
            <span className="gradient-bg" style={{ borderRadius: 100, padding: '2px 9px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
              <span style={{ fontSize: '.7rem', color: '#fff', fontWeight: 700 }}>New</span>
            </span>
            <span style={{ fontSize: '.8rem', color: 'var(--muted)', fontWeight: 500 }}>AI-matched bid intelligence for tech companies</span>
            <span style={{ color: 'var(--dim)', fontSize: '.8rem' }}>→</span>
          </div>
        </div>

        <h1 className="ha2" style={{ fontSize: 'clamp(42px, 7vw, 82px)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.04, letterSpacing: '-0.05em', marginBottom: 24 }}>
          Government tech bids.<br /><span className="gradient-text">On signal.</span>
        </h1>

        <p className="ha3" style={{ fontSize: 'clamp(16px, 2.2vw, 19px)', color: 'var(--muted)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 40px', fontWeight: 400 }}>
          GovSignal tracks government procurement activity across the entire United States and delivers every technology opportunity to your inbox — classified, AI-scored, and ready to bid.
        </p>

        <div className="ha4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
          <a href="/demo" className="btn-accent" style={{ fontSize: '1rem', padding: '14px 30px' }}>
            Start Free — 7 Days
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </a>
          <a href="#features" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 30px' }}>See how it works</a>
        </div>

        <div className="ha5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--gold)', fontSize: 15, letterSpacing: 1 }}>★★★★★</span>
          <span style={{ color: 'var(--dim)', fontSize: '.85rem' }}>Rated 4.8/5</span>
          <Dot />
          <span style={{ color: 'var(--dim)', fontSize: '.85rem' }}>2,400+ companies</span>
          <Dot />
          <span style={{ color: 'var(--dim)', fontSize: '.85rem' }}>Nationwide coverage</span>
          <Dot />
          <span style={{ color: 'var(--dim)', fontSize: '.85rem' }}>Free 7-day trial</span>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span style={{ color: 'rgba(255,255,255,.12)' }}>·</span>;
}
