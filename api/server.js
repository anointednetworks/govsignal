const express = require('express');
const cors    = require('cors');
const cron    = require('node-cron');
const pool    = require('./db');
const { fetchSamBids } = require('./fetch-sam');

const app  = express();
const PORT = process.env.PORT || 3001;

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
app.get('/bids', async (req, res) => {
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
app.get('/bids/:id', async (req, res) => {
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

/* ── GET /categories ─────────────────────────────────────── */
app.get('/categories', async (_req, res) => {
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

app.listen(PORT, () => console.log(`GovSignal API running on port ${PORT}`));
