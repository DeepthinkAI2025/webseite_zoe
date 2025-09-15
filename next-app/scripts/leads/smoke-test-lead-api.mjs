#!/usr/bin/env node
/**
 * Mini Smoke Test für /api/lead
 * Führt: Invalid -> Expect 422, Valid -> 200, Duplicate -> duplicate.true
 */
import assert from 'assert';

const base = process.env.BASE_URL || 'http://localhost:3000';

async function post(payload){
  const res = await fetch(base + '/api/lead', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });
  const json = await res.json().catch(()=>({}));
  return { status: res.status, json };
}

(async () => {
  // Invalid
  let r = await post({ name:'', email:'bad', postcode:'12', consent:false });
  assert.strictEqual(r.status, 422, 'Expected 422 for invalid payload');
  console.log('✔ Invalid Payload Test');

  // Valid
  const email = `smoke+${Date.now()}@example.com`;
  r = await post({ name:'Test User', email, postcode:'10115', consent:true, storageInterest:true });
  assert.strictEqual(r.status, 200, 'Expected 200 for valid');
  assert.ok(r.json.success, 'Expected success true');
  console.log('✔ Valid Payload Test');

  // Duplicate
  const dup = await post({ name:'Test User', email, postcode:'10115', consent:true });
  assert.strictEqual(dup.status, 200, 'Duplicate still 200');
  assert.ok(dup.json.duplicate, 'Expected duplicate flag');
  console.log('✔ Duplicate Detection Test');

  console.log('Alle Smoke Tests OK');
})().catch(err => { console.error('Smoke Test Fehler:', err); process.exit(1); });
