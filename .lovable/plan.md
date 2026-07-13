## Site de campanha — Willian Rocha (Deputado Estadual)

Cópia da estética do pedrodeyrot.com aplicada a uma nova campanha, com backend em Postgres (SQL escrito no código, para você aplicar manualmente).

### Identidade visual (copiada da referência)
- **Cores**: fundo escuro/preto (`#161616`), herói com gradiente amarelo/âmbar (`#F5C542` → creme claro), texto de destaque em preto pesado, acento amarelo (`#EAB308`). Tudo em tokens semânticos no `src/styles.css` (nada de cor fixa nos componentes).
- **Tipografia**: títulos em fonte condensada/black bem pesada (estilo "PEDRO DEYROT"); corpo em sans-serif limpa.
- **Header**: barra escura fixa com logo "Willian **Rocha**" (segundo nome em amarelo) + menu à direita.
- **Botão flutuante de WhatsApp** no canto inferior direito.
- **Herói**: nome grande, "Pré-candidato a Deputado Estadual" com faixa amarela, foto recortada do candidato sobre o gradiente, dois CTAs (Seja Voluntário / Eventos).

### Estrutura de páginas (rotas TanStack)
```text
/                -> Home (herói, sobre, propostas, CTAs, prévia de eventos)
/voluntarios     -> Texto de chamada + formulário de cadastro de voluntário
/eventos         -> Lista de eventos (data, local, descrição)
/abaixo-assinados-> Lista de abaixo-assinados + página para assinar cada um
```
Cada rota terá `head()` próprio (title/description/OG) para SEO.

### Backend e banco (Postgres, sem Supabase)
- SQL versionado em `db/schema.sql` (você roda no seu Postgres). Grants incluídos.
- Conexão via server functions (`createServerFn`) usando `postgres` (client JS) e a variável de ambiente `DATABASE_URL` (guardada como secret).
- Operações: cadastrar voluntário, listar/criar eventos, listar abaixo-assinados e registrar assinaturas.

#### SQL (resumo do que será gerado)
```sql
-- Voluntários
CREATE TABLE volunteers (
  id            SERIAL PRIMARY KEY,
  nome          TEXT NOT NULL,
  email         TEXT,
  telefone      TEXT NOT NULL,
  cidade        TEXT,
  bairro        TEXT,
  mensagem      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Eventos
CREATE TABLE events (
  id            SERIAL PRIMARY KEY,
  titulo        TEXT NOT NULL,
  descricao     TEXT,
  local         TEXT,
  cidade        TEXT,
  data_evento   TIMESTAMPTZ NOT NULL,
  imagem_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Abaixo-assinados
CREATE TABLE petitions (
  id            SERIAL PRIMARY KEY,
  titulo        TEXT NOT NULL,
  descricao     TEXT NOT NULL,
  meta          INTEGER DEFAULT 1000,
  imagem_url    TEXT,
  ativo         BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE petition_signatures (
  id            SERIAL PRIMARY KEY,
  petition_id   INTEGER NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  email         TEXT,
  cidade        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (petition_id, email)
);
```
(O arquivo final incluirá índices e comentários. Painel admin de gestão de conteúdo pode ser uma fase 2, se você quiser.)

### Imagens que você precisa preparar
| Uso | Dimensão sugerida | Formato | Observação |
|---|---|---|---|
| Foto do candidato (herói) | 1200 × 1500 px | PNG (fundo recortado/transparente) | recorte do corpo, como no site de referência |
| Fundo/silhueta do herói | 1920 × 900 px | PNG/SVG | árvores/silhueta em branco (opcional) |
| Logo/símbolo da campanha | 512 × 512 px | PNG transparente | canto superior, tipo o "brasão" |
| Favicon | 48 × 48 px | ICO/PNG | ícone da aba |
| Imagem de cada evento | 1200 × 675 px (16:9) | JPG | card e página do evento |
| Imagem de cada abaixo-assinado | 1200 × 675 px (16:9) | JPG | card e página |
| OG image (compartilhamento) | 1200 × 630 px | JPG | prévia em redes sociais |
| Foto "Sobre / seção" (opcional) | 1000 × 1200 px | JPG | seção institucional |

Se você não tiver as imagens, posso gerar versões provisórias (herói, silhueta, logo) para o site já ficar visualmente completo.

### Fases de implementação
1. **Design system**: tokens de cor/tipografia no `styles.css` copiando a estética; header escuro + botão WhatsApp.
2. **Home**: herói com nome, faixa amarela "Deputado Estadual", CTAs e seções (sobre/propostas/prévia de eventos).
3. **Camada de dados**: `db/schema.sql` + client Postgres + server functions (voluntários, eventos, petições, assinaturas) usando `DATABASE_URL`.
4. **Voluntários**: formulário conectado ao banco com validação e feedback.
5. **Eventos**: listagem lendo do banco (com fallback caso o banco não esteja conectado no preview).
6. **Abaixo-assinados**: listagem + página de assinatura com contador de assinaturas/meta.
7. **SEO/finalização**: `head()` por rota, OG images, responsividade mobile.

### Detalhes técnicos
- Stack: TanStack Start (React 19) + Tailwind v4 + server functions.
- Banco: seu Postgres externo via `DATABASE_URL` (secret). O SQL fica em `db/schema.sql` para você aplicar.
- No preview, as páginas de dados terão fallback/exemplo até o `DATABASE_URL` ser configurado, para não quebrar a build.
