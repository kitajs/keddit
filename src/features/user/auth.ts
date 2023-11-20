import { JWT } from '@fastify/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { Env } from '../../env';

/** Returns a argon2 hash of the password */
export function hashUserPassword(password: string) {
  return hash(password);
}

/** Returns true if the hash matches the plain password */
export function verifyUserPassword(hash: string, plain: string) {
  return verify(hash, plain);
}

export function createUserJwt(jwt: JWT, user: Pick<User, 'id'>) {
  return jwt.sign({ userId: user.id }, { expiresIn: Env.JWT_EXPIRES_SECONDS });
}

export function verifyUserJwt(jwt: JWT, token: string) {
  return jwt.verify<{ userId: number }>(token);
}
