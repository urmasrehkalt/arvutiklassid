import { Hono } from "hono";
import sql from "../db";
import { layout } from "../views/layout";

const bookings = new Hono();

// ==================== LIST ====================
bookings.get("/", async (c) => {
    const rows = await sql`
    SELECT b.id, b.booking_date, b.start_time, b.end_time,
           b.participants, b.description,
           cl.name AS classroom_name,
           u.name  AS user_name,
           lt.name AS lesson_type_name
    FROM booking b
    JOIN classroom    cl ON cl.id = b.classroom_id
    JOIN user_or_group u ON u.id  = b.user_id
    LEFT JOIN lesson_type lt ON lt.id = b.lesson_type_id
    ORDER BY b.booking_date DESC, b.start_time ASC
  `;

    const tableRows = rows
        .map(
            (r) => `
    <tr>
      <td>${r.booking_date}</td>
      <td>${r.classroom_name}</td>
      <td>${r.user_name}</td>
      <td>${r.start_time?.toString().slice(0, 5)} – ${r.end_time?.toString().slice(0, 5)}</td>
      <td>${r.lesson_type_name || "–"}</td>
      <td>${r.participants}</td>
      <td class="actions">
        <a href="/bookings/${r.id}/edit" class="btn btn-primary btn-sm">Muuda</a>
        <form class="inline" method="POST" action="/bookings/${r.id}/delete"
              onsubmit="return confirm('Kas oled kindel?')">
          <button type="submit" class="btn btn-danger btn-sm">Kustuta</button>
        </form>
      </td>
    </tr>`
        )
        .join("");

    const html = layout(
        "Broneeringud",
        `
    <h1>Broneeringud</h1>
    <p style="margin-bottom:1rem">
      <a href="/bookings/new" class="btn btn-primary">+ Lisa uus broneering</a>
    </p>
    <table>
      <thead>
        <tr>
          <th>Kuupäev</th>
          <th>Klassiruum</th>
          <th>Kasutaja</th>
          <th>Aeg</th>
          <th>Tunnitüüp</th>
          <th>Osalejad</th>
          <th>Tegevused</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows || '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#888">Broneeringuid ei leitud</td></tr>'}
      </tbody>
    </table>
  `
    );
    return c.html(html);
});

