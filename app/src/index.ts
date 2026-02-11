import { Hono } from "hono";
import bookings from "./routes/bookings";
import statistics from "./routes/statistics";

const app = new Hono();

// Mount routes
app.route("/bookings", bookings);
app.route("/statistics", statistics);

// Home → redirect to bookings list
app.get("/", (c) => c.redirect("/bookings"));

console.log("🖥️  Arvutiklasside broneeringud käivitunud: http://localhost:3000");

export default {
    port: 3000,
    fetch: app.fetch,
};
