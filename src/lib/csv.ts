export type CsvColumn<T> = {
  label: string;
  value: (row: T) => string | number | boolean | null | undefined;
};

function escapeCell(raw: string | number | boolean | null | undefined) {
  const text = raw === null || raw === undefined ? "" : String(raw);
  return `"${text.replace(/"/g, '""')}"`;
}

/** Gera CSV com `;` — separador que o Excel em pt-BR abre sem pedir importação. */
export function toCsv<T>(columns: CsvColumn<T>[], rows: T[]) {
  const header = columns.map((c) => escapeCell(c.label)).join(";");
  const body = rows.map((row) => columns.map((c) => escapeCell(c.value(row))).join(";"));
  return [header, ...body].join("\r\n");
}

export function downloadCsv<T>(filename: string, columns: CsvColumn<T>[], rows: T[]) {
  // BOM UTF-8: sem ele o Excel quebra os acentos.
  const blob = new Blob(["﻿" + toCsv(columns, rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** "2026-08-23T19:00:00-03:00" -> "23/08/2026 19:00" */
export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
