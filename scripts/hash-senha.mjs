// Gera o hash de uma senha para usar em ADMIN_PASSWORD_HASH.
//
//   node scripts/hash-senha.mjs "minha-senha-nova"
//
// Cole a linha impressa na variável de ambiente ADMIN_PASSWORD_HASH
// (ou no fallback em src/lib/admin.server.ts).
const ITERATIONS = 100000;

const senha = process.argv[2];
if (!senha) {
  console.error('Uso: node scripts/hash-senha.mjs "sua-senha"');
  process.exit(1);
}

const toB64 = (bytes) => Buffer.from(bytes).toString("base64");

const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, [
  "deriveBits",
]);
const salt = crypto.getRandomValues(new Uint8Array(16));
const bits = await crypto.subtle.deriveBits(
  { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
  key,
  256,
);

console.log(`pbkdf2$sha256$${ITERATIONS}$${toB64(salt)}$${toB64(new Uint8Array(bits))}`);
