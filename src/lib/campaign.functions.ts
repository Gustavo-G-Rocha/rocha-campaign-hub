import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ----------------------------------------------------------------
// Tipos (DTOs)
// ----------------------------------------------------------------
export type EventItem = {
  id: number;
  slug: string;
  titulo: string;
  descricao: string | null;
  local: string | null;
  cidade: string | null;
  data_evento: string;
  imagem_url: string | null;
};

export type PetitionItem = {
  id: number;
  slug: string;
  titulo: string;
  descricao: string;
  imagem_url: string | null;
};

// ----------------------------------------------------------------
// Dados de exemplo (usados quando DATABASE_URL não está configurada)
// ----------------------------------------------------------------
const demoEvents: EventItem[] = [];

const demoPetitions: PetitionItem[] = [
  {
    id: 1,
    slug: "retirada-mesa-solidaria-dr-muricy",
    titulo: "Abaixo-assinado pela retirada da Mesa Solidária da Rua Dr. Muricy (Curitiba)",
    descricao:
      "Assine pela retirada da Mesa Solidária da Rua Dr. Muricy, no centro de Curitiba. Moradores e comerciantes relatam aumento da insegurança na região.",
    imagem_url: "/banner-mesa-solidaria.webp",
  },
  {
    id: 2,
    slug: "cassacao-vereador-nilso",
    titulo: "Abaixo-assinado pela cassação do Vereador Nilso",
    descricao:
      "Assine pela cassação do mandato do Vereador Nilso, investigado por rachadinha na Câmara Municipal de Curitiba. Notícia: https://www.bemparana.com.br/publicacao/blogs/politicaemdebate/camara-de-curitiba-vota-parecer-que-pode-levar-a-cassacao-de-vereador-investigado-por-rachadinha/",
    imagem_url: null,
  },
];

// O horário do aceite fica em `consentimento_em` (DEFAULT now() no banco).
const consentimento = z.literal(true, {
  message: "É preciso concordar com a Política de Privacidade",
});
const compartilhamento = z.boolean().default(false);

// ----------------------------------------------------------------
// Voluntários
// ----------------------------------------------------------------
const volunteerSchema = z.object({
  consentimento,
  compartilhamento,
  nome: z.string().min(2, "Informe seu nome"),
  telefone: z.string().min(8, "Informe um telefone válido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  cidade: z.string().optional().or(z.literal("")),
  bairro: z.string().optional().or(z.literal("")),
  mensagem: z.string().optional().or(z.literal("")),
});

export const createVolunteer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => volunteerSchema.parse(data))
  .handler(async ({ data }) => {
    const { hasDatabase, getDb } = await import("./db.server");
    if (!hasDatabase()) {
      return { ok: true as const, demo: true as const };
    }
    const sql = await getDb();
    await sql`
      INSERT INTO volunteers (nome, telefone, email, cidade, bairro, mensagem, compartilhamento)
      VALUES (${data.nome}, ${data.telefone}, ${data.email || null},
              ${data.cidade || null}, ${data.bairro || null}, ${data.mensagem || null},
              ${data.compartilhamento})
    `;
    return { ok: true as const, demo: false as const };
  });

// ----------------------------------------------------------------
// Eventos
// ----------------------------------------------------------------
export const getEvents = createServerFn({ method: "GET" }).handler(
  async (): Promise<EventItem[]> => {
    const { hasDatabase, getDb } = await import("./db.server");
    if (!hasDatabase()) return demoEvents;
    const sql = await getDb();
    const rows = await sql<EventItem[]>`
      SELECT e.id, e.slug, e.titulo, e.descricao, e.local, e.cidade, e.data_evento, e.imagem_url
      FROM events e
      WHERE e.data_evento >= now() - interval '1 day'
      ORDER BY e.data_evento ASC
    `;
    return rows.map((r) => ({
      ...r,
      data_evento: new Date(r.data_evento).toISOString(),
    }));
  },
);

const eventBySlugSchema = z.object({ slug: z.string().min(1) });

