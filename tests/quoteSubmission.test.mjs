import assert from 'node:assert/strict';
import test from 'node:test';
import { createQuoteSubmitter } from '../src/quoteSubmission.ts';

const validValues = {
  fullName: 'Sipho Dlamini',
  phone: '069 506 2102',
  email: 'sipho@example.com',
  eventType: 'Wedding',
  eventDate: '2027-05-15',
  location: 'Johannesburg',
  services: ['Marquees and Tents', 'Event D\u00e9cor and Styling'],
  details: 'Around 120 guests',
};

const response = (body, ok = true) => ({
  ok,
  json: async () => body,
});

test('posts the documented quote payload and accepts the Worker submission id', async () => {
  let request;
  const submit = createQuoteSubmitter(async (url, options) => {
    request = { url, options };
    return response({ success: true, submissionId: 'SUB-123' });
  });

  const id = await submit('https://worker.example/', 'cli-one-umbrella', validValues, 'https://oneumbrella.example');
  assert.equal(id, 'SUB-123');
  assert.equal(request.url, 'https://worker.example/');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(request.options.body), {
    clientId: 'cli-one-umbrella',
    formName: 'quote',
    customer: { name: 'Sipho Dlamini', email: 'sipho@example.com' },
    fields: {
      phone: '069 506 2102',
      eventType: 'Wedding',
      eventDate: '2027-05-15',
      location: 'Johannesburg',
      services: ['Marquees and Tents', 'Event D\u00e9cor and Styling'],
      details: 'Around 120 guests',
    },
    website: 'https://oneumbrella.example',
  });
});

test('rejects missing or invalid customer email without calling the Worker', async () => {
  let calls = 0;
  const submit = createQuoteSubmitter(async () => { calls++; return response({ success: true, submissionId: 'x' }); });

  await assert.rejects(submit('https://worker.example/', 'cli', { ...validValues, email: '' }), /valid email/);
  await assert.rejects(submit('https://worker.example/', 'cli', { ...validValues, email: 'not-an-email' }), /valid email/);
  assert.equal(calls, 0);
});

test('reports Worker rejection and never resolves as a successful submission', async () => {
  const submit = createQuoteSubmitter(async () => response({ success: false, error: 'Unknown client.' }, false));
  await assert.rejects(submit('https://worker.example/', 'bad-client', validValues), /Unknown client/);
});

test('rejects invalid JSON and incomplete success responses', async () => {
  const invalidJson = createQuoteSubmitter(async () => ({ ok: true, json: async () => { throw new SyntaxError('bad json'); } }));
  await assert.rejects(invalidJson('https://worker.example/', 'cli', validValues), /unreadable response/);

  const missingId = createQuoteSubmitter(async () => response({ success: true }));
  await assert.rejects(missingId('https://worker.example/', 'cli', validValues), /could not submit/);
});

test('propagates network failures for the UI to display as connection errors', async () => {
  const submit = createQuoteSubmitter(async () => { throw new TypeError('fetch failed'); });
  await assert.rejects(submit('https://worker.example/', 'cli', validValues), /fetch failed/);
});

test('blocks concurrent duplicate submissions while a request is pending', async () => {
  let resolveRequest;
  let calls = 0;
  const pendingResponse = new Promise(resolve => { resolveRequest = resolve; });
  const submit = createQuoteSubmitter(async () => { calls++; return pendingResponse; });

  const first = submit('https://worker.example/', 'cli', validValues);
  await assert.rejects(submit('https://worker.example/', 'cli', validValues), /already being submitted/);
  assert.equal(calls, 1);
  resolveRequest(response({ success: true, submissionId: 'SUB-123' }));
  assert.equal(await first, 'SUB-123');
});
