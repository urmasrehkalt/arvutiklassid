# Varundamine ja taastamine

## 1. Varukoopia loomine (pg_dump)

Käsk varukoopia loomiseks Docker-konteineris:

```bash
docker exec classroom_db pg_dump -U admin classroom_booking > backup/backup_2026-02-11.sql
```

Alternatiiv (kui PostgreSQL on otse installitud):
```bash
pg_dump -U admin -h localhost -p 5432 classroom_booking > backup/backup_2026-02-11.sql
```

## 2. Taastamine

### 2.1 Enne taastamist — kontrollpäring

```sql
SELECT COUNT(*) AS bookings_count FROM booking;
-- Tulemus: 8 (või vastav arv)
```

### 2.2 Tabeli kustutamine (kontrollitud test)

```sql
DROP TABLE booking CASCADE;
-- Kontroll: SELECT * FROM booking; → ERROR: relation "booking" does not exist
```

### 2.3 Taastamine backupist

```bash
docker exec -i classroom_db psql -U admin classroom_booking < backup/backup_2026-02-11.sql
```

### 2.4 Pärast taastamist — kontrollimine

```sql
SELECT COUNT(*) AS bookings_count FROM booking;
-- Tulemus: 8 (sama arv mis enne — andmed taastatud!)
```

## 3. Tõendus

Taastamise edukus tõendatakse:
- **Enne:** `SELECT COUNT(*) FROM booking` → tulemuse salvestamine
- **Kustutamine:** `DROP TABLE booking CASCADE` → veendumine, et tabel puudub
- **Taastamine:** `psql < backup.sql` → skeemi ja andmete laadimine
- **Pärast:** `SELECT COUNT(*) FROM booking` → sama tulemus kui enne

Kogu protsess on reprodutseeritav ülaltoodud käskudega.
