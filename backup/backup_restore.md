# Varundamine ja taastamine

## 1. Varukoopia loomine (pg_dump)

Käsk varukoopia loomiseks Docker-konteineris:

```bash
docker exec classroom_db pg_dump -U admin classroom_booking > backup/backup_2026-02-11.sql
```

Alternatiiv (kui PostgreSQL on otse installitud):
```bash
pg_dump -U admin -h localhost -p 5435 classroom_booking > backup/backup_2026-02-11.sql
```

## 2. Taastamine

### 2.1 Enne taastamist — kontrollpäring

```
=== ENNE KUSTUTAMIST ===
 bookings_enne
---------------
            12
(1 row)
```

### 2.2 Tabeli kustutamine (kontrollitud test)

```
=== KUSTUTAMINE ===
DROP TABLE

=== KONTROLL (tabel puudub) ===
ERROR:  relation "booking" does not exist
LINE 1: SELECT * FROM booking;
```

### 2.3 Taastamine backupist

```bash
docker exec -i classroom_db psql -U admin classroom_booking < backup/backup_2026-02-11.sql
```

### 2.4 Pärast taastamist — kontrollimine

```
=== PÄRAST TAASTAMIST ===
 bookings_parast
-----------------
              12
(1 row)
```

## 3. Tõendus

Taastamine on tõendatud ülaltoodud väljundiga:
- **Enne:** `SELECT COUNT(*) FROM booking` → **12 rida**
- **Kustutamine:** `DROP TABLE booking CASCADE` → tabel kustutatud, `SELECT` annab vea
- **Taastamine:** `psql < backup_2026-02-11.sql` → skeemi ja andmete laadimine
- **Pärast:** `SELECT COUNT(*) FROM booking` → **12 rida** (sama arv, andmed taastatud!)
