-- ============================================================================
-- Kiwik — complete database structure
--
-- Paste this whole file into a NEW Supabase project's SQL Editor and press Run.
-- It creates every table, constraint, index, RLS setting and dashboard view the
-- site needs, in one pass. Safe to re-run: nothing here drops data.
--
-- This file is STRUCTURE ONLY, deliberately. It is committed to the repository,
-- and the content of these tables includes the admin password hash, contact
-- submissions and subscriber email addresses — none of which belongs in git.
-- To move the DATA as well, generate a separate dump that stays out of version
-- control:
--
--     node scripts/export-supabase.mjs --new-ref=<new-project-ref>
--
-- and run that file after this one. The --new-ref flag rewrites every stored
-- Supabase Storage URL to the new project.
--
-- AND NOTE: neither file carries your images or videos. Those live in Supabase
-- Storage, not Postgres — the database only holds their URLs. Copy the bucket
-- separately or every image 404s while the rows look perfectly fine:
--
--     node scripts/export-storage.mjs download
--     node scripts/export-storage.mjs upload --url=https://NEW.supabase.co --key=<service_role_key>
--
-- Full switchover order:
--   1. run this file on the new project
--   2. run the data dump from export-supabase.mjs --new-ref=…
--   3. upload the storage bucket
--   4. change DATABASE_URL in Vercel, redeploy
-- ============================================================================

BEGIN;

