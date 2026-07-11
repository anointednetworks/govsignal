import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const FAQS = [
  {
    q: 'How does GovSignal get its bid data?',
    a: 'We run automated spiders against 100+ federal, state, and municipal procurement portals every day — including SAM.gov, all 50 state eProcurement systems, and major city and county portals. We normalize the data, filter for technology-category bids, and load everything into your dashboard before 6 AM each morning.',
  },
  {
    q: 'What types of bids are included?',
    a: 'RFPs, RFQs, ITBs, BPAs, CSOs, and contract award notices across networking, cloud, cybersecurity, ERP, managed IT, software development, hardware, web/digital, and other technology categories. Non-technology listings are filtered out at ingest.',
  },
  {
    q: 'How does the free trial work?',
    a: 'Sign up today — no credit card required. You get full access for 7 days, including Radar AI matching, team workspace, and daily email briefs. Cancel any time from your account settings before the trial ends and you won\'t be charged.',
  },
  {
    q: 'How does the AI matching (Radar) work?',
    a: 'We analyze your company website, the services you listed at signup, and your saved and dismissed bids to build a relevance model. Every new bid scores 0–100% against your profile with a plain-English reason. The model improves as you rate bids in your For You feed.',
  },
  {
    q: 'How many team members can I invite?',
    a: 'Every paid plan includes 2 free sponsored seats for colleagues on your company domain. They get full access — search, save, pipeline board, and daily briefs — at no extra cost. Enterprise plans with additional seats are available on request.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your account dashboard at any time. If you\'re in the trial, you won\'t be charged. If you\'re on a paid plan, you keep access until the end of your billing period. We also offer a 7-day money-back guarantee after the trial ends.',
  },
];

export default function FAQ() {
  const headRef = useReveal();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>

        <div ref={headRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>FAQ</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)' }}>
            Common questions.
          </h2>
        </div>

        <div>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} {...faq} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal faq-item" onClick={onToggle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontWeight: 600, fontSize: '.95rem', color: 'var(--text)' }}>
        {q}
        <span style={{ color: isOpen ? 'var(--purple)' : 'var(--dim)', transition: 'transform .3s, color .2s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0, display: 'inline-block' }}>▾</span>
      </div>
      {isOpen && <div className="faq-a">{a}</div>}
    </div>
  );
}
