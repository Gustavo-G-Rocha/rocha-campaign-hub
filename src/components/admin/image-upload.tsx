import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const MAX_WIDTH = 1920;
const QUALITY = 0.82;

// Reduz a imagem para no máximo MAX_WIDTH de largura e converte para WebP,
// deixando o upload leve e o site rápido. Devolve um data URL.
async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const webp = canvas.toDataURL("image/webp", QUALITY);
  // Navegadores sem suporte a WebP devolvem PNG; nesse caso usa JPEG.
  return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", QUALITY);
}

export function ImageUpload({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Escolha um arquivo de imagem.");
      return;
    }
    setProcessing(true);
    try {
      onChange(await compressImage(file));
    } catch {
      toast.error("Não foi possível ler essa imagem.");
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="relative overflow-hidden rounded-md border">
          <img src={value} alt="Pré-visualização" className="h-40 w-full object-cover" />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => onChange("")}
          >
            <X className="mr-1 h-4 w-4" />
            Remover
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-24 border-dashed"
          disabled={processing}
          onClick={() => inputRef.current?.click()}
        >
          {processing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="mr-2 h-4 w-4" />
          )}
          {processing ? "Processando..." : "Enviar imagem do computador"}
        </Button>
      )}
    </div>
  );
}
