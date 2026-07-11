import { useReveal } from '../hooks/useReveal';

const STEPS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="var(--purple)" strokeWidth="1.6" /><path d="M3 11h16M11 3c-2.8 3.3-2.8 12.4 0 16M11 3c2.8 3.3 2.8 12.4 0 16" stroke="var(--purple)" strokeWidth="1.5" /></svg>
    ),
    label: 'We Monitor',
    title: 'Federal Procurement',
    desc: 'Our intelligence platform continuously monitors federal procurement activity — solicitations, RFQs, and contract awards from civilian and defense agencies — updated multiple times per day.',
    chips: ['Civilian Agencies', 'Defense Contracting', 'Federal Awards'],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M4 18V9l7-5 7 5v9" stroke="var(--purple)" strokeWidth="1.6" /><rect x="9" y="13" width="4" height="5" stroke="var(--purple)" strokeWidth="1.5" /></svg>
    ),
    label: 'We Monitor',
    title: 'All 50 States',
    desc: 'State and territorial procurement activity is tracked across all 50 states. Every tech-relevant opportunity is captured and classified before it reaches your dashboard.',
    chips: ['State Governments', 'Territorial Agencies', 'All 50 States'],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 2L2 7v6c0 5 3.8 8.7 9 9.5 5.2-.8 9-4.5 9-9.5V7L11 2z" stroke="var(--purple)" strokeWidth="1.6" /></svg>
    ),
    label: 'We Monitor',
    title: 'Cities & Counties',
    desc: 'Municipal and county-level procurement is tracked nationwide — from the largest metro governments down to smaller local agencies that publish technology contracts.',
    chips: ['Major Metro Areas', 'County Procurement', 'Local Agencies'],
  },
];

const PIPELINE = [
  { label: 'Step 1', text: 'We Collect',  sub: 'nationwide, 24/7',       gold: false, green: false },
  { label: 'Step 2', text: 'We Classify', sub: 'tech bids only',          gold: false, green: false },
  { label: 'Step 3', text: 'AI Scores',   sub: 'ranked by fit',           gold: true,  green: false },
  { label: 'Step 4', text: 'You Win',     sub: 'in your inbox by 6 AM',   gold: false, green: true  },
];

export default function HowItWorks() {
  const headRef = useReveal();
  const pipeRef = useReveal();

  return (
    <section id="how-it-works" style={{ padding: '100px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>

        <div ref={headRef} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 16 }}>
            Three steps to your next contract.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '.975rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Our proprietary intelligence platform does the heavy lifting so your team spends time bidding, not searching.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
          {STEPS.map(s => <StepCard key={s.title} {...s} />)}
        </div>

        {/* Pipeline flow */}
        <div ref={pipeRef} className="reveal glass-card" style={{ background: 'rgba(14,10,31,.6)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr auto 1fr auto', alignItems: 'center', gap: 12, textAlign: 'center' }}>
            {PIPELINE.map((step, i) => (
              <>
                <div key={step.label + step.text}>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>{step.label}</div>
                  <div style={{
                    background: step.gold ? 'rgba(245,158,11,.08)' : step.green ? 'rgba(0,182,122,.08)' : 'rgba(177,59,255,.1)',
                    border: `1px solid ${step.gold ? 'rgba(245,158,11,.2)' : step.green ? 'rgba(0,182,122,.2)' : 'rgba(177,59,255,.2)'}`,
                    borderRadius: 12, padding: '12px 16px', fontSize: '.8rem', fontWeight: 600,
                    color: step.gold ? '#fcd34d' : step.green ? 'var(--green)' : 'var(--muted)',
                  }}>
                    {step.text}<br />
                    <span style={{ fontWeight: 400, fontSize: '.72rem', color: 'var(--dim)' }}>{step.sub}</span>
                  </div>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div key={`sep-${i}`} style={{ height: 2, background: 'linear-gradient(90deg, rgba(177,59,255,.5), rgba(255,45,146,.3))' }} />
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ icon, label, title, desc, chips }: { icon: React.ReactNode; label: string; title: string; desc: string; chips: string[] }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, background: 'rgba(177,59,255,.12)', border: '1px solid rgba(177,59,255,.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: 'var(--purple)' }}>{label}</span>
      </div>
      <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{title}</div>
      <p style={{ color: 'var(--muted)', fontSize: '.85rem', lineHeight: 1.65, marginBottom: 16 }}>{desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {chips.map(c => <span key={c} className="source-chip">{c}</span>)}
      </div>
    </div>
  );
}
