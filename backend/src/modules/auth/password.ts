import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

function derive(
  password: string,
  salt: string,
  version: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(
      password,
      salt,
      64,
      {
        N: version === 2 ? 32768 : 16384,
        r: 8,
        p: 1,
        maxmem: 64 * 1024 * 1024,
      },
      (error, value) => (error ? reject(error) : resolve(value)),
    ),
  );
}
export async function hashPassword(password: string) {
  const passwordSalt = randomBytes(16).toString("hex");
  const passwordHash = (await derive(password, passwordSalt, 2)).toString(
    "hex",
  );
  return { passwordSalt, passwordHash, passwordVersion: 2 };
}
export async function verifyPassword(
  password: string,
  passwordSalt: string,
  passwordHash: string,
  version = 2,
) {
  const actual = await derive(password, passwordSalt, version);
  const expected = Buffer.from(passwordHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
