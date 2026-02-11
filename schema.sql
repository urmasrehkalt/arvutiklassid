-- ============================================================
-- Arvutiklasside kasutuse andmebaas
-- Genereeritud: 2026-02-11
-- PostgreSQL 16
-- ============================================================

-- Kustuta olemasolevad tabelid (õiges järjekorras)
DROP TABLE IF EXISTS booking CASCADE;

DROP TABLE IF EXISTS lesson_type CASCADE;

DROP TABLE IF EXISTS user_or_group CASCADE;

DROP TABLE IF EXISTS classroom CASCADE;

-- ============================================================
-- 1. KLASSIRUUMID
-- ============================================================
CREATE TABLE classroom (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    building VARCHAR(100) NOT NULL,
    floor INTEGER NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    has_projector BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================================
-- 2. TUNNITÜÜBID (lookup-tabel)
-- ============================================================
CREATE TABLE lesson_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- ============================================================
-- 3. KASUTAJAD / GRUPID
-- ============================================================
CREATE TABLE user_or_group (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'group'))
);

-- ============================================================
-- 4. BRONEERINGUD
-- Ärireegel 1: end_time > start_time
-- Ärireegel 2: participants >= 0
-- ============================================================
CREATE TABLE booking (
    id              SERIAL PRIMARY KEY,
    classroom_id    INTEGER NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    user_id         INTEGER NOT NULL REFERENCES user_or_group(id) ON DELETE CASCADE,
    lesson_type_id  INTEGER REFERENCES lesson_type(id) ON DELETE SET NULL,
    booking_date    DATE    NOT NULL,
    start_time      TIME    NOT NULL,
    end_time        TIME    NOT NULL,
    participants    INTEGER NOT NULL DEFAULT 0 CHECK (participants >= 0),
    description     VARCHAR(255),

-- Ärireegel 1: broneeringu lõpp peab olema hiljem kui algus
CONSTRAINT chk_time_range CHECK (end_time > start_time) );

-- Indeksid kiiremateks päringuteks
CREATE INDEX idx_booking_date ON booking (booking_date);

CREATE INDEX idx_booking_classroom ON booking (classroom_id);

CREATE INDEX idx_booking_user ON booking (user_id);