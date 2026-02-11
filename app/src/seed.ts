import sql from "./db";

async function seed() {
    console.log("🌱 Andmebaasi täitmine näidisandmetega...");

    // Tunnitüübid
    await sql`
    INSERT INTO lesson_type (name) VALUES
      ('Loeng'),
      ('Praktikum'),
      ('Seminar'),
      ('Eksam'),
      ('Konsultatsioon')
    ON CONFLICT (name) DO NOTHING
  `;

    // Klassiruumid
    await sql`
    INSERT INTO classroom (name, building, floor, capacity, has_projector) VALUES
      ('A201', 'A-korpus', 2, 30, true),
      ('A202', 'A-korpus', 2, 25, true),
      ('B101', 'B-korpus', 1, 20, false),
      ('B305', 'B-korpus', 3, 35, true),
      ('C110', 'C-korpus', 1, 15, true),
      ('C215', 'C-korpus', 2, 40, true)
    ON CONFLICT (name) DO NOTHING
  `;

    // Kasutajad / Grupid
    await sql`
    INSERT INTO user_or_group (name, email, role) VALUES
      ('Mart Tamm',     'mart.tamm@kool.ee',    'teacher'),
      ('Liis Kask',     'liis.kask@kool.ee',    'teacher'),
      ('Andres Mägi',   'andres.magi@kool.ee',  'teacher'),
      ('TAK25',         NULL,                    'group'),
      ('TAK24',         NULL,                    'group'),
      ('TARpe24',       NULL,                    'group')
    ON CONFLICT DO NOTHING
  `;

    // Broneeringud (jooksev nädal)
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const dates = Array.from({ length: 5 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return formatDate(d);
    });

    await sql`
    INSERT INTO booking (classroom_id, user_id, lesson_type_id, booking_date, start_time, end_time, participants, description) VALUES
      (1, 1, 1, ${dates[0]}, '08:00', '09:30', 28, 'Programmeerimise loeng'),
      (1, 4, 2, ${dates[0]}, '10:00', '11:30', 25, 'Veebiarenduse praktikum'),
      (2, 2, 2, ${dates[0]}, '12:00', '13:30', 22, 'Andmebaaside praktikum'),
      (3, 3, 1, ${dates[1]}, '08:00', '09:30', 18, 'IT-aluste loeng'),
      (4, 1, 2, ${dates[1]}, '10:00', '13:00', 30, 'Tarkvaraarenduse praktikum'),
      (5, 5, 3, ${dates[2]}, '14:00', '15:30', 12, 'Projekti seminar'),
      (6, 2, 1, ${dates[2]}, '08:00', '11:00', 38, 'Programmeerimise loeng'),
      (1, 6, 2, ${dates[3]}, '10:00', '11:30', 20, 'Arvutivõrkude praktikum'),
      (2, 3, 4, ${dates[3]}, '12:00', '14:00', 24, 'Andmebaaside eksam'),
      (4, 1, 5, ${dates[4]}, '10:00', '11:00', 5, 'Konsultatsioon'),
      (3, 4, 2, ${dates[4]}, '08:00', '09:30', 19, 'Veebiarenduse praktikum'),
      (6, 2, 1, ${dates[4]}, '12:00', '13:30', 35, 'IT-aluste loeng')
    ON CONFLICT DO NOTHING
  `;

    console.log("✅ Näidisandmed edukalt sisestatud!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Viga:", err);
    process.exit(1);
});
