const REQUIRED_USER_FIELDS = ['user_id', 'email', 'name'];

export function normalizeAuthUser(raw) {
  const candidate = raw && typeof raw === 'object' && raw.user ? raw.user : raw;

  if (!candidate || typeof candidate !== 'object') {
    throw new Error('Invalid auth response: expected object');
  }

  const missing = REQUIRED_USER_FIELDS.filter((field) => !candidate[field]);
  if (missing.length > 0) {
    throw new Error(`Invalid auth response: missing fields ${missing.join(', ')}`);
  }

  return candidate;
}
