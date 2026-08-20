const express = require('express');
const cors    = require('cors');
const cron    = require('node-cron');
const pool    = require('./db');
const { fetchSamBids } = require('./fetch-sam');
const { requireAuth } = require('./auth');

const app  = express();
const PORT = process.env.PORT || 3001;

async function runSchema() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bids (
        id          SERIAL PRIMARY KEY,
        sam_id      TEXT UNIQUE NOT NULL,
        title       TEXT NOT NULL,
        notice_type TEXT,
        agency      TEXT,
        sub_agency  TEXT,
        office      TEXT,
        state_code  TEXT,
        naics_code  TEXT,
        set_aside   TEXT,
        posted_date DATE,
        response_deadline TIMESTAMPTZ,
        description TEXT,
        sam_url     TEXT,
        category    TEXT,
        status      TEXT NOT NULL DEFAULT 'active',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS fetch_log (
        id           SERIAL PRIMARY KEY,
        started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        finished_at  TIMESTAMPTZ,
        bids_upserted INT,
        bids_expired  INT,
        error_message TEXT,
        duration_ms  INT
      )
    `);
    await client.query('CREATE INDEX IF NOT EXISTS bids_status_idx     ON bids (status)');
    await client.query('CREATE INDEX IF NOT EXISTS bids_category_idx   ON bids (category)');
    await client.query('CREATE INDEX IF NOT EXISTS bids_state_code_idx ON bids (state_code)');
    await client.query('CREATE INDEX IF NOT EXISTS bids_response_dl_idx ON bids (response_deadline)');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
      $$ LANGUAGE plpgsql
    `);
    await client.query('DROP TRIGGER IF EXISTS bids_updated_at ON bids');
    await client.query(`
      CREATE TRIGGER bids_updated_at
        BEFORE UPDATE ON bids
        FOR EACH ROW EXECUTE FUNCTION update_updated_at()
    `);
    await client.query('COMMIT');
    console.log('Schema ready');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

const ALLOWED_ORIGINS = [
  'https://govsignal.pages.dev',
  'https://app.govsignal.com',
  'http://localhost:5173',
  'http://localhost:5175',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('CORS blocked'));
  },
}));
app.use(express.json());

/* ── Health ──────────────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ ok: true }));

/* ── GET /bids ───────────────────────────────────────────── */
app.get('/bids', requireAuth, async (req, res) => {
  try {
    const {
      category, state, status = 'active',
      limit = '50', offset = '0', search,
    } = req.query;

    const conditions = ['b.status = $1'];
    const values     = [status];
    let   idx        = 2;

    if (category) { conditions.push(`b.category = $${idx++}`); values.push(category); }
    if (state)    { conditions.push(`b.state_code = $${idx++}`); values.push(state); }
    if (search)   {
      conditions.push(`(b.title ILIKE $${idx} OR b.agency ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.join(' AND ');
    const lim   = Math.min(parseInt(limit) || 50, 200);
    const off   = parseInt(offset) || 0;

    const [rows, countRow] = await Promise.all([
      pool.query(
        `SELECT id, sam_id, title, agency, state_code, category,
                response_deadline, set_aside, notice_type, sam_url, posted_date
         FROM bids b
         WHERE ${where}
         ORDER BY response_deadline ASC NULLS LAST
         LIMIT ${lim} OFFSET ${off}`,
        values
      ),
      pool.query(`SELECT COUNT(*) FROM bids b WHERE ${where}`, values),
    ]);

    res.json({
      bids:  rows.rows,
      total: parseInt(countRow.rows[0].count),
      limit: lim,
      offset: off,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

/* ── GET /bids/:id ───────────────────────────────────────── */
app.get('/bids/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bids WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

/* ── POST /admin/fetch ───────────────────────────────────── */
app.post('/admin/fetch', async (req, res) => {
  const secret = req.headers['x-admin-secret'];
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const result = await fetchSamBids();
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /stats ──────────────────────────────────────────── */
app.get('/stats', requireAuth, async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'active')                                          AS total_active,
        COUNT(*) FILTER (WHERE status = 'active'
          AND response_deadline >= NOW()
          AND response_deadline <= NOW() + INTERVAL '7 days')                              AS closing_this_week,
        COUNT(*) FILTER (WHERE status = 'active'
          AND posted_date >= CURRENT_DATE)                                                  AS new_today
      FROM bids
    `);
    const r = rows[0];
    res.json({
      total_active:       parseInt(r.total_active),
      closing_this_week:  parseInt(r.closing_this_week),
      new_today:          parseInt(r.new_today),
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

/* ── GET /categories ─────────────────────────────────────── */
app.get('/categories', requireAuth, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT category, COUNT(*) as count
       FROM bids WHERE status = 'active' AND category IS NOT NULL
       GROUP BY category ORDER BY count DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

/* ── Cron: daily fetch at 5 AM UTC ──────────────────────── */
cron.schedule('0 5 * * *', async () => {
  console.log('Cron: starting daily SAM.gov fetch');
  try {
    await fetchSamBids();
  } catch (err) {
    console.error('Cron fetch failed:', err.message);
  }
});

runSchema()
  .then(() => app.listen(PORT, () => console.log(`GovSignal API running on port ${PORT}`)))
  .catch(err => { console.error('Schema failed:', err.message); process.exit(1); });
