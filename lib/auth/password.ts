import 'server-only';

import bcrypt from 'bcryptjs';

export async function verifyAdminPassword(plainPassword: string): Promise<boolean> {
  const passwordPlain = process.env.ADMIN_PASSWORD;
  if (passwordPlain) {
    return plainPassword === passwordPlain;
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) return false;

  return bcrypt.compare(plainPassword, passwordHash);
}
