import { LegalPage } from './Privacy';

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    content: (
      <p>
        By accessing or using GovSignal ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. These terms apply to all users including free trial users, paid subscribers, and team members invited by a subscriber.
      </p>
    ),
  },
  {
    title: 'Description of Service',
    content: (
      <p>
        GovSignal is a government procurement intelligence platform that aggregates publicly available technology bid opportunities from U.S. federal, state, and municipal government sources and delivers them to subscribers via a web dashboard and email. GovSignal also provides AI-powered bid matching based on a subscriber's company profile.
      </p>
    ),
  },
  {
    title: 'Free Trial',
    content: (
      <>
        <p>New accounts receive a 7-day free trial with full access to all platform features. No credit card is required to start a trial.</p>
        <ul>
          <li>At the end of the trial, your account will convert to a free read-only view unless you choose a paid plan.</li>
          <li>Trial accounts may be subject to usage limits at our discretion.</li>
          <li>We reserve the right to modify or discontinue the free trial offer at any time.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Subscription & Billing',
    content: (
      <>
        <p>Paid subscriptions are billed in advance on your chosen billing cycle (monthly, quarterly, or annual). All prices are in U.S. dollars.</p>
        <ul>
          <li>Subscriptions automatically renew at the end of each billing period unless cancelled.</li>
          <li>You may cancel your subscription at any time from your account settings. Access continues until the end of the current billing period.</li>
          <li>We offer a 7-day money-back guarantee on your first paid period. Refund requests after 7 days are evaluated on a case-by-case basis.</li>
          <li>We reserve the right to adjust pricing with 30 days' notice to existing subscribers.</li>
          <li>Payments are processed securely by Stripe. We do not store your payment card information.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Team Seats',
    content: (
      <p>
        Every paid subscription includes up to 2 sponsored seats for colleagues at the same company email domain, at no additional charge. Team members inherit the subscriber's plan access. The account owner is responsible for all activity under invited team seats. Seats are non-transferable and limited to users on the same company domain as the subscriber.
      </p>
    ),
  },
  {
    title: 'Acceptable Use',
    content: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Scrape, copy, or redistribute GovSignal's curated bid data or AI-generated content in bulk or for resale.</li>
          <li>Use the Service to build a competing product or service that aggregates government procurement data.</li>
          <li>Share your account credentials with users outside your company domain.</li>
          <li>Attempt to access systems, data, or accounts you are not authorized to access.</li>
          <li>Use automated bots or scripts to access the platform at a rate that degrades service for other users.</li>
        </ul>
        <p style={{ marginTop: 10 }}>Violation of these restrictions may result in immediate account termination without refund.</p>
      </>
    ),
  },
  {
    title: 'Data & Intellectual Property',
    content: (
      <>
        <p>
          The underlying government procurement data displayed on GovSignal is public record and remains the property of the issuing government agency. GovSignal's proprietary interest is in the classification, matching, scoring, summarization, and delivery of that data.
        </p>
        <p style={{ marginTop: 10 }}>
          GovSignal's platform software, design, Radar AI matching system, and all original content are owned by GovSignal, Inc. and may not be copied, modified, or distributed without written permission.
        </p>
      </>
    ),
  },
  {
    title: 'Disclaimer of Warranties',
    content: (
      <p>
        GovSignal provides bid data on an "as is" basis. We make no warranties that the data is complete, accurate, or up to date. Government agencies may update, withdraw, or amend procurement opportunities without notice. You are responsible for independently verifying any bid before acting on it. GovSignal is not a law firm and does not provide legal advice regarding government contracting.
      </p>
    ),
  },
  {
    title: 'Limitation of Liability',
    content: (
      <p>
        GovSignal's total liability for any claim arising from your use of the Service shall not exceed the total amount you paid to GovSignal in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages including lost business opportunities or missed bid deadlines resulting from inaccurate or incomplete data.
      </p>
    ),
  },
  {
    title: 'Termination',
    content: (
      <p>
        We reserve the right to suspend or terminate any account that violates these Terms, engages in fraudulent activity, or uses the Service in a way that harms other users or the platform. You may terminate your account at any time from your account settings. Upon termination, your access to the Service will end at the close of your current billing period.
      </p>
    ),
  },
  {
    title: 'Governing Law',
    content: (
      <p>
        These Terms are governed by the laws of the State of Georgia. Any disputes arising from use of the Service shall be resolved in the courts of Georgia.
      </p>
    ),
  },
  {
    title: 'Changes to These Terms',
    content: (
      <p>
        We may update these Terms from time to time. Material changes will be communicated via email to registered users at least 14 days before taking effect. Continued use of the Service after the effective date constitutes acceptance of the updated Terms.
      </p>
    ),
  },
  {
    title: 'Contact',
    content: (
      <p>
        Questions about these Terms? Email us at <a href="mailto:hello@govsignal.com" style={{ color: 'var(--purple)' }}>hello@govsignal.com</a>.
      </p>
    ),
  },
];

export default function Terms() {
  return <LegalPage title="Terms of Service" updated="August 2026" sections={SECTIONS} />;
}
