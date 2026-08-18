import { SignUpButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

const FEATURES = [
  { icon: '🔍', title: 'Unlimited bid access', desc: 'Every active U.S. federal & state IT contract — no caps, no paywalled previews.' },
  { icon: '🎯', title: 'Radar AI matching', desc: 'Set your NAICS codes and states once; AI surfaces the bids most likely to win.' },
  { icon: '📋', title: 'AI Copilot summaries', desc: 'Instant plain-English briefs on scope, set-aside status, and key deadlines.' },
  { icon: '📬', title: 'Daily email briefs', desc: 'Your personalized bid digest lands every morning before the workday starts.' },
  { icon: '👥', title: '2 team seats included', desc: 'Add a second person at no extra cost — BD lead, proposal writer, or partner.' },
  { icon: '📊', title: 'Full filter & search', desc: 'Slice by category, state, NAICS, set-aside type, and deadline — saved as views.' },
];

const BILLING = [
  { period: 'Monthly',   price: '$49',  sub: '/month',    note: 'Most flexible',    popular: false, save: '' },
  { period: 'Yearly',    price: '$490', sub: '/year',     note: 'Best value',       popular: true,  save: 'Save $98 vs monthly' },
  { period: 'Quarterly', price: '$125', sub: '/quarter',  note: 'Good middle ground', popular: false, save: '' },
];

function CtaButton({ popular, label }: { popular: boolean; label: string }) {
  const { isSignedIn, isLoaded } = useUser();
  if (isLoaded && isSignedIn) {
    return <Link to="/dashboard" className={popular ? 'btn-accent' : 'btn-primary'} style={{ width: '100%', justifyContent: 'center' }}>{label}</Link>;
  }
  return (
    <SignUpButton mode="modal">
      <button className={popular ? 'btn-accent' : 'btn-primary'} style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>{label}</button>
    </SignUpButton>
  );
}

export default function Pricing() {
  const headRef  = useReveal();
  const leftRef  = useReveal();
  const rightRef = useReveal();
  const noteRef  = useReveal();

  return (
    <section id="pricing" style={{ padding: '100px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>

        <div ref={headRef} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 16 }}>
            Everything included. Pick your billing.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '.975rem', maxWidth: 480, margin: '0 auto' }}>
            One plan, full access. No feature tiers, no paywalled filters — choose the billing cycle that fits your business.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start', maxWidth: 1060, margin: '0 auto' }}>

          {/* Left: what you get */}
          <div ref={leftRef} className="reveal">
            <div className="eyebrow" style={{ marginBottom: 20 }}>What's included</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {FEATURES.map(f => (
                <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: 2 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text)', marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.55 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: billing options */}
          <div ref={rightRef} className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Choose billing cycle</div>
            {BILLING.map(plan => (
              <BillingCard key={plan.period} {...plan} />
            ))}
            <p style={{ fontSize: '.78rem', color: 'var(--dim)', marginTop: 4, textAlign: 'center' }}>
              7-day free trial · no card required · cancel anytime
            </p>
          </div>
        </div>

        <div ref={noteRef} className="reveal" style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: '.82rem', color: 'var(--dim)' }}>
            No contracts. No setup fees. 7-day money-back guarantee. Annual billing saves 2 months.
          </p>
        </div>
      </div>
    </section>
  );
}

function BillingCard({ period, price, sub, note, popular, save }: {
  period: string; price: string; sub: string; note: string; popular: boolean; save: string;
}) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${popular ? 'pricing-popular' : 'pricing-regular'}`} style={{ padding: '20px 24px' }}>
      {popular && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
          <span className="gradient-bg" style={{ color: '#fff', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: 100 }}>Best value</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text)' }}>{period}</div>
          <div style={{ fontSize: '.75rem', color: popular ? 'var(--muted)' : 'var(--dim)', marginTop: 1 }}>{note}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1 }}>{price}</div>
          <div style={{ fontSize: '.72rem', color: popular ? 'var(--muted)' : 'var(--dim)' }}>{sub}</div>
        </div>
      </div>
      {save && (
        <div style={{ background: 'rgba(177,59,255,.12)', border: '1px solid rgba(177,59,255,.2)', borderRadius: 6, padding: '4px 10px', fontSize: '.72rem', color: 'var(--purple)', fontWeight: 600, display: 'inline-block', marginBottom: 12 }}>
          {save}
        </div>
      )}
      <CtaButton popular={popular} label="Start 7-day free trial →" />
    </div>
  );
}
