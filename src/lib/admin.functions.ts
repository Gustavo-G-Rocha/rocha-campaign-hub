import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ----------------------------------------------------------------
// Tipos (DTOs)
// ----------------------------------------------------------------
export type AdminEventRow = {
  id: number;
  slug: string;
  titulo: string;
  descricao: string | null;
  local: string | null;
  cidade: string | null;
  data_evento: string;
  imagem_url: string | null;
  inscritos: number;
};

export type AdminPetitionRow = {
  id: number;
  slug: string;
  titulo: string;
  descricao: string;
  meta: number;
  imagem_url: string | null;
  ativo: boolean;
  assinaturas: number;
};

export type VolunteerRow = {
  id: number;
  nome: string;
  email: string | null;
  telefone: string;
  cidade: string | null;
  bairro: string | null;
  mensagem: string | null;
  created_at: string;
};

export type PersonRow = {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  telefone: string;
  created_at: string;
};

const noDb = { ok: false as const, error: "DATABASE_URL não configurada neste ambiente." };

// ----------------------------------------------------------------
// Sessão
// ----------------------------------------------------------------
const loginSchema = z.object({
  email: z.string().min(3, "Informe o e-mail"),
  password: z.string().min(1, "Informe a senha"),
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const { checkCredentials, getAdminSession } = await import("./admin.server");
    if (!(await checkCredentials(data.email, data.password))) {
      return { ok: false as const, error: "E-mail ou senha incorretos." };
    }
    const session = await getAdminSession();
    await session.update({ email: data.email.trim().toLowerCase() });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminSession } = await import("./admin.server");
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const adminMe = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminSession } = await import("./admin.server");
  const { hasDatabase } = await import("./db.server");
  const session = await getAdminSession();
  return {
    email: session.data.email ?? null,
    hasDatabase: hasDatabase(),
  };
});

// Guarda comum: exige admin logado e devolve a conexão (null se não há banco).
async function adminDb() {
  const { requireAdmin } = await import("./admin.server");
  await requireAdmin();
  const { hasDatabase, getDb } = await import("./db.server");
  if (!hasDatabase()) return null;
  return await getDb();
}

// Gera um slug ainda não usado na tabela informada.
async function uniqueSlug(
  sql: NonNullable<Awaited<ReturnType<typeof adminDb>>>,
  table: "events" | "petitions",
  desired: string,
) {
  const { slugify } = await import("./admin.server");
  const base = slugify(desired) || table.slice(0, -1);
  const taken = new Set(
    (
      await (table === "events"
        ? sql<{ slug: string }[]>`SELECT slug FROM events`
        : sql<{ slug: string }[]>`SELECT slug FROM petitions`)
    ).map((r) => r.slug),
  );
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

// ----------------------------------------------------------------
// Visão geral
// ----------------------------------------------------------------
export const adminSummary = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await adminDb();
  if (!sql) {
    return { eventos: 0, inscritos: 0, abaixoAssinados: 0, assinaturas: 0, voluntarios: 0 };
  }
  const [row] = await sql<
    {
      eventos: number;
      inscritos: number;
      abaixo_assinados: number;
      assinaturas: number;
      voluntarios: number;
    }[]
  >`
    SELECT
      (SELECT COUNT(*)::int FROM events)              AS eventos,
      (SELECT COUNT(*)::int FROM event_registrations) AS inscritos,
      (SELECT COUNT(*)::int FROM petitions)           AS abaixo_assinados,
      (SELECT COUNT(*)::int FROM petition_signatures) AS assinaturas,
      (SELECT COUNT(*)::int FROM volunteers)          AS voluntarios
  `;
  return {
    eventos: row.eventos,
    inscritos: row.inscritos,
    abaixoAssinados: row.abaixo_assinados,
    assinaturas: row.assinaturas,
    voluntarios: row.voluntarios,
  };
});

// ----------------------------------------------------------------
// Eventos
// ----------------------------------------------------------------
export const adminListEvents = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminEventRow[]> => {
    const sql = await adminDb();
    if (!sql) return [];
    const rows = await sql<AdminEventRow[]>`
      SELECT e.id, e.slug, e.titulo, e.descricao, e.local, e.cidade, e.data_evento, e.imagem_url,
             COUNT(r.id)::int AS inscritos
      FROM events e
      LEFT JOIN event_registrations r ON r.event_id = e.id
      GROUP BY e.id
      ORDER BY e.data_evento DESC
    `;
    return rows.map((r) => ({ ...r, data_evento: new Date(r.data_evento).toISOString() }));
  },
);

