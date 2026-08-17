import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'What Data We Collect',
    content: (
      <>
        <p>When you visit GovSignal, we may collect:</p>
        <ul>
          <li>Your IP address and browser information.</li>
          <li>Your name and email address when you create an account.</li>
          <li>Your company name and website URL used to build your Radar AI profile.</li>
          <li>Bids you save, dismiss, or mark as pursued within the platform.</li>
          <li>Behavioral data on how you interact with the dashboard (pages viewed, filters used, search terms).</li>
          <li>Payment information processed securely through our payment provider — we do not store card numbers.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Why We Collect Your Data',
    content: (
      <>
        <p>We collect your data to:</p>
        <ul>
          <li>Create and maintain your account and subscription.</li>
          <li>Deliver your daily bid brief and personalized Radar AI matches.</li>
          <li>Analyze your company profile to rank active bids by relevance to your business.</li>
          <li>Improve the accuracy of bid classification and matching over time.</li>
          <li>Send service communications, billing notices, and product updates.</li>
          <li>Respond to support requests and troubleshoot issues.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Radar AI & Company Profile Data',
    content: (
      <p>
        When you activate Radar AI, GovSignal analyzes your publicly available company website to build a profile of your services, technologies, and capabilities. This analysis is used exclusively to rank government procurement opportunities by relevance to your business. We do not sell, share, or use your company profile data for any purpose outside of delivering GovSignal's matching features.
      </p>
    ),
  },
  {
    title: 'Government Procurement Data',
    content: (
      <p>
        GovSignal aggregates publicly available procurement data from U.S. federal, state, and municipal government sources. This data is public record. We do not claim ownership of underlying government documents, and all sourced bid information remains the property of the issuing government agency.
      </p>
    ),
  },
  {
    title: 'Safeguarding Your Data',
    content: (
      <p>
        GovSignal uses industry-standard security practices including encrypted data storage, secure HTTPS transmission, and access controls. Your account password is hashed and never stored in plain text. We review our security practices regularly and notify users of any material breach in accordance with applicable law.
      </p>
    ),
  },
  {
    title: 'Data Retention & Deletion',
    content: (
      <>
        <p>We retain your data for as long as your account is active. You may request deletion of your account and all associated data at any time by emailing <a href="mailto:hello@govsignal.com" style={{ color: 'var(--purple)' }}>hello@govsignal.com</a>. Upon request:</p>
        <ul>
          <li>Your account, profile, and saved bid data will be permanently deleted.</li>
          <li>Your Radar AI company profile will be purged from our systems.</li>
          <li>Any team member accounts linked to your subscription will also be closed.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Cookies',
    content: (
      <p>
        GovSignal uses cookies to maintain your login session, remember your preferences, and analyze usage patterns to improve the platform. You may disable cookies in your browser settings; however, doing so may prevent certain platform features from functioning correctly. We do not use cookies for cross-site advertising tracking.
      </p>
    ),
  },
  {
    title: 'Third-Party Services',
    content: (
      <>
        <p>GovSignal uses the following third-party services to operate the platform:</p>
        <ul>
          <li><strong style={{ color: 'var(--text)' }}>Stripe</strong> — payment processing. Your card data is handled directly by Stripe and is never stored on GovSignal servers.</li>
          <li><strong style={{ color: 'var(--text)' }}>Clerk</strong> — authentication and session management.</li>
          <li><strong style={{ color: 'var(--text)' }}>Supabase</strong> — database and secure data storage.</li>
        </ul>
        <p style={{ marginTop: 10 }}>Each provider maintains its own privacy policy. We share only the minimum data required for each service to function.</p>
      </>
    ),
  },
  {
    title: 'Your Rights',
    content: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate data.</li>
          <li>Request deletion of your data.</li>
          <li>Opt out of marketing emails at any time via the unsubscribe link in any email we send.</li>
        </ul>
        <p style={{ marginTop: 10 }}>To exercise any of these rights, contact us at <a href="mailto:hello@govsignal.com" style={{ color: 'var(--purple)' }}>hello@govsignal.com</a>.</p>
      </>
    ),
  },
  {
    title: 'Changes to This Policy',
    content: (
      <p>
        We may update this privacy policy from time to time. Material changes will be communicated via email to registered users and by updating the "Last updated" date on this page. Continued use of GovSignal after changes are posted constitutes acceptance of the updated policy.
      </p>
    ),
  },
  {
    title: 'Contact Us',
    content: (
      <p>
        Questions about this privacy policy? Email us at <a href="mailto:hello@govsignal.com" style={{ color: 'var(--purple)' }}>hello@govsignal.com</a>.
      </p>
    ),
  },
];

export default function Privacy() {
  return <LegalPage title="Privacy Policy" updated="August 2026" sections={SECTIONS} />;
}

function LegalPage({ title, updated, sections }: {
  title: string;
  updated: string;
  sections: { title: string; content: React.ReactNode }[];
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{
        background: 'rgba(10,6,23,.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 'auto' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, var(--purple), var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', fontWeight: 800, color: '#fff' }}>GS</div>
          <span style={{ fontWeight: 700, fontSize: '.95rem', color: 'var(--text)' }}>GovSignal</span>
        </Link>
        <Link to="/" style={{ color: 'var(--dim)', fontSize: '.82rem', textDecoration: 'none' }}>← Back to home</Link>
      </nav>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '64px 24px 100px' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Legal</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 8 }}>{title}</h1>
        <p style={{ color: 'var(--dim)', fontSize: '.85rem', marginBottom: 48 }}>Last updated: {updated} · GovSignal, Inc.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {sections.map((s, i) => (
            <div key={i}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>{s.title}</h2>
              <div style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.75 }}>
                {s.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '.8rem', color: 'var(--dim)' }}>© 2026 GovSignal, Inc. All rights reserved. · </span>
        <Link to="/terms" style={{ fontSize: '.8rem', color: 'var(--dim)', textDecoration: 'none' }}>Terms of Service</Link>
        <span style={{ color: 'var(--dim)', fontSize: '.8rem' }}> · </span>
        <Link to="/privacy" style={{ fontSize: '.8rem', color: 'var(--purple)', textDecoration: 'none' }}>Privacy Policy</Link>
      </footer>

      <style>{`
        ul { margin: 8px 0 0 20px; padding: 0; }
        li { margin-bottom: 6px; }
        p { margin: 0; }
        p + p { margin-top: 10px; }
      `}</style>
    </div>
  );
}

export { LegalPage };
