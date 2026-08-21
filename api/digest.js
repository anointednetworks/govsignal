const crypto = require('crypto');
const pool   = require('./db');

const APP_URL    = process.env.APP_URL    ?? 'https://govsignal.pages.dev';
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'GovSignal <noreply@govsignal.com>';
const RESEND_KEY = process.env.RESEND_API_KEY;

/* ── helpers ──────────────────────────────────────────────── */

function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

async function getOrCreateToken(userId) {
  const { rows } = await pool.query(
    `INSERT INTO email_prefs (user_id, token)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET token = email_prefs.token
     RETURNING token, unsubscribed_at`,
    [userId, makeToken()]
  );
  return rows[0];
}

async function getClerkUsers() {
  const key = process.env.CLERK_SECRET_KEY;
  if (!key) throw new Error('CLERK_SECRET_KEY not set');

  const users = [];
  let offset = 0;
  const limit = 500;

  while (true) {
    const res = await fetch(
      `https://api.clerk.com/v1/users?limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) throw new Error(`Clerk API ${res.status}`);
    const page = await res.json();
    if (!page.length) break;

    for (const u of page) {
      const primary = u.email_addresses?.find(e => e.id === u.primary_email_address_id);
      if (primary?.email_address) {
        users.push({ id: u.id, email: primary.email_address, name: u.first_name ?? null });
      }
    }

    if (page.length < limit) break;
    offset += limit;
  }

  return users;
}

async function getTodaysBids() {
  const { rows } = await pool.query(`
    SELECT title, agency, state_code, category, response_deadline, sam_url, sam_id
    FROM bids
    WHERE status = 'active'
      AND posted_date >= CURRENT_DATE
    ORDER BY response_deadline ASC NULLS LAST
    LIMIT 20
  `);
  return rows;
}

async function getStats() {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'active')                                        AS total_active,
      COUNT(*) FILTER (WHERE status = 'active' AND posted_date >= CURRENT_DATE)        AS new_today,
      COUNT(*) FILTER (WHERE status = 'active'
        AND response_deadline >= NOW()
        AND response_deadline <= NOW() + INTERVAL '7 days')                            AS closing_this_week
    FROM bids
  `);
  return rows[0];
}

/* ── email template ───────────────────────────────────────── */

function fmt(date) {
  if (!date) return 'TBD';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysLeft(date) {
  if (!date) return null;
  const d = Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
  return d > 0 ? d : null;
}

function bidRow(bid) {
  const dl   = daysLeft(bid.response_deadline);
  const due  = fmt(bid.response_deadline);
  const url  = bid.sam_url ?? `https://sam.gov/opp/${bid.sam_id}/view`;
  const urgentColor = dl !== null && dl <= 7 ? '#f87171' : dl !== null && dl <= 14 ? '#fbbf24' : '#8b7ab8';
  const state = bid.state_code ?? 'US';

  return `
  <tr>
    <td style="padding:0 0 2px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
             style="background:#100c28;border:1px solid #2a1f50;border-radius:10px;margin-bottom:8px;">
        <tr>
          <td style="padding:14px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right:12px;" width="36" valign="top">
                  <div style="background:#1e1240;border:1px solid #3d2a70;border-radius:6px;
                              color:#b13bff;font-size:10px;font-weight:700;text-align:center;
                              padding:4px 2px;font-family:monospace;width:32px;">${state}</div>
                </td>
                <td valign="top">
                  <a href="${url}" style="color:#e2d9f3;font-size:14px;font-weight:600;
                                          text-decoration:none;line-height:1.4;
                                          display:block;margin-bottom:4px;">${bid.title}</a>
                  <span style="color:#6b5e8a;font-size:12px;">${bid.agency ?? '—'}</span>
                </td>
                <td valign="top" align="right" width="90" style="padding-left:12px;white-space:nowrap;">
                  <div style="color:${urgentColor};font-size:12px;font-weight:600;">${due}</div>
                  ${dl ? `<div style="color:${urgentColor};font-size:11px;opacity:.8;">${dl}d left</div>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function buildHtml({ bids, stats, name, unsubToken }) {
  const date      = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const greeting  = name ? `Good morning, ${name}.` : 'Good morning.';
  const dashUrl   = `${APP_URL}/dashboard`;
  const unsubUrl  = `${APP_URL.replace('pages.dev', 'up.railway.app').replace('govsignal.pages.dev', 'govsignal-production-93de.up.railway.app')}/unsubscribe?token=${unsubToken}`;
  const bidRows   = bids.length
    ? bids.map(bidRow).join('\n')
    : `<tr><td style="color:#6b5e8a;font-size:13px;padding:20px 0;">No new bids posted today yet — check back tomorrow.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<title>GovSignal — ${date}</title>
</head>
<body style="margin:0;padding:0;background:#06040f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

<!-- wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#06040f;">
<tr><td align="center" style="padding:32px 16px 48px;">

  <!-- card -->
  <table width="600" cellpadding="0" cellspacing="0" border="0"
         style="max-width:600px;width:100%;background:#0d0a1e;border:1px solid #1e1640;border-radius:16px;overflow:hidden;">

    <!-- header bar -->
    <tr>
      <td style="background:linear-gradient(135deg,#1a0d35,#0f0a24);padding:24px 28px;border-bottom:1px solid #1e1640;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <!-- logo -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#b13bff,#ff2d92);border-radius:8px;
                              width:28px;height:28px;text-align:center;vertical-align:middle;
                              font-size:11px;font-weight:800;color:#fff;padding:0;"
                      width="28">GS</td>
                  <td style="padding-left:10px;color:#e2d9f3;font-size:15px;font-weight:700;
                              letter-spacing:-0.02em;">GovSignal</td>
                </tr>
              </table>
            </td>
            <td align="right" style="color:#6b5e8a;font-size:12px;">${date}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- greeting -->
    <tr>
      <td style="padding:28px 28px 0;">
        <p style="margin:0 0 6px;color:#e2d9f3;font-size:18px;font-weight:700;letter-spacing:-0.03em;">
          ${greeting}
        </p>
        <p style="margin:0;color:#8b7ab8;font-size:13px;line-height:1.6;">
          Here's your daily GovSignal brief — federal tech contracts posted today, sorted by deadline.
        </p>
      </td>
    </tr>

    <!-- stats bar -->
    <tr>
      <td style="padding:20px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="background:#100c28;border:1px solid #1e1640;border-radius:12px;">
          <tr>
            <td align="center" style="padding:16px 8px;border-right:1px solid #1e1640;" width="33%">
              <div style="color:#b13bff;font-size:22px;font-weight:800;letter-spacing:-0.04em;font-variant-numeric:tabular-nums;">
                ${parseInt(stats.total_active).toLocaleString()}
              </div>
              <div style="color:#6b5e8a;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:3px;">
                Active Bids
              </div>
            </td>
            <td align="center" style="padding:16px 8px;border-right:1px solid #1e1640;" width="33%">
              <div style="color:#00b67a;font-size:22px;font-weight:800;letter-spacing:-0.04em;font-variant-numeric:tabular-nums;">
                +${parseInt(stats.new_today).toLocaleString()}
              </div>
              <div style="color:#6b5e8a;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:3px;">
                New Today
              </div>
            </td>
            <td align="center" style="padding:16px 8px;" width="33%">
              <div style="color:#f87171;font-size:22px;font-weight:800;letter-spacing:-0.04em;font-variant-numeric:tabular-nums;">
                ${parseInt(stats.closing_this_week).toLocaleString()}
              </div>
              <div style="color:#6b5e8a;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:3px;">
                Closing This Week
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- section label -->
    <tr>
      <td style="padding:0 28px 12px;">
        <div style="color:#6b5e8a;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">
          Today's New Bids
        </div>
      </td>
    </tr>

    <!-- bid list -->
    <tr>
      <td style="padding:0 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${bidRows}
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding:24px 28px 28px;" align="center">
        <a href="${dashUrl}"
           style="display:inline-block;background:linear-gradient(135deg,rgba(177,59,255,.25),rgba(255,45,146,.18));
                  border:1px solid rgba(177,59,255,.45);color:#c77dff;border-radius:10px;
                  padding:13px 32px;font-size:14px;font-weight:700;text-decoration:none;
                  letter-spacing:.02em;">
          View All Bids on Dashboard →
        </a>
      </td>
    </tr>

    <!-- divider -->
    <tr>
      <td style="padding:0 28px;"><div style="height:1px;background:#1e1640;"></div></td>
    </tr>

    <!-- footer -->
    <tr>
      <td style="padding:20px 28px;text-align:center;">
        <p style="margin:0 0 8px;color:#4a3d6a;font-size:11px;line-height:1.6;">
          You're receiving this because you signed up for GovSignal.<br>
          Federal contracts, classified by category, delivered every morning.
        </p>
        <a href="${unsubUrl}" style="color:#4a3d6a;font-size:11px;text-decoration:underline;">
          Unsubscribe
        </a>
      </td>
    </tr>

  </table>
  <!-- /card -->

</td></tr>
</table>
<!-- /wrapper -->

</body>
</html>`;
}

/* ── main send function ───────────────────────────────────── */

async function sendDailyDigest() {
  if (!RESEND_KEY) throw new Error('RESEND_API_KEY not set');

  const [users, bids, stats] = await Promise.all([
    getClerkUsers(),
    getTodaysBids(),
    getStats(),
  ]);

  console.log(`Digest: ${users.length} users, ${bids.length} new bids today`);

  let sent = 0, skipped = 0;

  for (const u of users) {
    try {
      const pref = await getOrCreateToken(u.id);
      if (pref.unsubscribed_at) { skipped++; continue; }

      const html = buildHtml({ bids, stats, name: u.name, unsubToken: pref.token });

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    FROM_EMAIL,
          to:      u.email,
          subject: `GovSignal — ${bids.length} new tech bids today`,
          html,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn(`Resend failed for ${u.email}:`, err.message ?? res.status);
      } else {
        sent++;
      }
    } catch (err) {
      console.warn(`Digest error for ${u.id}:`, err.message);
    }
  }

  console.log(`Digest complete: ${sent} sent, ${skipped} unsubscribed`);
  return { sent, skipped, total: users.length };
}

module.exports = { sendDailyDigest };
