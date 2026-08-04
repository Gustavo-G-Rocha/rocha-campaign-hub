import postgres from "postgres";
import schemaSql from "../../db/schema.sql?raw";

// Singleton connection. DATABASE_URL is read at call time (server-only).
let sql: ReturnType<typeof postgres> | null = null;
let migration: Promise<void> | null = null;

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não configurada");
  }
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL, {
      ssl: process.env.DATABASE_SSL === "false" ? false : "prefer",
      max: 5,
    });
  }
  return sql;
}

// Conexão pronta para uso: aplica o schema.sql (idempotente) uma única vez
// por processo, criando as tabelas e populando os dados iniciais sozinho.
// Assim o banco se auto-configura no primeiro acesso após o deploy.
export async function getDb() {
  const s = getSql();
  if (!migration) {
    migration = s
      .unsafe(schemaSql)
      .simple()
      .then(() => undefined)
      .catch((err) => {
        migration = null; // permite nova tentativa no próximo request
        throw err;
      });
  }
  await migration;
  return s;
}
