import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadCsv, type CsvColumn } from "@/lib/csv";

export type DataColumn<T> = CsvColumn<T>;

type DataTableProps<T> = {
  columns: DataColumn<T>[];
  rows: T[];
  /** Nome do arquivo gerado ao exportar (sem extensão). */
  filename: string;
  loading?: boolean;
  emptyMessage?: string;
  /** Ações extras renderizadas na última coluna de cada linha. */
  renderActions?: (row: T) => React.ReactNode;
};

/** Planilha genérica: busca, contagem e exportação para CSV. */
export function DataTable<T>({
  columns,
  rows,
  filename,
  loading,
  emptyMessage = "Nenhum registro ainda.",
  renderActions,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      columns.some((col) =>
        String(col.value(row) ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [rows, columns, query]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filtered.length} de {rows.length} registro{rows.length === 1 ? "" : "s"}
        </span>
        <Button
          type="button"
          variant="outline"
          onClick={() => downloadCsv(filename, columns, filtered)}
          disabled={filtered.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.label} className="whitespace-nowrap">
                  {col.label}
                </TableHead>
              ))}
              {renderActions && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="py-8 text-center text-muted-foreground"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="py-8 text-center text-muted-foreground"
                >
                  {query ? "Nenhum resultado para esta busca." : emptyMessage}
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              filtered.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.label} className="align-top">
                      {String(col.value(row) ?? "")}
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell className="whitespace-nowrap text-right">
                      {renderActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
