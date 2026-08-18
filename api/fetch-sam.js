const pool = require('./db');

const SAM_BASE = 'https://api.sam.gov/prod/opportunities/v2/search';

const NAICS_CODES = [
  '541511', // Custom Computer Programming Services
  '541512', // Computer Systems Design Services
  '541513', // Computer Facilities Management Services
  '541519', // Other Computer Related Services
  '541715', // R&D in Physical, Engineering, and Life Sciences (defense/software R&D)
  '518210', // Computing Infrastructure Providers / Data Processing & Hosting
  '519130', // Internet Publishing and Broadcasting
  '519190', // All Other Information Services (GIS, database services, digital records)
  '611420', // Computer Training
  '334111', // Electronic Computer Manufacturing
  '517919', // Other Telecommunications
  '517312', // Wireless Telecommunications Carriers (network infrastructure)
];

const CATEGORY_MAP = [
  [/cybersecurity|cyber security|security operations|soc |siem|zero trust/i, 'Cybersecurity'],
  [/cloud|aws|azure|gcp|saas|paas|iaas|kubernetes|docker/i, 'Cloud Services'],
  [/artificial intelligence|machine learning|ai\/ml|nlp|computer vision|llm/i, 'AI & ML'],
  [/network|wan|lan|fiber|bandwidth|routing|switching|firewall/i, 'Networking'],
  [/data analytics|business intelligence|data warehouse|tableau|powerbi/i, 'Data Analytics'],
  [/helpdesk|help desk|service desk|desktop support|end.?user support/i, 'IT Support'],
  [/software development|application development|web development|mobile app/i, 'Software Dev'],
  [/managed (it )?services|msp|outsourced it/i, 'Managed Services'],
  [/telecom|voice|voip|unified communications|video conferencing/i, 'Telecom'],
  [/health.*it|ehr|emr|electronic health|medical record|clinical system/i, 'HealthIT'],
  [/digital transformation|modernization|legacy system/i, 'Digital Transform'],
  [/training|e-learning|lms|learning management/i, 'EdTech'],
];

function nullIfEmpty(v) {
  return (v === '' || v == null) ? null : v;
}

function classifyBid(title = '', desc = '') {
  const text = `${title} ${desc}`.toLowerCase();
  for (const [pattern, cat] of CATEGORY_MAP) {
    if (pattern.test(text)) return cat;
  }
  return 'IT Services';
}

function toDateParam(d) {
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
}

async function fetchSamBids() {
  const apiKey = process.env.SAM_API_KEY;
  if (!apiKey) throw new Error('SAM_API_KEY not set');

  const logStart = Date.now();
  const logRow = await pool.query(
    'INSERT INTO fetch_log (started_at) VALUES (NOW()) RETURNING id'
  );
  const logId = logRow.rows[0].id;

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const postedFrom = toDateParam(thirtyDaysAgo);
  const postedTo   = toDateParam(today);

  let totalUpserted = 0;
  let errorMessage = null;

  try {
    for (const naics of NAICS_CODES) {
      let offset = 0;
      let fetched = 0;

      while (true) {
        const params = new URLSearchParams({
          api_key:    apiKey,
          limit:      '1000',
          offset:     String(offset),
          postedFrom,
          postedTo,
          ncode:      naics,
          status:     'active',
        });

        const res = await fetch(`${SAM_BASE}?${params}`);
        if (!res.ok) {
          console.error(`SAM API error ${res.status} for NAICS ${naics}`);
          break;
        }

        const data = await res.json();
        const opps = data.opportunitiesData ?? [];
        if (!opps.length) break;

        for (const opp of opps) {
          const category = classifyBid(opp.title, opp.description);
          const stateCode = opp.placeOfPerformance?.state?.code ?? null;

          try { await pool.query(
            `INSERT INTO bids
              (sam_id, title, notice_type, agency, sub_agency, office,
               state_code, naics_code, set_aside, posted_date,
               response_deadline, description, sam_url, category, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'active')
             ON CONFLICT (sam_id) DO UPDATE SET
               title             = EXCLUDED.title,
               response_deadline = EXCLUDED.response_deadline,
               status            = 'active',
               updated_at        = NOW()`,
            [
              opp.noticeId,
              opp.title,
              nullIfEmpty(opp.type),
              nullIfEmpty(opp.organizationHierarchy?.[0]?.name ?? opp.fullParentPathName?.split('.')[0]),
              nullIfEmpty(opp.organizationHierarchy?.[1]?.name),
              nullIfEmpty(opp.organizationHierarchy?.[2]?.name),
              nullIfEmpty(stateCode),
              naics,
              nullIfEmpty(opp.typeOfSetAside),
              nullIfEmpty(opp.postedDate),
              nullIfEmpty(opp.responseDeadLine),
              nullIfEmpty(opp.description),
              opp.uiLink ?? `https://sam.gov/opp/${opp.noticeId}/view`,
              category,
            ]
          );
          totalUpserted++;
          } catch (rowErr) { console.warn(`Skip ${opp.noticeId}: ${rowErr.message}`); }
        }

        fetched += opps.length;
        if (fetched >= (data.totalRecords ?? 0) || opps.length < 1000) break;
        offset += 1000;
      }
    }

    // Mark bids with past deadlines as expired
    const expireResult = await pool.query(
      `UPDATE bids SET status = 'expired'
       WHERE status = 'active' AND response_deadline < NOW()`
    );

    await pool.query(
      `UPDATE fetch_log SET
         finished_at   = NOW(),
         bids_upserted = $1,
         bids_expired  = $2,
         duration_ms   = $3
       WHERE id = $4`,
      [totalUpserted, expireResult.rowCount, Date.now() - logStart, logId]
    );

    console.log(`Fetch complete: ${totalUpserted} upserted, ${expireResult.rowCount} expired`);
  } catch (err) {
    errorMessage = err.message;
    await pool.query(
      `UPDATE fetch_log SET error_message = $1, duration_ms = $2 WHERE id = $3`,
      [errorMessage, Date.now() - logStart, logId]
    );
    throw err;
  }

  return { upserted: totalUpserted };
}

module.exports = { fetchSamBids };
