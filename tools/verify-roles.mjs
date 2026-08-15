// Proves, against a running deployment, that the editor role is actually
// enforced rather than merely declared.
//
// Signs in as the standing agent account (an editor) and checks what it can
// and cannot do. Everything here is read-only or expected to be refused, so it
// is safe to run against staging whenever the access rules change.
//
// Usage:
//   doppler run --project edward-mccann --config stg -- node tools/verify-roles.mjs [baseUrl]

const BASE = (process.argv[2] ?? 'https://edward-mccann.lab.mahlangu.dev').replace(/\/$/, '');
const email = process.env.PAYLOAD_AGENT_EMAIL;
const password = process.env.PAYLOAD_AGENT_PASSWORD;

if (!email || !password) {
  console.error('PAYLOAD_AGENT_EMAIL and PAYLOAD_AGENT_PASSWORD are not set.');
  process.exit(1);
}

const results = [];
function check(description, passed, detail = '') {
  results.push({ description, passed });
  console.log(`${passed ? 'ok  ' : 'FAIL'}  ${description}${detail ? `  (${detail})` : ''}`);
}

const login = await fetch(`${BASE}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
if (!login.ok) {
  console.error(`could not sign in as the agent account: ${login.status}`);
  process.exit(1);
}
const { token, user } = await login.json();
const auth = { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' };

check('the agent account signs in', Boolean(token));
check('it is an editor, not an owner', user.role === 'editor', `role=${user.role}`);

// What Payload itself believes this user may do. This is the same computation
// the admin panel uses to decide which buttons to render.
const access = await (await fetch(`${BASE}/api/access`, { headers: auth })).json();

// Payload uses two shapes in the same response: a bare boolean for a plain
// allow, and an object carrying `permission` alongside the `where` clause when
// access is constrained. Operations it denies are left out altogether.
//
// The hazard when reading this is a "may NOT" assertion passing for the wrong
// reason, which would report a wide open site as locked. Two things guard
// against it. An unrecognised collection throws instead of reading as denied.
// And the positive assertions below share the same lookup, so if the shape or
// the operation names ever change they fail loudly, which is what keeps the
// negative assertions honest.
function may(collection, action) {
  const node = access.collections?.[collection];
  if (!node || typeof node !== 'object') {
    throw new Error(
      `/api/access has no entry for ${collection}. The permissions shape has changed, ` +
        'and these checks prove nothing until this is updated.',
    );
  }

  const operation = node[action];
  if (operation === undefined) return false;

  const value = operation !== null && typeof operation === 'object' ? operation.permission : operation;
  if (typeof value !== 'boolean') {
    throw new Error(`cannot read ${collection}.${action} (got ${JSON.stringify(operation)}).`);
  }
  return value;
}

check('may reach the admin panel', Boolean(access.canAccessAdmin));
check('may edit projects', may('projects', 'update'));
check('may add images', may('media', 'create'));
check('may delete images', may('media', 'delete'));
check('may NOT create accounts', !may('users', 'create'));
check('may NOT delete accounts', !may('users', 'delete'));

// Payload computes field permissions too, so the lock on the role field can be
// read straight from its own answer rather than only inferred from behaviour.
check(
  'may NOT write the role field',
  access.collections?.users?.fields?.role?.update !== true,
  JSON.stringify(access.collections?.users?.fields?.role),
);

// Its own record is readable and updatable, but scoped by a where clause, so
// it cannot reach anyone else's.
check(
  'its own account is readable but scoped to itself',
  Boolean(access.collections?.users?.read?.where),
);

// Reading users is allowed, but constrained to its own record, so an editor
// cannot enumerate who else has access.
const list = await (await fetch(`${BASE}/api/users?limit=100`, { headers: auth })).json();
check(
  'sees only its own account in the user list',
  list.totalDocs === 1 && list.docs?.[0]?.email === email,
  `${list.totalDocs} visible`,
);

// Refused outright rather than quietly ignored.
const created = await fetch(`${BASE}/api/users`, {
  method: 'POST',
  headers: auth,
  body: JSON.stringify({ email: 'should-never-exist@edwardmccann.invalid', password: 'irrelevant', role: 'owner' }),
});
check('creating an account is refused', created.status === 403, `HTTP ${created.status}`);

// The important one: an editor may update its own record, so the only thing
// standing between it and ownership is field-level access on the role itself.
await fetch(`${BASE}/api/users/${user.id}`, {
  method: 'PATCH',
  headers: auth,
  body: JSON.stringify({ role: 'owner' }),
});
const after = await (await fetch(`${BASE}/api/users/${user.id}`, { headers: auth })).json();
check('cannot promote itself to owner', after.role === 'editor', `role=${after.role}`);

const failed = results.filter((r) => !r.passed).length;
console.log(`\n${results.length} checks, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
