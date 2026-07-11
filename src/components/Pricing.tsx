import { useReveal } from '../hooks/useReveal';

const PLANS = [
  {
    period: 'Monthly',
    price: '$49',
    sub: '/month · flexible',
    popular: false,
  },
  {
    period: 'Yearly',
    price: '$490',
    sub: '/year · ~$41/mo · save $98',
    popular: true,
  },
  {
    period: 'Quarterly',
    price: '$125',
    sub: '/quarter · ~$42/mo',
    popular: false,
  },
];

const FEATURES = [
  'Unlimited bid access',
  'Radar AI matching',
  '2 free team seats',
  'Daily email briefs',
  'AI Copilot summaries',
];

export default function Pricing() {
  const headRef = useReveal();
  const noteRef = useReveal();

  return (
    <section id="pricing" style={{ padding: '100px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>

        <div ref={headRef} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 16 }}>
            Simple, honest pricing.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '.975rem', maxWidth: 440, margin: '0 auto' }}>
            Try everything free for 7 days. No charge today. Cancel any time before trial ends.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 940, margin: '0 auto' }}>
          {PLANS.map(plan => <PlanCard key={plan.period} {...plan} />)}
        </div>

        <div ref={noteRef} className="reveal" style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: '.82rem', color: 'var(--dim)' }}>
            No contracts. No setup fees. 7-day money-back guarantee. Annual billing saves 2 months.
          </p>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ period, price, sub, popular }: { period: string; price: string; sub: string; popular: boolean }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${popular ? 'pricing-popular' : 'pricing-regular'}`}>
      {popular && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
          <span className="gradient-bg" style={{ color: '#fff', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: 100 }}>Most popular</span>
        </div>
      )}
      <div className="eyebrow" style={{ marginBottom: 14, color: popular ? 'var(--purple)' : undefined }}>{period}</div>
      <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 4, lineHeight: 1 }}>{price}</div>
      <div style={{ color: popular ? 'var(--muted)' : 'var(--dim)', fontSize: '.82rem', marginBottom: 28 }}>{sub}</div>
      <ul className="check-list" style={{ marginBottom: 28 }}>
        {FEATURES.map(f => <li key={f}>{f}</li>)}
      </ul>
      <a href="#" className={popular ? 'btn-accent' : 'btn-primary'} style={{ width: '100%', justifyContent: 'center' }}>
        Start 7-day free trial →
      </a>
    </div>
  );
}
