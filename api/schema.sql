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
);

CREATE TABLE IF NOT EXISTS fetch_log (
  id           SERIAL PRIMARY KEY,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at  TIMESTAMPTZ,
  bids_upserted INT,
  bids_expired  INT,
  error_message TEXT,
  duration_ms  INT
);

CREATE INDEX IF NOT EXISTS bids_status_idx        ON bids (status);
CREATE INDEX IF NOT EXISTS bids_category_idx      ON bids (category);
CREATE INDEX IF NOT EXISTS bids_state_code_idx    ON bids (state_code);
CREATE INDEX IF NOT EXISTS bids_response_dl_idx   ON bids (response_deadline);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bids_updated_at ON bids;
CREATE TRIGGER bids_updated_at
  BEFORE UPDATE ON bids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
