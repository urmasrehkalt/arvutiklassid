/**
 * Impordiskript: CSV, JSON ja XML → PostgreSQL
 *
 * Käivita: bun run import/import.ts
 */
import { readFileSync } from "fs";
import { join } from "path";
import postgres from "postgres";

const sql = postgres({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5435,
    database: process.env.DB_NAME || "classroom_booking",
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASS || "admin123",
});

const dir = import.meta.dir;

// ──────────────────────────────────────────────
// 1. CSV import — classes.csv → classroom tabel
// ──────────────────────────────────────────────
async function importCSV() {
    console.log("📥 Importimine: classes.csv → classroom");
    const raw = readFileSync(join(dir, "classes.csv"), "utf-8");
    const lines = raw.trim().split("\n").slice(1); // skip header

    for (const line of lines) {
        const [name, building, floor, capacity, has_projector] = line.split(",");
        await sql`
      INSERT INTO classroom (name, building, floor, capacity, has_projector)
      VALUES (${name.trim()}, ${building.trim()}, ${parseInt(floor)}, ${parseInt(capacity)}, ${has_projector.trim() === "true"})
      ON CONFLICT (name) DO UPDATE SET
        building = EXCLUDED.building,
        floor = EXCLUDED.floor,
        capacity = EXCLUDED.capacity,
        has_projector = EXCLUDED.has_projector
    `;
    }
    console.log(`   ✅ ${lines.length} klassiruumi imporditud`);
}

// ──────────────────────────────────────────────
// 2. JSON import — teachers.json → user_or_group
// ──────────────────────────────────────────────
async function importJSON() {
    console.log("📥 Importimine: teachers.json → user_or_group");
    const raw = readFileSync(join(dir, "teachers.json"), "utf-8");
    const users: Array<{ name: string; email: string | null; role: string }> = JSON.parse(raw);

    for (const u of users) {
        await sql`
      INSERT INTO user_or_group (name, email, role)
      VALUES (${u.name}, ${u.email}, ${u.role})
      ON CONFLICT DO NOTHING
    `;
    }
    console.log(`   ✅ ${users.length} kasutajat/gruppi imporditud`);
}

// ──────────────────────────────────────────────
// 3. XML import — bookings.xml → booking
//    (seostab FK-d classroomi ja user_or_group nimede järgi)
// ──────────────────────────────────────────────
async function importXML() {
    console.log("📥 Importimine: bookings.xml → booking");
    const raw = readFileSync(join(dir, "bookings.xml"), "utf-8");

    // Lihtne XML parser ilma väliseid sõltuvusi kasutamata
    const bookingBlocks = raw.match(/<booking>([\s\S]*?)<\/booking>/g) || [];

    // Esmalt tagame, et tunnitüübid on olemas
    await sql`
    INSERT INTO lesson_type (name) VALUES
      ('Loeng'), ('Praktikum'), ('Seminar'), ('Eksam'), ('Konsultatsioon')
    ON CONFLICT (name) DO NOTHING
  `;

    let count = 0;
    for (const block of bookingBlocks) {
        const get = (tag: string) => {
            const m = block.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
            return m ? m[1].trim() : "";
        };

        const classroomName = get("classroom");
        const userName = get("user");
        const lessonTypeName = get("lesson_type");
        const date = get("date");
        const startTime = get("start_time");
        const endTime = get("end_time");
        const participants = parseInt(get("participants")) || 0;
        const description = get("description");

        // Otsi FK-d nimede järgi
        const [classroom] = await sql`SELECT id FROM classroom WHERE name = ${classroomName}`;
        const [user] = await sql`SELECT id FROM user_or_group WHERE name = ${userName}`;
        const [lessonType] = await sql`SELECT id FROM lesson_type WHERE name = ${lessonTypeName}`;

        if (!classroom || !user) {
            console.warn(`   ⚠️ Vahele jäetud: klass="${classroomName}", kasutaja="${userName}" — ei leitud`);
            continue;
        }

        await sql`
      INSERT INTO booking (classroom_id, user_id, lesson_type_id, booking_date, start_time, end_time, participants, description)
      VALUES (${classroom.id}, ${user.id}, ${lessonType?.id || null}, ${date}, ${startTime}, ${endTime}, ${participants}, ${description || null})
    `;
        count++;
    }
    console.log(`   ✅ ${count} broneeringut imporditud`);
}

// ──────────────────────────────────────────────
// Käivita kõik
// ──────────────────────────────────────────────
async function main() {
    console.log("🚀 Import alustatud...\n");

    // Puhasta olemasolevad andmed (järjekord FK tõttu)
    await sql`DELETE FROM booking`;
    await sql`DELETE FROM user_or_group`;
    await sql`DELETE FROM classroom`;
    await sql`DELETE FROM lesson_type`;

    await importCSV();
    await importJSON();
    await importXML();

    console.log("\n🎉 Kõik andmed edukalt imporditud!");
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Viga:", err);
    process.exit(1);
});
