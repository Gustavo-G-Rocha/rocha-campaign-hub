import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ----------------------------------------------------------------
// Tipos (DTOs)
// ----------------------------------------------------------------
export type EventItem = {
  id: number;
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
  meta: number;
  imagem_url: string | null;
  assinaturas: number;
};

// ----------------------------------------------------------------
// Dados de exemplo (usados quando DATABASE_URL não está configurada)
// ----------------------------------------------------------------
const demoEvents: EventItem[] = [
  {
    id: 1,
    titulo: "Caminhada pela Mudança",
    descricao:
      "Venha caminhar conosco e conversar sobre as propostas para a nossa região.",
    local: "Praça Central",
    cidade: "Curitiba",
    data_evento: new Date(Date.now() + 10 * 864e5).toISOString(),
    imagem_url: null,
  },
  {
    id: 2,
    titulo: "Reunião com Lideranças",
    descricao: "Encontro aberto para ouvir as demandas da comunidade.",
    local: "Centro Comunitário",
    cidade: "Londrina",
    data_evento: new Date(Date.now() + 20 * 864e5).toISOString(),
    imagem_url: null,
  },
];

const demoPetitions: PetitionItem[] = [
  {
    id: 1,
    slug: "mais-seguranca",
    titulo: "Mais Segurança nos Bairros",
    descricao:
      "Assine pela ampliação do policiamento e iluminação pública nos bairros do estado.",
    meta: 5000,
    imagem_url: null,
    assinaturas: 1240,
  },
  {
    id: 2,
    slug: "saude-para-todos",
    titulo: "Saúde Pública de Qualidade",
    descricao:
      "Apoie a melhoria dos postos de saúde e a redução das filas de espera.",
    meta: 3000,
    imagem_url: null,
    assinaturas: 870,
  },
];

// ----------------------------------------------------------------
// Voluntários
// ----------------------------------------------------------------
const volunteerSchema = z.object({
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
    const { hasDatabase, getSql } = await import("./db.server");
    if (!hasDatabase()) {
      return { ok: true as const, demo: true as const };
    }
    const sql = getSql();
    await sql`
      INSERT INTO volunteers (nome, telefone, email, cidade, bairro, mensagem)
      VALUES (${data.nome}, ${data.telefone}, ${data.email || null},
              ${data.cidade || null}, ${data.bairro || null}, ${data.mensagem || null})
    `;
    return { ok: true as const, demo: false as const };
  });

// ----------------------------------------------------------------
// Eventos
// ----------------------------------------------------------------
export const getEvents = createServerFn({ method: "GET" }).handler(
  async (): Promise<EventItem[]> => {
    const { hasDatabase, getSql } = await import("./db.server");
    if (!hasDatabase()) return demoEvents;
    const sql = getSql();
    const rows = await sql<EventItem[]>`
      SELECT id, titulo, descricao, local, cidade, data_evento, imagem_url
      FROM events
      ORDER BY data_evento ASC
    `;
    return rows.map((r) => ({
      ...r,
      data_evento: new Date(r.data_evento).toISOString(),
    }));
  },
);

// ----------------------------------------------------------------
// Abaixo-assinados
// ----------------------------------------------------------------
export const getPetitions = createServerFn({ method: "GET" }).handler(
  async (): Promise<PetitionItem[]> => {
    const { hasDatabase, getSql } = await import("./db.server");
    if (!hasDatabase()) return demoPetitions;
    const sql = getSql();
    const rows = await sql<PetitionItem[]>`
      SELECT p.id, p.slug, p.titulo, p.descricao, p.meta, p.imagem_url,
             COUNT(s.id)::int AS assinaturas
      FROM petitions p
      LEFT JOIN petition_signatures s ON s.petition_id = p.id
      WHERE p.ativo = TRUE
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    return rows;
  },
);

const signSchema = z.object({
  slug: z.string().min(1),
  nome: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  cidade: z.string().optional().or(z.literal("")),
});

export const signPetition = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => signSchema.parse(data))
  .handler(async ({ data }) => {
    const { hasDatabase, getSql } = await import("./db.server");
    if (!hasDatabase()) {
      return { ok: true as const, demo: true as const };
    }
    const sql = getSql();
    const petition = await sql<{ id: number }[]>`
      SELECT id FROM petitions WHERE slug = ${data.slug} AND ativo = TRUE LIMIT 1
    `;
    if (petition.length === 0) {
      return { ok: false as const, error: "Abaixo-assinado não encontrado" };
    }
    try {
      await sql`
        INSERT INTO petition_signatures (petition_id, nome, email, cidade)
        VALUES (${petition[0].id}, ${data.nome}, ${data.email || null}, ${data.cidade || null})
      `;
    } catch {
      return { ok: false as const, error: "Você já assinou este abaixo-assinado" };
    }
    return { ok: true as const, demo: false as const };
  });