// ==================== NEW FORM ====================
bookings.get("/new", async (c) => {
    const classrooms = await sql`SELECT id, name FROM classroom ORDER BY name`;
    const users = await sql`SELECT id, name, role FROM user_or_group ORDER BY name`;
    const lessonTypes = await sql`SELECT id, name FROM lesson_type ORDER BY name`;

    const html = layout(
        "Uus broneering",
        `
    <h1>Lisa uus broneering</h1>
    <div class="form-card">
      <form method="POST" action="/bookings">
        <div class="form-group">
          <label>Klassiruum *</label>
          <select name="classroom_id" required>
            <option value="">Vali klassiruum...</option>
            ${classrooms.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Kasutaja / Grupp *</label>
          <select name="user_id" required>
            <option value="">Vali kasutaja...</option>
            ${users.map((u) => `<option value="${u.id}">${u.name} (${u.role})</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Tunnitüüp</label>
          <select name="lesson_type_id">
            <option value="">Pole määratud</option>
            ${lessonTypes.map((lt) => `<option value="${lt.id}">${lt.name}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Kuupäev *</label>
          <input type="date" name="booking_date" required>
        </div>
        <div class="form-group">
          <label>Algusaeg *</label>
          <input type="time" name="start_time" required>
        </div>
        <div class="form-group">
          <label>Lõppaeg *</label>
          <input type="time" name="end_time" required>
        </div>
        <div class="form-group">
          <label>Osalejate arv</label>
          <input type="number" name="participants" min="0" value="0">
        </div>
        <div class="form-group">
          <label>Kirjeldus</label>
          <textarea name="description" rows="3" placeholder="Valikuline kirjeldus..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Salvesta</button>
        <a href="/" class="btn" style="margin-left:0.5rem">Tühista</a>
      </form>
    </div>
  `
    );
    return c.html(html);
});

// ==================== CREATE ====================
bookings.post("/", async (c) => {
    const body = await c.req.parseBody();
    try {
        await sql`
      INSERT INTO booking (classroom_id, user_id, lesson_type_id, booking_date, start_time, end_time, participants, description)
      VALUES (
        ${Number(body.classroom_id)},
        ${Number(body.user_id)},
        ${body.lesson_type_id ? Number(body.lesson_type_id) : null},
        ${body.booking_date as string},
        ${body.start_time as string},
        ${body.end_time as string},
        ${Number(body.participants) || 0},
        ${(body.description as string) || null}
      )
    `;
        return c.redirect("/");
    } catch (err: any) {
        return c.html(
            layout("Viga", `<div class="alert alert-error">Viga: ${err.message}</div><a href="/bookings/new" class="btn btn-primary">Tagasi</a>`)
        );
    }
});

// ==================== EDIT FORM ====================
bookings.get("/:id/edit", async (c) => {
    const id = Number(c.req.param("id"));
    const [booking] = await sql`SELECT * FROM booking WHERE id = ${id}`;
    if (!booking) return c.html(layout("Ei leitud", `<div class="alert alert-error">Broneeringut ei leitud</div>`), 404);

    const classrooms = await sql`SELECT id, name FROM classroom ORDER BY name`;
    const users = await sql`SELECT id, name, role FROM user_or_group ORDER BY name`;
    const lessonTypes = await sql`SELECT id, name FROM lesson_type ORDER BY name`;

    const html = layout(
        "Muuda broneeringut",
        `
    <h1>Muuda broneeringut #${booking.id}</h1>
    <div class="form-card">
      <form method="POST" action="/bookings/${booking.id}">
        <div class="form-group">
          <label>Klassiruum *</label>
          <select name="classroom_id" required>
            ${classrooms.map((cl) => `<option value="${cl.id}" ${cl.id === booking.classroom_id ? "selected" : ""}>${cl.name}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Kasutaja / Grupp *</label>
          <select name="user_id" required>
            ${users.map((u) => `<option value="${u.id}" ${u.id === booking.user_id ? "selected" : ""}>${u.name} (${u.role})</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Tunnitüüp</label>
          <select name="lesson_type_id">
            <option value="">Pole määratud</option>
            ${lessonTypes.map((lt) => `<option value="${lt.id}" ${lt.id === booking.lesson_type_id ? "selected" : ""}>${lt.name}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Kuupäev *</label>
          <input type="date" name="booking_date" value="${booking.booking_date}" required>
        </div>
        <div class="form-group">
          <label>Algusaeg *</label>
          <input type="time" name="start_time" value="${booking.start_time?.toString().slice(0, 5)}" required>
        </div>
        <div class="form-group">
          <label>Lõppaeg *</label>
          <input type="time" name="end_time" value="${booking.end_time?.toString().slice(0, 5)}" required>
        </div>
        <div class="form-group">
          <label>Osalejate arv</label>
          <input type="number" name="participants" min="0" value="${booking.participants}">
        </div>
        <div class="form-group">
          <label>Kirjeldus</label>
          <textarea name="description" rows="3">${booking.description || ""}</textarea>
        </div>
        <button type="submit" class="btn btn-primary">Salvesta muudatused</button>
        <a href="/" class="btn" style="margin-left:0.5rem">Tühista</a>
      </form>
    </div>
  `
    );
    return c.html(html);
});

// ==================== UPDATE ====================
bookings.post("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const body = await c.req.parseBody();
    try {
        await sql`
      UPDATE booking SET
        classroom_id   = ${Number(body.classroom_id)},
        user_id        = ${Number(body.user_id)},
        lesson_type_id = ${body.lesson_type_id ? Number(body.lesson_type_id) : null},
        booking_date   = ${body.booking_date as string},
        start_time     = ${body.start_time as string},
        end_time       = ${body.end_time as string},
        participants   = ${Number(body.participants) || 0},
        description    = ${(body.description as string) || null}
      WHERE id = ${id}
    `;
        return c.redirect("/");
    } catch (err: any) {
        return c.html(
            layout("Viga", `<div class="alert alert-error">Viga: ${err.message}</div><a href="/bookings/${id}/edit" class="btn btn-primary">Tagasi</a>`)
        );
    }
});

// ==================== DELETE ====================
bookings.post("/:id/delete", async (c) => {
    const id = Number(c.req.param("id"));
    await sql`DELETE FROM booking WHERE id = ${id}`;
    return c.redirect("/");
});

export default bookings;
