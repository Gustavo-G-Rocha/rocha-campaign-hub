// Otimiza as imagens do site.
//
// Os WebP gerados são versionados, então só é preciso rodar isto quando alguma
// imagem de origem mudar. O sharp não é dependência do projeto de propósito
// (binário nativo pesado, usado só aqui) — instale na hora:
//
//   npm i -D sharp && node scripts/otimizar-imagens.mjs && npm rm sharp
//
//
// Regra de formato:
//   WebP  -> tudo que é servido dentro do site, mais os ícones do manifest (só
//            Chrome/Edge/Samsung Internet leem o manifest, e todos suportam WebP;
//            o iOS ignora o manifest e usa o apple-touch-icon).
//   PNG   -> apple-touch-icon: o iOS só aceita PNG. Recompressão lossless.
//   JPEG  -> og-image: preview de link no WhatsApp/Facebook não é confiável com WebP.
//   .ico  -> favicon fica como está.
import sharp from "sharp";
import { statSync } from "node:fs";

const kb = (p) => Math.round(statSync(p).size / 1024);
const linhas = [];

async function otimizar(src, out, fn) {
  const antes = kb(src);
  await fn();
  const depois = kb(out);
  linhas.push({
    arquivo: out,
    antes: `${antes} KB`,
    depois: `${depois} KB`,
    ganho: `${Math.round((1 - depois / antes) * 100)}%`,
  });
}

// ---------- WebP ----------

// Hero da home: é o LCP. Três larguras pra alimentar o srcset.
for (const w of [480, 768, 953]) {
  const out = `src/assets/hero-cover-${w}.webp`;
  await otimizar("src/assets/hero-cover.png", out, () =>
    sharp("src/assets/hero-cover.png")
      .resize({ width: w })
      .webp({ quality: 82, effort: 6 })
      .toFile(out),
  );
}

// Logo: renderizado a 36px (header) e 44px (footer). 88px cobre telas 2x.
await otimizar("src/assets/missao-logo.png", "src/assets/missao-logo.webp", () =>
  sharp("src/assets/missao-logo.png")
    .resize({ width: 88 })
    .webp({ quality: 88, effort: 6 })
    .toFile("src/assets/missao-logo.webp"),
);

// QR Code: lossless — artefato de compressão atrapalha a leitura pela câmera.
await otimizar("src/assets/doar-qrcode.png", "src/assets/doar-qrcode.webp", () =>
  sharp("src/assets/doar-qrcode.png")
    .webp({ lossless: true, effort: 6 })
    .toFile("src/assets/doar-qrcode.webp"),
);

// Banner das petições (entra como background-image via imagem_url do banco).
await otimizar("public/banner-mesa-solidaria.jpg", "public/banner-mesa-solidaria.webp", () =>
  sharp("public/banner-mesa-solidaria.jpg")
    .webp({ quality: 80, effort: 6 })
    .toFile("public/banner-mesa-solidaria.webp"),
);

// Ícones do manifest. São fotos, então nada de paleta indexada (bandearia a pele).
// Os PNGs de origem moram fora de public/ porque tudo em public/ vai pro deploy.
for (const [src, out, tamanho] of [
  ["imagens-originais/icon-192.png", "public/icon-192.webp", 192],
  ["imagens-originais/icon-512.png", "public/icon-512.webp", 512],
]) {
  await otimizar(src, out, () =>
    sharp(src)
      .resize({ width: tamanho, height: tamanho, fit: "cover" })
      .webp({ quality: 82, effort: 6 })
      .toFile(out),
  );
}

// ---------- mesmo formato, só recomprimido ----------
// Também partem de imagens-originais/ para que rodar o script duas vezes não
// recomprima o resultado da vez anterior (JPEG perde qualidade a cada passada).

await otimizar("imagens-originais/apple-touch-icon.png", "public/apple-touch-icon.png", () =>
  sharp("imagens-originais/apple-touch-icon.png")
    .resize({ width: 180, height: 180, fit: "cover" })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile("public/apple-touch-icon.png"),
);

await otimizar("imagens-originais/og-image.jpg", "public/og-image.jpg", () =>
  sharp("imagens-originais/og-image.jpg")
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile("public/og-image.jpg"),
);

console.table(linhas);
