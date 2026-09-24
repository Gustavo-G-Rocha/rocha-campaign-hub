import { createFileRoute } from "@tanstack/react-router";

// Serve as imagens enviadas pelo painel (/admin), guardadas na tabela `images`.
// Cada id nunca muda de conteúdo, então o cache pode ser permanente.
export const Route = createFileRoute("/imagens/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = Number(params.id);
        if (!Number.isInteger(id) || id <= 0) {
          return new Response("Not found", { status: 404 });
        }

        const { hasDatabase, getDb } = await import("@/lib/db.server");
        if (!hasDatabase()) return new Response("Not found", { status: 404 });

        const sql = await getDb();
        const [row] = await sql<{ mime: string; data: Uint8Array }[]>`
          SELECT mime, data FROM images WHERE id = ${id}
        `;
        if (!row) return new Response("Not found", { status: 404 });

        return new Response(new Uint8Array(row.data), {
          headers: {
            "content-type": row.mime,
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
