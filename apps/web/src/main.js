import { fileURLToPath } from 'node:url';

export const appName = 'ERP Web Mockup';

export function formatWelcome(userName) {
  const normalized = String(userName || 'User').trim() || 'User';
  return `Welcome, ${normalized}`;
}

export function renderDashboardHTML(userName = 'Manager') {
  const welcome = formatWelcome(userName);
  return `
    <header class="topbar">
      <h1>${appName}</h1>
      <p>${welcome}</p>
    </header>

    <section class="kpi-grid">
      <article class="kpi-card">
        <h2>Sales Today</h2>
        <strong>฿128,400</strong>
      </article>
      <article class="kpi-card">
        <h2>Pending Orders</h2>
        <strong>24</strong>
      </article>
      <article class="kpi-card">
        <h2>Low Stock Items</h2>
        <strong>7</strong>
      </article>
    </section>

    <section class="panel">
      <h2>Recent Orders</h2>
      <table>
        <thead>
          <tr><th>Order #</th><th>Customer</th><th>Status</th><th>Total</th></tr>
        </thead>
        <tbody>
          <tr><td>SO-1001</td><td>Acme Co.</td><td>Processing</td><td>฿24,500</td></tr>
          <tr><td>SO-1002</td><td>Blue Mart</td><td>Shipped</td><td>฿18,900</td></tr>
          <tr><td>SO-1003</td><td>North Star</td><td>Pending</td><td>฿7,100</td></tr>
        </tbody>
      </table>
    </section>
  `;
}

export function mountDashboard(rootElement, userName) {
  rootElement.innerHTML = renderDashboardHTML(userName);
}

const isDirectExecution = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  console.log(formatWelcome('Developer'));
}
