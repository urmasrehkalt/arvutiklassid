import { Hono } from "hono";
import sql from "../db";
import { layout } from "../views/layout";

const statistics = new Hono();

statistics.get("/", async (c) => {
    // Kogustatistika
    const [totals] = await sql`
    SELECT
      (SELECT COUNT(*) FROM booking)    AS total_bookings,
      (SELECT COUNT(*) FROM classroom)  AS total_classrooms,
      (SELECT COUNT(*) FROM user_or_group) AS total_users
  `;

    // Klasside kasutus tundides sel nädalal
    const weeklyUsage = await sql`
    SELECT
      cl.name AS classroom_name,
      COALESCE(SUM(EXTRACT(EPOCH FROM (b.end_time - b.start_time)) / 3600), 0) AS hours
    FROM classroom cl
    LEFT JOIN booking b ON b.classroom_id = cl.id
      AND b.booking_date >= date_trunc('week', CURRENT_DATE)
      AND b.booking_date <  date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'
    GROUP BY cl.id, cl.name
    ORDER BY hours DESC
  `;

    // Populaarsemad kasutajad
    const topUsers = await sql`
    SELECT u.name, u.role, COUNT(b.id) AS booking_count
    FROM user_or_group u
    LEFT JOIN booking b ON b.user_id = u.id
    GROUP BY u.id, u.name, u.role
    ORDER BY booking_count DESC
    LIMIT 5
  `;

    const maxHours = Math.max(...weeklyUsage.map((r) => Number(r.hours)), 1);

    const barChart = weeklyUsage
        .map(
            (r) => `
    <div class="bar-row">
      <span class="bar-label">${r.classroom_name}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${(Number(r.hours) / maxHours) * 100}%">
          ${Number(r.hours).toFixed(1)}h
        </div>
      </div>
    </div>`
        )
        .join("");

    const userTable = topUsers
        .map(
            (u) => `
    <tr>
      <td>${u.name}</td>
      <td>${u.role === "teacher" ? "Õpetaja" : "Grupp"}</td>
      <td><strong>${u.booking_count}</strong></td>
    </tr>`
        )
        .join("");

    const html = layout(
        "Statistika",
        `
    <h1>Statistika</h1>

    <div class="stat-grid">
      <div class="stat-card">
        <h3>Broneeringuid kokku</h3>
        <div class="value">${totals.total_bookings}</div>
      </div>
      <div class="stat-card">
        <h3>Klassiruume</h3>
        <div class="value">${totals.total_classrooms}</div>
      </div>
      <div class="stat-card">
        <h3>Kasutajaid</h3>
        <div class="value">${totals.total_users}</div>
      </div>
    </div>

    <h2 style="margin-bottom:1rem">Klasside kasutus tundides (sel nädalal)</h2>
    <div class="bar-chart">
      ${barChart || '<p style="color:#888">Sel nädalal broneeringuid ei ole</p>'}
    </div>

    <h2 style="margin:2rem 0 1rem">Top 5 aktiivsemad kasutajad</h2>
    <table>
      <thead>
        <tr><th>Nimi</th><th>Roll</th><th>Broneeringuid</th></tr>
      </thead>
      <tbody>
        ${userTable || '<tr><td colspan="3" style="text-align:center;padding:1rem;color:#888">Andmed puuduvad</td></tr>'}
      </tbody>
    </table>
  `
    );
    return c.html(html);
});

export default statistics;
