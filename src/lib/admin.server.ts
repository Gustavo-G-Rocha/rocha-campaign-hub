// Módulo server-only: credenciais e sessão do painel administrativo.
// Nunca importe este arquivo direto de um componente — use os server functions
// de `admin.functions.ts`, que fazem `await import("./admin.server")`.
// Alias: `useSession` não é um hook do React, mas o eslint-plugin-react-hooks
// reclama do prefixo "use" fora de um componente.
import { useSession as startSession } from "@tanstack/react-start/server";

// Configure em produção via variáveis de ambiente. Os valores abaixo são o
// fallback usado quando nada foi definido no ambiente.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "campanhawillrocha@gmail.com";

// A senha nunca fica em texto puro: guardamos só o hash PBKDF2-SHA256.
// Para trocar a senha, gere um hash novo com:
//   node scripts/hash-senha.mjs "sua-senha-nova"
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  "pbkdf2$sha256$100000$pqhUnOA54YMxeJuqpdbdVg==$MpcvaNG3y+gBWd/hRGR95MEniaCdXhKpqIqHL8ioBSI=";

// Precisa ter 32+ caracteres (exigência do selo de sessão).
const SESSION_PASSWORD =
  process.env.ADMIN_SESSION_SECRET || "willian-rocha-painel-admin-secret-troque-em-producao-2026";

type AdminSessionData = { email: string };

export function getAdminSession() {
  return startSession<AdminSessionData>({
    name: "wr_admin",
    password: SESSION_PASSWORD,
    maxAge: 60 * 60 * 12, // 12 horas
  });
}

// ----------------------------------------------------------------
// Senha (PBKDF2-SHA256 via Web Crypto — roda no Worker e no Node)
// ----------------------------------------------------------------
function fromBase64(text: string) {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256,
  );
  return new Uint8Array(bits);
}

/** Comparação de tempo constante: não vaza quantos bytes bateram. */
function equalBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Confere a senha contra `pbkdf2$sha256$<iterações>$<salt>$<hash>`. */
async function verifyPassword(password: string, stored: string) {
  const [scheme, algo, iterations, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2" || algo !== "sha256" || !salt || !hash) {
    throw new Error("ADMIN_PASSWORD_HASH em formato inválido.");
  }
  const esperado = fromBase64(hash);
  const obtido = await derive(password, fromBase64(salt), Number(iterations));
  return equalBytes(obtido, esperado);
}

export async function checkCredentials(email: string, password: string) {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase()) return false;
  return await verifyPassword(password, ADMIN_PASSWORD_HASH);
}

/** Lança se a requisição não veio de um admin logado. */
export async function requireAdmin() {
  const session = await getAdminSession();
  const email = session.data.email;
  if (!email) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  return email;
}

/** "Meu Evento é Ótimo!" -> "meu-evento-e-otimo" */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
