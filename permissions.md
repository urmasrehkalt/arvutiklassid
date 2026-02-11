# Õiguste haldus — Testimise kirjeldus

## Rollid

| Roll | Kasutajanimi | Parool | Õigused |
|------|-------------|--------|---------|
| `admin_role` | admin_role | admin_pass | Kõik (SELECT, INSERT, UPDATE, DELETE) kõikidele tabelitele |
| `viewer_role` | viewer_role | viewer_pass | Ainult SELECT tabelitele `classroom`, `lesson_type`, `booking` ja vaatele `public_users` |

## Testimine

1. **Rollide loomine:** käivita `psql -U admin -d classroom_booking -f permissions.sql`
2. **Admin-i test:** logi sisse `psql -U admin_role -d classroom_booking` ja proovi `INSERT INTO classroom ...` → edukalt lisatud
3. **Viewer-i test:** logi sisse `psql -U viewer_role -d classroom_booking` ja proovi:
   - `SELECT * FROM classroom;` → töötab ✅
   - `SELECT * FROM user_or_group;` → **ERROR: permission denied** ✅ (REVOKE toimib)
   - `SELECT * FROM public_users;` → töötab ✅ (vaade ilma e-posti aadressita)
   - `INSERT INTO classroom ...` → **ERROR: permission denied** ✅

## REVOKE selgitus

`REVOKE SELECT ON user_or_group FROM viewer_role` eemaldab viewer-ilt otseligipääsu kasutajatabelile, sest see sisaldab e-posti aadresse (privaatsusrisk). Selle asemel sai viewer ligipääsu vaatele `public_users`, mis näitab ainult `id`, `name` ja `role` väljasid.
