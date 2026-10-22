import config from '../config/config.json' with { type: 'json' };
import jwt from 'jsonwebtoken';

export function verifyUserToken(
  token: string,
): { id: string } | null {
  try {
    const payload = jwt.verify(token, config.jwt.secret, {
      issuer: config.jwt.issuer,
    });

    if (
      typeof payload === 'string' ||
      typeof payload.sub !== 'string' ||
      payload.sub.length === 0
    ) {
      return null;
    }

    return { id: payload.sub };
  } catch {
    return null;
  }
}