export const getEventBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => eventBySlugSchema.parse(data))
  .handler(async ({ data }): Promise<EventItem | null> => {
    const { hasDatabase, getDb } = await import("./db.server");
    if (!hasDatabase()) {
      return demoEvents.find((e) => e.slug === data.slug) ?? null;
    }
    const sql = await getDb();
    const rows = await sql<EventItem[]>`
      SELECT e.id, e.slug, e.titulo, e.descricao, e.local, e.cidade, e.data_evento, e.imagem_url
      FROM events e
      WHERE e.slug = ${data.slug} AND e.data_evento >= now() - interval '1 day'
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return { ...rows[0], data_evento: new Date(rows[0].data_evento).toISOString() };
  });

const registerSchema = z.object({
  consentimento,
  compartilhamento,
  slug: z.string().min(1),
  nome: z.string().min(2, "Informe seu nome"),
  cidade: z.string().min(2, "Informe sua cidade"),
  estado: z.string().length(2, "Selecione o estado"),
  telefone: z.string().min(8, "Informe um telefone válido"),
});

export const registerEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => registerSchema.parse(data))
  .handler(async ({ data }) => {
    const { hasDatabase, getDb } = await import("./db.server");
    if (!hasDatabase()) {
      return { ok: true as const, demo: true as const };
    }
    const sql = await getDb();
    const event = await sql<{ id: number }[]>`
      SELECT id FROM events
      WHERE slug = ${data.slug} AND data_evento >= now() - interval '1 day'
      LIMIT 1
    `;
    if (event.length === 0) {
      return { ok: false as const, error: "Evento não encontrado" };
    }
    try {
      await sql`
        INSERT INTO event_registrations (event_id, nome, cidade, estado, telefone, compartilhamento)
        VALUES (${event[0].id}, ${data.nome}, ${data.cidade}, ${data.estado}, ${data.telefone},
                ${data.compartilhamento})
      `;
    } catch {
      return { ok: false as const, error: "Você já se inscreveu neste evento" };
    }
    return { ok: true as const, demo: false as const };
  });

// ----------------------------------------------------------------
// Abaixo-assinados
// ----------------------------------------------------------------
export const getPetitions = createServerFn({ method: "GET" }).handler(
  async (): Promise<PetitionItem[]> => {
    const { hasDatabase, getDb } = await import("./db.server");
    if (!hasDatabase()) return demoPetitions;
    const sql = await getDb();
    const rows = await sql<PetitionItem[]>`
      SELECT p.id, p.slug, p.titulo, p.descricao, p.imagem_url
      FROM petitions p
      WHERE p.ativo = TRUE
      ORDER BY p.created_at DESC
    `;
    return rows;
  },
);

const petitionBySlugSchema = z.object({ slug: z.string().min(1) });

export const getPetitionBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => petitionBySlugSchema.parse(data))
  .handler(async ({ data }): Promise<PetitionItem | null> => {
    const { hasDatabase, getDb } = await import("./db.server");
    if (!hasDatabase()) {
      return demoPetitions.find((p) => p.slug === data.slug) ?? null;
    }
    const sql = await getDb();
    const rows = await sql<PetitionItem[]>`
      SELECT p.id, p.slug, p.titulo, p.descricao, p.imagem_url
      FROM petitions p
      WHERE p.slug = ${data.slug} AND p.ativo = TRUE
      LIMIT 1
    `;
    return rows[0] ?? null;
  });

const signSchema = z.object({
  consentimento,
  compartilhamento,
  slug: z.string().min(1),
  nome: z.string().min(2, "Informe seu nome"),
  cidade: z.string().min(2, "Informe sua cidade"),
  estado: z.string().length(2, "Selecione o estado"),
  telefone: z.string().min(8, "Informe um telefone válido"),
});

export const signPetition = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => signSchema.parse(data))
  .handler(async ({ data }) => {
    const { hasDatabase, getDb } = await import("./db.server");
    if (!hasDatabase()) {
      return { ok: true as const, demo: true as const };
    }
    const sql = await getDb();
    const petition = await sql<{ id: number }[]>`
      SELECT id FROM petitions WHERE slug = ${data.slug} AND ativo = TRUE LIMIT 1
    `;
    if (petition.length === 0) {
      return { ok: false as const, error: "Abaixo-assinado não encontrado" };
    }
    try {
      await sql`
        INSERT INTO petition_signatures (petition_id, nome, cidade, estado, telefone, compartilhamento)
        VALUES (${petition[0].id}, ${data.nome}, ${data.cidade}, ${data.estado}, ${data.telefone},
                ${data.compartilhamento})
      `;
    } catch {
      return { ok: false as const, error: "Você já assinou este abaixo-assinado" };
    }
    return { ok: true as const, demo: false as const };
  });
