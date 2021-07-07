import bcrypt from "bcryptjs";

export async function getHash(password: string) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export function check(password: string, hash: string) {
    console.log(password)
    console.log(hash)

  return bcrypt.compareSync(password, hash);
}
