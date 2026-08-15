// Signs the agent account in and prints a session token, so a future session
// can review or edit the admin without anyone handling a password.
//
// The credentials live in Doppler and are read from the environment here; they
// are never written to disk, printed, or passed on a command line. The token
// it prints is short-lived and scoped to that one account.
//
// Usage:
//   doppler run --project edward-mccann --config stg -- node tools/admin-session.mjs
//   ... [baseUrl]     defaults to the staging deployment
//
// Then set it as a cookie on the admin origin:
//   document.cookie = "payload-token=<token>; path=/"

const BASE = (process.argv[2] ?? 'https://edward-mccann.lab.mahlangu.dev').replace(/\/$/, '');
const email = process.env.PAYLOAD_AGENT_EMAIL;
const password = process.env.PAYLOAD_AGENT_PASSWORD;

if (!email || !password) {
  console.error(
    'PAYLOAD_AGENT_EMAIL and PAYLOAD_AGENT_PASSWORD are not set.\n' +
    'Run under `doppler run --project edward-mccann --config <cfg>`.',
  );
  process.exit(1);
}

const res = await fetch(`${BASE}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

if (!res.ok) {
  const body = await res.text();
  console.error(`login failed: ${res.status} ${body.slice(0, 200)}`);
  process.exit(1);
}

const token = (res.headers.get('set-cookie') ?? '').match(/payload-token=([^;]+)/)?.[1];
if (!token) {
  console.error('logged in but no session cookie was returned');
  process.exit(1);
}

console.log(`signed in to ${BASE} as ${email}`);
console.log('\npayload-token:');
console.log(token);
