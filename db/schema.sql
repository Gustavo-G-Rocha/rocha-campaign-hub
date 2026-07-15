-- ============================================================
-- Banco de dados — Campanha Willian Rocha (Deputado Estadual)
-- Aplique este arquivo no seu Postgres:
--   psql "$DATABASE_URL" -f db/schema.sql
-- ============================================================

-- ------------------------------------------------------------
-- Voluntários
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS volunteers (
  id         SERIAL PRIMARY KEY,
  nome       TEXT NOT NULL,
  email      TEXT,
  telefone   TEXT NOT NULL,
  cidade     TEXT,
  bairro     TEXT,
  mensagem   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON volunteers (created_at DESC);

-- ------------------------------------------------------------
-- Eventos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  titulo      TEXT NOT NULL,
  descricao   TEXT,
  local       TEXT,
  cidade      TEXT,
  data_evento TIMESTAMPTZ NOT NULL,
  imagem_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_data_evento ON events (data_evento);

-- ------------------------------------------------------------
-- Abaixo-assinados
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS petitions (
  id         SERIAL PRIMARY KEY,
  slug       TEXT NOT NULL UNIQUE,
  titulo     TEXT NOT NULL,
  descricao  TEXT NOT NULL,
  meta       INTEGER NOT NULL DEFAULT 1000,
  imagem_url TEXT,
  ativo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS petition_signatures (
  id          SERIAL PRIMARY KEY,
  petition_id INTEGER NOT NULL REFERENCES petitions (id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  cidade      TEXT NOT NULL,
  estado      TEXT NOT NULL,
  telefone    TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (petition_id, telefone)
);

CREATE INDEX IF NOT EXISTS idx_signatures_petition ON petition_signatures (petition_id);

-- ------------------------------------------------------------
-- Dados de exemplo (opcional) — remova em produção se quiser
-- ------------------------------------------------------------
INSERT INTO events (slug, titulo, descricao, local, cidade, data_evento, imagem_url)
VALUES
  ('caminhada-pela-mudanca', 'Caminhada pela Mudança', 'Venha caminhar conosco e conversar sobre as propostas para a nossa região.', 'Praça Central', 'Curitiba', now() + interval '10 days', 'https://picsum.photos/seed/caminhada-pela-mudanca/1600/900'),
  ('reuniao-com-liderancas', 'Reunião com Lideranças', 'Encontro aberto para ouvir as demandas da comunidade.', 'Centro Comunitário', 'Londrina', now() + interval '20 days', 'https://picsum.photos/seed/reuniao-com-liderancas/1600/900')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO petitions (slug, titulo, descricao, meta, imagem_url)
VALUES
  ('mais-seguranca', 'Mais Segurança nos Bairros', 'Assine pela ampliação do policiamento e iluminação pública nos bairros do estado.', 5000, 'https://picsum.photos/seed/mais-seguranca/1600/900'),
  ('saude-para-todos', 'Saúde Pública de Qualidade', 'Apoie a melhoria dos postos de saúde e a redução das filas de espera.', 3000, 'https://picsum.photos/seed/saude-para-todos/1600/900')
ON CONFLICT (slug) DO NOTHING;