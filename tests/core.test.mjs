import test from 'node:test';
import assert from 'node:assert/strict';

import { formatWelcome, renderDashboardHTML } from '../apps/web/src/main.js';
import { healthcheck } from '../apps/api/src/index.js';
import { toSlug, identity } from '../packages/utils/src/index.js';
import { isEntityId } from '../packages/types/src/index.js';
import { badge } from '../packages/ui/src/index.js';

test('formatWelcome normalizes empty values', () => {
  assert.equal(formatWelcome(''), 'Welcome, User');
  assert.equal(formatWelcome('  Alice  '), 'Welcome, Alice');
});

test('renderDashboardHTML includes key sections', () => {
  const html = renderDashboardHTML('Sangwijit');
  assert.match(html, /Sales Today/);
  assert.match(html, /Recent Orders/);
  assert.match(html, /Welcome, Sangwijit/);
});

test('healthcheck returns stable payload', () => {
  assert.deepEqual(healthcheck(), { status: 'ok', version: 'v1' });
});

test('utility helpers behave correctly', () => {
  assert.equal(identity(42), 42);
  assert.equal(toSlug('Inventory Ledger 2026'), 'inventory-ledger-2026');
});

test('entity id validator and ui badge', () => {
  assert.equal(isEntityId('USR-001'), true);
  assert.equal(isEntityId(''), false);
  assert.equal(badge('OK', 'positive'), '<span data-tone="positive">OK</span>');
});
