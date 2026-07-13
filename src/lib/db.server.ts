import postgres from "postgres";

// Singleton connection. DATABASE_URL is read at call time (server-only).
let sql: ReturnType<typeof postgres> | null = null;

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