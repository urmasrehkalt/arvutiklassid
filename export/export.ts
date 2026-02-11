/**
 * Ekspordiskript: PostgreSQL → CSV ja JSON
 *
 * Käivita: bun run export/export.ts
 */
import { writeFileSync } from "fs";
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
// 1. Broneeringute koondtabel (kuu kaupa) → CSV
// ──────────────────────────────────────────────
async function exportBookingsSummaryCSV() {
  console.log("📤 Eksportimine: broneeringute koond → bookings_summary.csv");

  const rows = await sql`
    SELECT
      TO_CHAR(b.booking_date, 'YYYY-MM') AS month,
      cl.name AS classroom,
      COUNT(*) AS booking_count,
      SUM(b.participants) AS total_participants,
      ROUND(SUM(EXTRACT(EPOCH FROM (b.end_time - b.start_time)) / 3600)::numeric, 1) AS total_hours
    FROM booking b
    JOIN classroom cl ON cl.id = b.classroom_id
    GROUP BY month, cl.name
    ORDER BY month, cl.name
  `;

  const header = "month,classroom,booking_count,total_participants,total_hours";
  const csvLines = rows.map(
    (r) => `${r.month},${r.classroom},${r.booking_count},${r.total_participants},${r.total_hours}`
  );

  const csv = [header, ...csvLines].join("\n") + "\n";
  writeFileSync(join(dir, "bookings_summary.csv"), csv, "utf-8");
  console.log(`   ✅ ${rows.length} rida eksporditud`);
}

// ──────────────────────────────────────────────
// 2. Top 5 kõige kasutatumad klassid → JSON
// ──────────────────────────────────────────────
async function exportTop5ClassesJSON() {
  console.log("📤 Eksportimine: Top 5 klassid → top5_classes.json");

  const rows = await sql`
    SELECT
      cl.name,
      cl.building,
      cl.capacity,
      COUNT(b.id) AS booking_count,
      ROUND(SUM(EXTRACT(EPOCH FROM (b.end_time - b.start_time)) / 3600)::numeric, 1) AS total_hours
    FROM classroom cl
    LEFT JOIN booking b ON b.classroom_id = cl.id
    GROUP BY cl.id, cl.name, cl.building, cl.capacity
    ORDER BY booking_count DESC, total_hours DESC
    LIMIT 5
  `;

  writeFileSync(join(dir, "top5_classes.json"), JSON.stringify(rows, null, 2) + "\n", "utf-8");
  console.log(`   ✅ ${rows.length} klassi eksporditud`);
}

// ──────────────────────────────────────────────
async function main() {
  console.log("🚀 Eksport alustatud...\n");
  await exportBookingsSummaryCSV();
  await exportTop5ClassesJSON();
  console.log("\n🎉 Eksport lõpetatud!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Viga:", err);
  process.exit(1);
});
