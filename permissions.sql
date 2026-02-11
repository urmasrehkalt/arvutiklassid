-- ============================================================
-- Õiguste haldus: rollid ja kasutajad
-- PostgreSQL
-- ============================================================

-- 1. Rollide loomine
-- ============================================================

-- Admin roll — täisõigused andmebaasile
CREATE ROLE admin_role WITH LOGIN PASSWORD 'admin_pass';

-- Viewer roll — ainult SELECT-õigus
CREATE ROLE viewer_role WITH LOGIN PASSWORD 'viewer_pass';

-- 2. GRANT — õiguste andmine
-- ============================================================

-- Admin saab kõik õigused kõikidele tabelitele
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_role;

-- Viewer saab ainult SELECT-õiguse
GRANT SELECT ON classroom TO viewer_role;

GRANT SELECT ON lesson_type TO viewer_role;

GRANT SELECT ON user_or_group TO viewer_role;

GRANT SELECT ON booking TO viewer_role;

-- 3. REVOKE — õiguste eemaldamine (näide)
-- ============================================================

-- Eemaldame viewer-ilt ligipääsu user_or_group tabelile
-- (nt privaatsusreegli tõttu — e-posti aadressid on tundlikud)
REVOKE SELECT ON user_or_group FROM viewer_role;

-- Alternatiiv: loome vaate, kus email on peidetud,
-- ja anname viewer-ile ligipääsu ainult vaatele
CREATE OR REPLACE VIEW public_users AS
SELECT id, name, role
FROM user_or_group;

GRANT SELECT ON public_users TO viewer_role;