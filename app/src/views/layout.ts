export function layout(title: string, content: string): string {
    return `<!DOCTYPE html>
<html lang="et">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Arvutiklasside broneeringud</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #f0f2f5;
      color: #1a1a2e;
      line-height: 1.6;
    }
    nav {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 1rem 2rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    nav a {
      color: #e0e0e0;
      text-decoration: none;
      font-weight: 500;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      transition: all 0.2s;
    }
    nav a:hover, nav a.active {
      background: rgba(255,255,255,0.15);
      color: #fff;
    }
    nav .brand {
      font-size: 1.2rem;
      font-weight: 700;
      color: #4fc3f7;
      margin-right: auto;
    }
    .container {
      max-width: 1100px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }
    h1 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      color: #16213e;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    th {
      background: #16213e;
      color: #fff;
      padding: 0.8rem 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 0.7rem 1rem;
      border-bottom: 1px solid #eee;
      font-size: 0.95rem;
    }
    tr:hover td { background: #f8f9ff; }
    .btn {
      display: inline-block;
      padding: 0.45rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-primary {
      background: linear-gradient(135deg, #4fc3f7, #0288d1);
      color: #fff;
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgba(2,136,209,0.4); }
    .btn-danger {
      background: linear-gradient(135deg, #ef5350, #c62828);
      color: #fff;
    }
    .btn-danger:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgba(198,40,40,0.4); }
    .btn-sm { padding: 0.3rem 0.7rem; font-size: 0.8rem; }
    .actions { display: flex; gap: 0.4rem; }
    form.inline { display: inline; }
    .form-card {
      background: #fff;
      border-radius: 10px;
      padding: 2rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      max-width: 600px;
    }
    .form-group {
      margin-bottom: 1.2rem;
    }
    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.3rem;
      font-size: 0.9rem;
      color: #333;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.55rem 0.8rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #4fc3f7;
    }
    .alert {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-weight: 500;
    }
    .alert-success { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
    .alert-error { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: #fff;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .stat-card h3 {
      font-size: 0.85rem;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 0.5rem;
    }
    .stat-card .value {
      font-size: 2rem;
      font-weight: 700;
      color: #16213e;
    }
    .bar-chart { margin-top: 2rem; }
    .bar-row {
      display: flex;
      align-items: center;
      margin-bottom: 0.6rem;
    }
    .bar-label {
      width: 180px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #333;
    }
    .bar-track {
      flex: 1;
      height: 28px;
      background: #e8eaf6;
      border-radius: 6px;
      overflow: hidden;
      position: relative;
    }
    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #4fc3f7, #0288d1);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 0.5rem;
      color: #fff;
      font-weight: 700;
      font-size: 0.8rem;
      min-width: 40px;
      transition: width 0.5s ease;
    }
  </style>
</head>
<body>
  <nav>
    <span class="brand">🖥️ Arvutiklassid</span>
    <a href="/">Broneeringud</a>
    <a href="/bookings/new">Uus broneering</a>
    <a href="/statistics">Statistika</a>
  </nav>
  <div class="container">
    ${content}
  </div>
</body>
</html>`;
}
