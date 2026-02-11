# Loogiline disain

## Tabelite valik

Andmebaas koosneb neljast tabelist: **classroom** (arvutiklassid), **user_or_group** (õpetajad ja grupid), **lesson_type** (tunnitüüpide lookup-tabel) ja **booking** (broneeringud). Selline ülesehitus eraldab iga olemi selgelt ja võimaldab paindlikku laiendamist.

## N:M seose lahendus

Praeguses mudelis on `booking` tabel sisuliselt vahetabel, mis seob `classroom` ja `user_or_group` tabelid omavahel (mitu kasutajat saavad broneerida mitmeid klasse erinevatel aegadel). Vahetabel sisaldab ka broneeringu-spetsiifilisi atribuute nagu kuupäev, kellaaeg ja osalejate arv. Kui tulevikus vajame mitut kasutajat ühe broneeringu kohta, lisame `booking_participant` vahetabeli.

## Ärireegid

1. **`CHECK (end_time > start_time)`** — rakendatud `booking` tabelis otse andmebaasi tasemel (`CONSTRAINT chk_time_range`). See tagab, et broneeringu lõppaeg on alati hilisem kui algusaeg.
2. **`CHECK (participants >= 0)`** — samuti `booking` tabelis CHECK piiranguna. Osalejate arv ei saa olla negatiivne.
3. **`CHECK (capacity > 0)`** — `classroom` tabelis, ruumi mahutavus peab olema positiivne.
