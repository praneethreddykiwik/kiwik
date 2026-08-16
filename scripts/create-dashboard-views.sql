-- ============================================================================
-- Readable views for the Supabase Table Editor.
--
-- The site's content is stored as one JSONB document in site_cms.data, which is
-- efficient to read and write but impossible to browse: the dashboard shows a
-- single row with a single unreadable cell, so "where is my hero title?" has no
-- visible answer.
--
-- These views do not move or duplicate any data. They are saved queries that
-- present the same JSON as ordinary columns, so the Table Editor becomes
-- navigable. Editing the underlying tables still works exactly as before, and
-- nothing here can be out of sync, because a view has no storage of its own.
--
-- Safe to re-run. Each view is dropped first, because CREATE OR REPLACE VIEW
-- can only append columns — it cannot reorder or rename them. Views store no
-- data of their own, so dropping one costs nothing.
-- ============================================================================

-- ── The bits of the site you actually edit ──────────────────────────────────
DROP VIEW IF EXISTS v_site_content;
CREATE VIEW v_site_content AS
SELECT
  data->'hero'->>'headlinePrefix'         AS hero_headline,
  data->'hero'->>'headlineHighlightWord'  AS hero_highlight_word,
  data->'hero'->>'versionBadge'           AS hero_version_badge,
  data->'hero'->>'description'            AS hero_description,
  data->'navigation'->>'ctaButtonText'    AS nav_cta_text,
  data->'navigation'->>'ctaButtonHref'    AS nav_cta_link,
  data->'settings'->>'siteName'           AS site_name,
  data->'settings'->>'contactEmail'       AS contact_email,
  data->'footer'->>'newsletterHeadline'   AS newsletter_headline,
  data->'footer'->>'copyrightText'        AS footer_copyright,
  jsonb_array_length(COALESCE(data->'navigation'->'items', '[]'::jsonb))   AS nav_link_count,
  jsonb_array_length(COALESCE(data->'whyKiwikPills', '[]'::jsonb))         AS feature_pill_count,
  jsonb_array_length(COALESCE(data->'architectureNodes', '[]'::jsonb))     AS architecture_node_count,
  updated_at                              AS last_edited
FROM site_cms
WHERE key = 'main';

COMMENT ON VIEW v_site_content IS
  'Human-readable slice of site_cms.data. Edit these through the Kiwik admin studio, not here.';

-- ── Every top-level section, one row each ───────────────────────────────────
-- Answers "what is actually in that blob, and how big is each part?".
DROP VIEW IF EXISTS v_site_content_sections;
CREATE VIEW v_site_content_sections AS
SELECT
  section,
  jsonb_typeof(value)                                                AS kind,
  CASE WHEN jsonb_typeof(value) = 'array'
       THEN jsonb_array_length(value) END                            AS item_count,
  pg_size_pretty(length(value::text)::bigint)                        AS size,
  left(regexp_replace(value::text, '\s+', ' ', 'g'), 120)            AS preview
FROM site_cms, jsonb_each(data) AS t(section, value)
WHERE key = 'main'
ORDER BY length(value::text) DESC;

COMMENT ON VIEW v_site_content_sections IS
  'One row per top-level key inside site_cms.data, largest first.';

-- ── Projects, without opening the JSON ──────────────────────────────────────
DROP VIEW IF EXISTS v_projects;
CREATE VIEW v_projects AS
SELECT
  slug,
  name,
  data->>'tagline'                        AS tagline,
  data->>'status'                         AS status,
  data->>'category'                       AS category,
  (data->>'completionPercent')::int       AS completion_percent,
  data->>'liveUrl'                        AS live_url,
  data->>'githubUrl'                      AS github_url,
  jsonb_array_length(COALESCE(data->'techStack', '[]'::jsonb))  AS tech_count,
  jsonb_array_length(COALESCE(data->'images', '[]'::jsonb))     AS image_count,
  sort_order,
  updated_at
FROM projects
ORDER BY sort_order NULLS LAST, created_at;

COMMENT ON VIEW v_projects IS 'Readable project catalogue. Source of truth for /projects.';

-- ── Partner / product entries ───────────────────────────────────────────────
DROP VIEW IF EXISTS v_partners;
CREATE VIEW v_partners AS
SELECT
  slug,
  name,
  data->>'tagline'                        AS tagline,
  data->>'category'                       AS category,
  jsonb_array_length(COALESCE(data->'gallery', '[]'::jsonb))  AS gallery_count,
  jsonb_array_length(COALESCE(data->'videos', '[]'::jsonb))   AS video_count,
  sort_order,
  updated_at
FROM products
ORDER BY sort_order NULLS LAST, created_at;

COMMENT ON VIEW v_partners IS 'Readable partner catalogue. Source of truth for /partners.';

-- ── Who can sign in to the studio ───────────────────────────────────────────
-- LEFT JOIN LATERAL so the row still appears when the stored list is empty,
-- which is the normal state: the live allowlist comes from ADMIN_ALLOWED_EMAILS
-- in Vercel, and the database list is only what has been added in the studio.
DROP VIEW IF EXISTS v_admin_access;
CREATE VIEW v_admin_access AS
SELECT
  e.allowed_email,
  (s.data->>'passwordLoginEnabled')::boolean AS password_login_enabled,
  (s.data ? 'passwordHash')                  AS has_stored_password,
  s.updated_at
FROM admin_security s
LEFT JOIN LATERAL jsonb_array_elements_text(
  COALESCE(s.data->'allowedEmails', '[]'::jsonb)
) AS e(allowed_email) ON TRUE
WHERE s.key = 'main';

COMMENT ON VIEW v_admin_access IS
  'Google accounts permitted into the studio. The password hash itself is never exposed.';

-- ── Live traffic, from anonymous session rows ───────────────────────────────
DROP VIEW IF EXISTS v_visitors_live;
CREATE VIEW v_visitors_live AS
SELECT
  count(*) FILTER (WHERE last_ping >= now() - interval '45 seconds') AS online_now,
  count(*)                                                          AS sessions_30d,
  COALESCE(sum(pageviews), 0)                                       AS pageviews_30d,
  count(*) FILTER (WHERE device_type = 'mobile')                    AS mobile_sessions,
  count(*) FILTER (WHERE device_type = 'desktop')                   AS desktop_sessions,
  max(last_ping)                                                    AS most_recent_visit
FROM site_visitor_sessions;

COMMENT ON VIEW v_visitors_live IS
  'Anonymous traffic counters. No IP address or User-Agent is stored; rows older than 30 days are purged.';

COMMENT ON TABLE site_cms IS
  'The whole site''s editable content as one JSONB document (key = main). Browse it through v_site_content / v_site_content_sections.';
COMMENT ON TABLE site_visitor_sessions IS
  'Anonymous session counters for the studio dashboard. No personal data; 30-day retention.';
COMMENT ON TABLE newsletter_subscribers IS
  'Footer newsletter signups.';
COMMENT ON TABLE admin_security IS
  'Studio access control: Google allowlist plus a PBKDF2 password hash.';
