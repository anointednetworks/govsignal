const COL_LINKS: Record<string, string[]> = {
  Product: ['Features', 'Pricing', 'How It Works', 'Dashboard Demo'],
  Company: ['About', 'Blog', 'Contact', 'Careers'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Refund Policy'],
};

export default function Footer() {
  return (
    <footer style={{ background: 'rgba(8, 4, 20, .95)', borderTop: '1px solid var(--border)', padding: '64px 0 32px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ width: 30, height: 30, background: 'linear-gradient(135deg, var(--purple), var(--pink))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', fontWeight: 800, color: '#fff' }}>GS</span>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>GovSignal</span>
            </div>
            <p style={{ color: 'var(--dim)', fontSize: '.85rem', lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
              The procurement intelligence platform for American tech companies. Every U.S. government tech bid, delivered daily.
            </p>
            <span className="source-chip">🇺🇸 Built in the U.S.</span>
          </div>

          {Object.entries(COL_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(l => (
                  <a key={l} href="#" style={{ color: 'var(--dim)', fontSize: '.875rem', textDecoration: 'none' }}
                    onMouseOver={e => (e.currentTarget.style.color = 'var(--text)')}
                    onMouseOut={e => (e.currentTarget.style.color = 'var(--dim)')}
                  >{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '.8rem', color: 'var(--dim)' }}>© 2026 GovSignal. All rights reserved.</span>
          <span style={{ fontSize: '.8rem', color: 'var(--dim)' }}>hello@govsignal.com</span>
        </div>
      </div>
    </footer>
  );
}