const createEventSchema = z.object({
  titulo: z.string().min(3, "Informe o título do evento"),
  descricao: z.string().optional().or(z.literal("")),
  local: z.string().optional().or(z.literal("")),
  cidade: z.string().optional().or(z.literal("")),
  data_evento: z.string().min(4, "Informe a data e a hora"),
  imagem_url: z.string().optional().or(z.literal("")),
  slug: z.string().optional().or(z.literal("")),
});

export const adminCreateEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createEventSchema.parse(data))
  .handler(async ({ data }) => {
    const sql = await adminDb();
    if (!sql) return noDb;

    const dataEvento = new Date(data.data_evento);
    if (Number.isNaN(dataEvento.getTime())) {
      return { ok: false as const, error: "Data inválida." };
    }

    const slug = await uniqueSlug(sql, "events", data.slug || data.titulo);
    await sql`
      INSERT INTO events (slug, titulo, descricao, local, cidade, data_evento, imagem_url)
      VALUES (${slug}, ${data.titulo}, ${data.descricao || null}, ${data.local || null},
              ${data.cidade || null}, ${dataEvento}, ${data.imagem_url || null})
    `;
    return { ok: true as const, slug };
  });

const idSchema = z.object({ id: z.number().int().positive() });

export const adminDeleteEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const sql = await adminDb();
    if (!sql) return noDb;
    await sql`DELETE FROM events WHERE id = ${data.id}`;
    return { ok: true as const };
  });

export const adminEventRegistrations = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }): Promise<PersonRow[]> => {
    const sql = await adminDb();
    if (!sql) return [];
    const rows = await sql<PersonRow[]>`
      SELECT id, nome, cidade, estado, telefone, created_at
      FROM event_registrations
      WHERE event_id = ${data.id}
      ORDER BY created_at DESC
    `;
    return rows.map((r) => ({ ...r, created_at: new Date(r.created_at).toISOString() }));
  });

// ----------------------------------------------------------------
// Abaixo-assinados
// ----------------------------------------------------------------
export const adminListPetitions = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminPetitionRow[]> => {
    const sql = await adminDb();
    if (!sql) return [];
    return await sql<AdminPetitionRow[]>`
      SELECT p.id, p.slug, p.titulo, p.descricao, p.meta, p.imagem_url, p.ativo,
             COUNT(s.id)::int AS assinaturas
      FROM petitions p
      LEFT JOIN petition_signatures s ON s.petition_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
  },
);

const createPetitionSchema = z.object({
  titulo: z.string().min(3, "Informe o título"),
  descricao: z.string().min(3, "Informe a descrição"),
  meta: z.number().int().positive().max(1000000),
  imagem_url: z.string().optional().or(z.literal("")),
  slug: z.string().optional().or(z.literal("")),
});

export const adminCreatePetition = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createPetitionSchema.parse(data))
  .handler(async ({ data }) => {
    const sql = await adminDb();
    if (!sql) return noDb;

    const slug = await uniqueSlug(sql, "petitions", data.slug || data.titulo);
    await sql`
      INSERT INTO petitions (slug, titulo, descricao, meta, imagem_url)
      VALUES (${slug}, ${data.titulo}, ${data.descricao}, ${data.meta}, ${data.imagem_url || null})
    `;
    return { ok: true as const, slug };
  });

export const adminDeletePetition = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const sql = await adminDb();
    if (!sql) return noDb;
    await sql`DELETE FROM petitions WHERE id = ${data.id}`;
    return { ok: true as const };
  });

const toggleSchema = z.object({ id: z.number().int().positive(), ativo: z.boolean() });

export const adminTogglePetition = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => toggleSchema.parse(data))
  .handler(async ({ data }) => {
    const sql = await adminDb();
    if (!sql) return noDb;
    await sql`UPDATE petitions SET ativo = ${data.ativo} WHERE id = ${data.id}`;
    return { ok: true as const };
  });

export const adminPetitionSignatures = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }): Promise<PersonRow[]> => {
    const sql = await adminDb();
    if (!sql) return [];
    const rows = await sql<PersonRow[]>`
      SELECT id, nome, cidade, estado, telefone, created_at
      FROM petition_signatures
      WHERE petition_id = ${data.id}
      ORDER BY created_at DESC
    `;
    return rows.map((r) => ({ ...r, created_at: new Date(r.created_at).toISOString() }));
  });

// ----------------------------------------------------------------
// Voluntários
// ----------------------------------------------------------------
export const adminListVolunteers = createServerFn({ method: "GET" }).handler(
  async (): Promise<VolunteerRow[]> => {
    const sql = await adminDb();
    if (!sql) return [];
    const rows = await sql<VolunteerRow[]>`
      SELECT id, nome, email, telefone, cidade, bairro, mensagem, created_at
      FROM volunteers
      ORDER BY created_at DESC
    `;
    return rows.map((r) => ({ ...r, created_at: new Date(r.created_at).toISOString() }));
  },
);
