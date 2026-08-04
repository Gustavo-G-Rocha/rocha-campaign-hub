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

-- Remove abaixo-assinados de exemplo antigos (as assinaturas caem junto via CASCADE)
DELETE FROM petitions WHERE slug IN ('mais-seguranca', 'saude-para-todos');

-- Abaixo-assinado: Retirada da Mesa Solidária da Rua Dr. Muricy (Curitiba)
INSERT INTO petitions (slug, titulo, descricao, meta, imagem_url)
VALUES
  ('retirada-mesa-solidaria-dr-muricy',
   'Abaixo-assinado pela retirada da Mesa Solidária da Rua Dr. Muricy (Curitiba)',
   'Assine pela retirada da Mesa Solidária da Rua Dr. Muricy, no centro de Curitiba. Moradores e comerciantes relatam aumento da insegurança na região.',
   200, '/banner-mesa-solidaria.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Assinaturas já coletadas (respostas "Sim"; telefones repetidos são ignorados)
INSERT INTO petition_signatures (petition_id, nome, cidade, estado, telefone)
SELECT p.id, v.nome, v.cidade, v.estado, v.telefone
FROM petitions p
CROSS JOIN (VALUES
  ('Gileade Barbosa de Lima', 'Curitiba', 'PR', '41996015804'),
  ('Eduardo', 'Curitiba', 'PR', '41 995323490'),
  ('José Eduardo Ribeiro dos Santos', 'Curitiba', 'PR', '41997707585'),
  ('Jocelia kunseler', 'Curitiba', 'PR', '41998850170'),
  ('Ryan Kunseler dos Santos', 'Curitiba', 'PR', '41997938710'),
  ('André Henrique Barbosa', 'Curitiba', 'PR', '41988066750'),
  ('Jackson H. Takahashi', 'Curitiba', 'PR', '41998330763'),
  ('Nathália Cardoso', 'Curitiba', 'PR', '(41) 99943-0088'),
  ('JOUGLAS ELOY BRAUN', 'Curitiba', 'PR', '44999998069'),
  ('Anderson Cardoso', 'Curitiba', 'PR', '(41)99922-0548'),
  ('Marly de Lima Braun', 'Curitiba', 'PR', '41999889018'),
  ('Fabiano Nichetti de Souza', 'Curitiba', 'PR', '4192288548'),
  ('Ana Paula da Luz Domingues Braun', 'Curitiba', 'PR', '44999974745'),
  ('Régis Costa', 'Curitiba', 'PR', '41992710088'),
  ('Evaldo Correa', 'Curitiba', 'PR', '41996237735'),
  ('Ana Maria Martins', 'Curitiba', 'PR', '988143862'),
  ('Simone Duarte', 'Curitiba', 'PR', '4198762-7147'),
  ('Luanna Dalla Maria Ahmad', 'Curitiba', 'PR', '41995077200'),
  ('Paulo Roberto Franco', 'Curitiba', 'PR', '41 9 9982-2126'),
  ('Lucas Todeschini Cussolin', 'Curitiba', 'PR', '41999832780'),
  ('Patrica de Moras Pacheco', 'Curitiba', 'PR', '48996687446'),
  ('Ana Maria Germano de Souza Dantas', 'Curitiba', 'PR', '41998393000'),
  ('Bruno Gregório Dantas', 'Curitiba', 'PR', '44999917939'),
  ('wiland bornia', 'Curitiba', 'PR', '44998212947'),
  ('Rodrigo Kenji', 'Curitiba', 'PR', '41999735428'),
  ('Jocimara', 'Curitiba', 'PR', '41991243534'),
  ('Diego', 'Curitiba', 'PR', '41988180247'),
  ('Maria Carolina', 'Curitiba', 'PR', '47996095607'),
  ('Nicolas Pereira de Almeida', 'Curitiba', 'PR', '41999935243'),
  ('joão guilherme cavalli zanello', 'Curitiba', 'PR', '41992332906'),
  ('Guilherme Capistrano', 'Curitiba', 'PR', '41998748835'),
  ('Marcos Garcia Vilhena Silva', 'Curitiba', 'PR', '(41) 99231-9612'),
  ('Carlos Magno Ferreira Robinson', 'Curitiba', 'PR', '41985386378'),
  ('Felipe Gomes Brenny', 'Curitiba', 'PR', '41999294177'),
  ('Guylherme Henrique Rodrigues Itiberê da Cunha', 'Curitiba', 'PR', '41999760732'),
  ('Murilo purkot', 'Curitiba', 'PR', '41996139639'),
  ('Willian', 'Curitiba', 'PR', '41987919148'),
  ('Jênesis Pereira da Silva', 'Colombo', 'PR', '41 99835-0928'),
  ('Patricia Oliveira', 'Curitiba', 'PR', '41 98743-8028'),
  ('Gabriel Reynald da Silva', 'Curitiba', 'PR', '41992210412'),
  ('Thales Henrique Batista da Silva', 'Curitiba', 'PR', '41987054509'),
  ('Yvis Evelynn de Jesus de Oliveira', 'Curitiba', 'PR', '41 99172-0443'),
  ('Sergio Adriano', 'Curitiba', 'PR', '41988088929'),
  ('Diego Henrique do Prado', 'Curitiba', 'PR', '41992336356'),
  ('Murilo Stangherlin', 'Candói', 'PR', '42999275417'),
  ('Renan Pelaquim Bertolini', 'Curitiba', 'PR', '44997604732'),
  ('Arthur Gonçalves Passos', 'Curitiba', 'PR', '41999702143'),
  ('Vitorio Grellert de Moraes', 'Curitiba', 'PR', '41988236095'),
  ('Victor Fernandes', 'Curitiba', 'PR', '41987671341'),
  ('Luiz Zeilic Nabosne Yudesneider', 'Curitiba', 'PR', '41998673237'),
  ('Paula Souza', 'Curitiba', 'PR', '91992232830'),
  ('Rossano Pianaro', 'Curitiba', 'PR', '41997426610'),
  ('Matheus', 'Curitiba', 'PR', '41997146155'),
  ('Eduardo Kauê Martins Nery', 'Curitiba', 'PR', '(41) 99950-5719'),
  ('Leonardo Lincoln Rechi Santana', 'Curitiba', 'PR', '41-99990-0038'),
  ('Vitoria Nabosne', 'Curitiba', 'PR', '41998295641'),
  ('Edinéia', 'Curitiba', 'PR', '41998104412'),
  ('Luigi Gubert', 'Curitiba', 'PR', '41999626822'),
  ('Marco Gubert', 'Curitiba', 'PR', '41999723972'),
  ('Daniella Savi', 'Curitiba', 'PR', '41 998454655'),
  ('Josiane De Andrade Custódio', 'Curitiba', 'PR', '41995233048'),
  ('Priscila Barcik', 'Curitiba', 'PR', '41 8867-6293'),
  ('Marco Antonio Moreira', 'Curitiba', 'PR', '42998031347'),
  ('Estela Schwartz Haupt', 'Curitiba', 'PR', '47999957590'),
  ('Nayara Campos', 'Curitiba', 'PR', '47991714406'),
  ('Patrick', 'Curitiba', 'PR', '41988216626'),
  ('Tiago', 'Curitiba', 'PR', '21995674666'),
  ('Marco a. Gubert', 'Curitiba', 'PR', '41999723872'),
  ('RODRIGO AUGUSTO BRUNING', 'Curitiba', 'PR', '41984262902'),
  ('FRANCISCO CAYK RODRIGUES DA COSTA', 'Curitiba', 'PR', '41987864048'),
  ('Gustavo Luiz da Silva', 'Curitiba', 'PR', '41999770672'),
  ('Fabio', 'Curitiba', 'PR', '41998539111'),
  ('Henrique Bittencourt Mader Gonçalves', 'Curitiba', 'PR', '41996840284'),
  ('Gabriel Timm', 'Curitiba', 'PR', '41999638307'),
  ('Fabio gubert', 'Curitiba', 'PR', '41988263926'),
  ('Marco Aurélio Krambeck', 'Curitiba', 'PR', '47984110107'),
  ('Walace mendes', 'Curitiba', 'PR', '41987730071'),
  ('Sérgio', 'Curitiba', 'PR', '41999910351'),
  ('Raul', 'Curitiba', 'PR', '41999802146'),
  ('Michele Dias', 'Curitiba', 'PR', '41988579398'),
  ('Eloy', 'Curitiba', 'PR', '41992871564'),
  ('IZABEL zacarin Fernandes', 'Curitiba', 'PR', '41996855996'),
  ('Almeri Terezinha da Rocha', 'Curitiba', 'PR', '41 999989722'),
  ('Maria Eduarda Nicolini', 'Curitiba', 'PR', '41996034775')
) AS v(nome, cidade, estado, telefone)
WHERE p.slug = 'retirada-mesa-solidaria-dr-muricy'
ON CONFLICT (petition_id, telefone) DO NOTHING;