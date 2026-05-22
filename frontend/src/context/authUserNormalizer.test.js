import { describe, expect, it } from 'vitest';
import { normalizeAuthUser } from './authUserNormalizer';

const validUser = {
  user_id: 'user_123',
  email: 'test@example.com',
  name: 'Test User',
};

describe('normalizeAuthUser', () => {
  it('returns a valid top-level user object unchanged', () => {
    expect(normalizeAuthUser(validUser)).toBe(validUser);
  });

  it('unwraps auth responses that contain a user object', () => {
    expect(normalizeAuthUser({ user: validUser })).toBe(validUser);
  });

  it('rejects responses missing required user fields', () => {
    expect(() => normalizeAuthUser({ user_id: 'user_123', email: 'test@example.com' })).toThrow(
      'Invalid auth response: missing fields name',
    );
  });

  it('rejects null responses', () => {
    expect(() => normalizeAuthUser(null)).toThrow('Invalid auth response: expected object');
  });
});
