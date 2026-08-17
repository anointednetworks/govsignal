-- GovSignal — initial schema

-- ── bids ──────────────────────────────────────────────────────
CREATE TABLE bids (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sam_id           TEXT        UNIQUE NOT NULL,          -- SAM.gov notice ID
  title            TEXT        NOT NULL,
  notice_type      TEXT,                                 -- Solicitation, Sources Sought, Presolicitation, etc.
  agency           TEXT,
  sub_agency       TEXT,
  office           TEXT,
  state_code       TEXT,                                 -- 2-letter state (from place of performance)
  naics_code       TEXT,
  naics_description TEXT,
  set_aside        TEXT,                                 -- 8(a), WOSB, HUBZone, etc.
  posted_date      DATE,
  response_deadline TIMESTAMPTZ,
  description      TEXT,
  sam_url          TEXT,                                 -- full URL on sam.gov
  category         TEXT,                                 -- our classification: Cloud, CyberSec, Software, etc.
  status           TEXT        NOT NULL DEFAULT 'active',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX bids_posted_date_idx   ON bids (posted_date DESC);
CREATE INDEX bids_state_idx         ON bids (state_code);
CREATE INDEX bids_category_idx      ON bids (category);
CREATE INDEX bids_status_idx        ON bids (status);
CREATE INDEX bids_response_dl_idx   ON bids (response_deadline);
CREATE INDEX bids_naics_idx         ON bids (naics_code);

-- ── user_profiles (for Radar AI matching) ────────────────────
CREATE TABLE user_profiles (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id   TEXT        UNIQUE NOT NULL,
  company_name    TEXT,
  website_url     TEXT,
  capabilities    JSONB,      -- extracted from website scrape
  keywords        TEXT[],     -- procurement-relevant keywords
  naics_codes     TEXT[],     -- NAICS codes matched to this company
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── saved_bids ────────────────────────────────────────────────
CREATE TABLE saved_bids (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT        NOT NULL,
  bid_id        UUID        NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  status        TEXT        NOT NULL DEFAULT 'watching', -- watching | pursuing | submitted | won
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (clerk_user_id, bid_id)
);

CREATE INDEX saved_bids_user_idx ON saved_bids (clerk_user_id);

-- ── fetch_log (track SAM.gov sync runs) ──────────────────────
CREATE TABLE fetch_log (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  bids_fetched INT         NOT NULL DEFAULT 0,
  bids_upserted INT        NOT NULL DEFAULT 0,
  error        TEXT,
  duration_ms  INT
);

-- ── updated_at trigger ────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bids_updated_at         BEFORE UPDATE ON bids         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER saved_bids_updated_at   BEFORE UPDATE ON saved_bids   FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE bids          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_bids    ENABLE ROW LEVEL SECURITY;
ALTER TABLE fetch_log     ENABLE ROW LEVEL SECURITY;

-- bids: public read (anon can browse), write only via service role
CREATE POLICY "bids_public_read"  ON bids FOR SELECT USING (true);

-- user_profiles: each user sees only their own
CREATE POLICY "profiles_own_read"   ON user_profiles FOR SELECT USING (clerk_user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "profiles_own_insert" ON user_profiles FOR INSERT WITH CHECK (clerk_user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "profiles_own_update" ON user_profiles FOR UPDATE USING (clerk_user_id = current_setting('app.clerk_user_id', true));

-- saved_bids: each user sees only their own
CREATE POLICY "saved_own_read"   ON saved_bids FOR SELECT USING (clerk_user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "saved_own_insert" ON saved_bids FOR INSERT WITH CHECK (clerk_user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "saved_own_update" ON saved_bids FOR UPDATE USING (clerk_user_id = current_setting('app.clerk_user_id', true));
CREATE POLICY "saved_own_delete" ON saved_bids FOR DELETE USING (clerk_user_id = current_setting('app.clerk_user_id', true));

-- fetch_log: service role only (no user policies needed)