-- ── Site content ────────────────────────────────────────────────────────────
-- The entire editable site is one JSONB document in the row key = 'main'.
CREATE TABLE IF NOT EXISTS site_cms (
  key         VARCHAR(100) PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE site_cms IS
  'The whole site''s editable content as one JSONB document (key = main). Browse it through v_site_content / v_site_content_sections.';

-- ── Projects ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id                 VARCHAR(100) PRIMARY KEY,
  slug               VARCHAR(100) UNIQUE NOT NULL,
  name               VARCHAR(255) NOT NULL,
  tagline            TEXT,
  description        TEXT,
  status             VARCHAR(50) DEFAULT 'beta',
  completion_percent INT DEFAULT 100,
  category           VARCHAR(100) DEFAULT 'System Engine',
  cover_image        TEXT,
  images             JSONB DEFAULT '[]'::jsonb,
  github_url         TEXT,
  live_url           TEXT,
  tech_stack         JSONB DEFAULT '[]'::jsonb,
  data               JSONB,
  sort_order         INT,
  created_at         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── Partner / product entries ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          VARCHAR(100) PRIMARY KEY,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  name        VARCHAR(255),
  data        JSONB,
  sort_order  INT,
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── Newsletter ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email       VARCHAR(254) PRIMARY KEY,
  source      VARCHAR(100) DEFAULT 'footer',
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE newsletter_subscribers IS 'Footer newsletter signups.';

-- ── Contact form ────────────────────────────────────────────────────────────
-- bigint identity, not a v4 UUID: sequential keys keep the index dense.
-- text + CHECK, not varchar(n): the limit becomes a named constraint that
-- rejects bad input from ANY path, including a direct dashboard edit.
CREATE TABLE IF NOT EXISTS contact_submissions (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name                  TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT,
  phone_country_code    TEXT,
  company               TEXT,
  service               TEXT,
  project_requirements  TEXT,
  message               TEXT NOT NULL,
  status                TEXT NOT NULL DEFAULT 'new',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE contact_submissions IS
  'Contact form submissions. Validated in the form, again in /api/contact, and constrained by CHECKs here.';

-- ADD CONSTRAINT has no IF NOT EXISTS form, so each one is guarded.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_name_len' AND conrelid = 'contact_submissions'::regclass) THEN
    ALTER TABLE contact_submissions ADD CONSTRAINT contact_name_len
      CHECK (char_length(btrim(name)) BETWEEN 2 AND 100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_email_shape' AND conrelid = 'contact_submissions'::regclass) THEN
    ALTER TABLE contact_submissions ADD CONSTRAINT contact_email_shape
      CHECK (char_length(email) <= 254
             AND email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[A-Za-z]{2,}$'
             AND email !~ '\.\.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_phone_len' AND conrelid = 'contact_submissions'::regclass) THEN
    ALTER TABLE contact_submissions ADD CONSTRAINT contact_phone_len
      CHECK (phone IS NULL OR char_length(phone) <= 32);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_cc_shape' AND conrelid = 'contact_submissions'::regclass) THEN
    ALTER TABLE contact_submissions ADD CONSTRAINT contact_cc_shape
      CHECK (phone_country_code IS NULL OR phone_country_code ~ '^\+[0-9]{1,4}$');
  END IF;
  -- A number without its country code is ambiguous: require both or neither.
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_phone_pairing' AND conrelid = 'contact_submissions'::regclass) THEN
    ALTER TABLE contact_submissions ADD CONSTRAINT contact_phone_pairing
      CHECK ((phone IS NULL) = (phone_country_code IS NULL));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_company_len' AND conrelid = 'contact_submissions'::regclass) THEN
    ALTER TABLE contact_submissions ADD CONSTRAINT contact_company_len
      CHECK (company IS NULL OR char_length(company) <= 120);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_service_len' AND conrelid = 'contact_submissions'::regclass) THEN
    ALTER TABLE contact_submissions ADD CONSTRAINT contact_service_len
      CHECK (service IS NULL OR char_length(service) <= 80);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_reqs_len' AND conrelid = 'contact_submissions'::regclass) THEN
    ALTER TABLE contact_submissions ADD CONSTRAINT contact_reqs_len
      CHECK (project_requirements IS NULL OR char_length(project_requirements) <= 3000);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_message_len' AND conrelid = 'contact_submissions'::regclass) THEN
    ALTER TABLE contact_submissions ADD CONSTRAINT contact_message_len
      CHECK (char_length(btrim(message)) BETWEEN 10 AND 5000);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_status_enum' AND conrelid = 'contact_submissions'::regclass) THEN
    ALTER TABLE contact_submissions ADD CONSTRAINT contact_status_enum
      CHECK (status IN ('new', 'read', 'replied', 'archived'));
  END IF;
END $$;

-- The inbox lists newest first, so the index matches the sort.
CREATE INDEX IF NOT EXISTS contact_submissions_created_idx
  ON contact_submissions (created_at DESC);

-- ── Studio access control ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_security (
  key         VARCHAR(50) PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE admin_security IS
  'Studio access control: Google allowlist plus a PBKDF2 password hash.';

-- ── Anonymous visitor counters ──────────────────────────────────────────────
-- No IP address and no User-Agent are stored. The User-Agent is read once at
-- request time to derive "mobile or desktop", then discarded; the session id is
-- random and lives in the browser's sessionStorage, so it dies with the tab.
CREATE TABLE IF NOT EXISTS site_visitor_sessions (
  session_id    VARCHAR(100) PRIMARY KEY,
  device_type   VARCHAR(50) DEFAULT 'desktop',
  browser_name  VARCHAR(50) DEFAULT 'Chrome',
  pathname      VARCHAR(255) DEFAULT '/',
  pageviews     INT DEFAULT 1,
  first_seen    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_ping     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE site_visitor_sessions IS
  'Anonymous session counters for the studio dashboard. No personal data; 30-day retention.';

-- ── Row Level Security ──────────────────────────────────────────────────────
-- RLS on with NO policies = deny-all to the public anon/publishable key, which
-- is exactly what is wanted: the app reaches Postgres directly through
-- DATABASE_URL, which is not subject to RLS. Without this, anyone holding the
-- public key could read the admin hash and every contact submission over the
-- REST API.
ALTER TABLE site_cms               ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects               ENABLE ROW LEVEL SECURITY;
ALTER TABLE products               ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_security         ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visitor_sessions  ENABLE ROW LEVEL SECURITY;

-- ── Dashboard views ─────────────────────────────────────────────────────────
-- These store nothing. They present the same rows as readable columns so the
-- Supabase Table Editor is navigable — site_cms is otherwise one unreadable
-- JSON cell. Dropped first because CREATE OR REPLACE VIEW cannot reorder or
-- rename columns.

DROP VIEW IF EXISTS v_site_content;
CREATE VIEW v_site_content AS
SELECT
  data->'hero'->>'headlinePrefix'         AS hero_headline,
  data->'hero'->>'headlineHighlightWord'  AS hero_highlight_word,
  data->'hero'->>'versionBadge'           AS hero_version_badge,
  data->'hero'->>'description'            AS hero_description,
  data->'navigation'->>'ctaButtonText'    AS nav_cta_text,
  data->'settings'->>'siteName'           AS site_name,
  data->'settings'->>'contactEmail'       AS contact_email,
  data->'footer'->>'copyrightText'        AS footer_copyright,
  jsonb_array_length(COALESCE(data->'navigation'->'items', '[]'::jsonb)) AS nav_link_count,
  updated_at                              AS last_edited
FROM site_cms WHERE key = 'main';

DROP VIEW IF EXISTS v_site_content_sections;
CREATE VIEW v_site_content_sections AS
SELECT
  section,
  jsonb_typeof(value) AS kind,
  CASE WHEN jsonb_typeof(value) = 'array' THEN jsonb_array_length(value) END AS item_count,
  pg_size_pretty(length(value::text)::bigint) AS size
FROM site_cms, jsonb_each(data) AS t(section, value)
WHERE key = 'main'
ORDER BY length(value::text) DESC;

DROP VIEW IF EXISTS v_projects;
CREATE VIEW v_projects AS
SELECT slug, name,
       data->>'tagline'                  AS tagline,
       data->>'status'                   AS status,
       data->>'category'                 AS category,
       (data->>'completionPercent')::int AS completion_percent,
       data->>'liveUrl'                  AS live_url,
       sort_order, updated_at
FROM projects ORDER BY sort_order NULLS LAST, created_at;

DROP VIEW IF EXISTS v_partners;
CREATE VIEW v_partners AS
SELECT slug, name,
       data->>'tagline'  AS tagline,
       data->>'category' AS category,
       sort_order, updated_at
FROM products ORDER BY sort_order NULLS LAST, created_at;

DROP VIEW IF EXISTS v_contact_inbox;
CREATE VIEW v_contact_inbox AS
SELECT id, created_at, status, name, email, company,
       COALESCE(phone_country_code, '') || ' ' || COALESCE(phone, '') AS phone,
       service,
       left(COALESCE(project_requirements, ''), 80) AS requirements_preview,
       left(message, 80)                            AS message_preview
FROM contact_submissions ORDER BY created_at DESC;

DROP VIEW IF EXISTS v_admin_access;
CREATE VIEW v_admin_access AS
SELECT e.allowed_email,
       (s.data->>'passwordLoginEnabled')::boolean AS password_login_enabled,
       (s.data ? 'passwordHash')                  AS has_stored_password,
       s.updated_at
FROM admin_security s
LEFT JOIN LATERAL jsonb_array_elements_text(COALESCE(s.data->'allowedEmails', '[]'::jsonb))
  AS e(allowed_email) ON TRUE
WHERE s.key = 'main';

DROP VIEW IF EXISTS v_visitors_live;
CREATE VIEW v_visitors_live AS
SELECT
  count(*) FILTER (WHERE last_ping >= now() - interval '45 seconds') AS online_now,
  count(*)                                    AS sessions_30d,
  COALESCE(sum(pageviews), 0)                 AS pageviews_30d,
  count(*) FILTER (WHERE device_type = 'mobile')  AS mobile_sessions,
  count(*) FILTER (WHERE device_type = 'desktop') AS desktop_sessions,
  max(last_ping)                              AS most_recent_visit
FROM site_visitor_sessions;

COMMIT;

-- ── After running this ──────────────────────────────────────────────────────
-- The app also creates any missing table on boot (src/lib/db.ts runDDL), so a
-- fresh project works even without this file. This exists so the structure is
-- reviewable, version-controlled, and reproducible in one step rather than
-- being an emergent property of application startup.
