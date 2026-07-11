export default function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: 'blur(18px) saturate(1.4)',
      background: 'rgba(14, 10, 31, 0.8)',
      borderBottom: '1px solid rgba(236, 72, 153, 0.14)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 24px', maxWidth: 1180, margin: '0 auto' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem', color: 'var(--text)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          <span style={{ width: 30, height: 30, background: 'linear-gradient(135deg, var(--purple), var(--pink))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', fontWeight: 800, color: '#fff' }}>GS</span>
          GovSignal
        </a>

        <div className="hidden md:flex" style={{ gap: 32 }}>
          {['Features', 'How It Works', 'Pricing'].map(label => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
              style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '.875rem', fontWeight: 500 }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--muted)')}
            >{label}</a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="#" style={{ color: 'var(--muted)', fontSize: '.875rem', fontWeight: 500, textDecoration: 'none' }}>Log in</a>
          <a href="/demo" className="btn-accent" style={{ fontSize: '.85rem', padding: '9px 18px' }}>Try Free →</a>
        </div>
      </div>
    </nav>
  );
}
