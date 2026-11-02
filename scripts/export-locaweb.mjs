import { access, cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

// Fail closed: never upload a server bundle or a client-only shell as a site.
const candidates = ["dist/client", ".output/client", ".output/public"];
let source;
for (const candidate of candidates) {
  try {
    const home = await readFile(path.join(candidate, "index.html"), "utf8");
    await access(path.join(candidate, "entrega/index.html"));
    if (!home.includes("PARRILLA - BLACK")) continue;
    source = candidate;
    break;
  } catch {
    // Another supported output location may contain the generated pages.
  }
}
if (!source) {
  throw new Error("Não foram geradas as páginas estáticas do cardápio e da entrega. Confira os erros do build; não envie apenas a pasta assets.");
}

const destination = "dist/locaweb";
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, {
  recursive: true,
  filter: (entry) => ![".git", ".lovable", "_worker.js", "wrangler.json", "wrangler.jsonc"].includes(path.basename(entry)),
});
await cp("hosting/locaweb.htaccess", path.join(destination, ".htaccess"));

// Relative Lovable asset URLs need real files on an external host. Preserve
// their paths so both prerendered HTML and hydrated React use the same image.
async function exportAssets(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  for (const entry of entries) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await exportAssets(filename);
      continue;
    }
    if (!entry.name.endsWith(".asset.json")) continue;
    const asset = JSON.parse(await readFile(filename, "utf8"));
    if (!asset.url?.startsWith("/__l5e/assets-v1/")) continue;
    const relative = asset.url.slice(1);
    if (relative.split("/").includes("..") || relative.includes("\\")) {
      throw new Error(`Caminho de imagem inválido: ${filename}`);
    }
    const target = path.join(destination, relative);
    try {
      await access(target);
      continue;
    } catch {
      // The ordinary client build does not include CDN binaries.
    }
    const response = await fetch(new URL(asset.url, "https://menu-mingle-meals.lovable.app"), {
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok || !response.headers.get("content-type")?.startsWith(asset.content_type)) {
      throw new Error(`Não foi possível baixar ${asset.original_filename} (${response.status}). Não envie esta exportação incompleta.`);
    }
    const data = new Uint8Array(await response.arrayBuffer());
    if (data.length !== asset.size) throw new Error(`Imagem incompleta: ${asset.original_filename}`);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, data);
    console.log(`Imagem incluída: ${asset.original_filename}`);
  }
}
await exportAssets("src/assets");
console.log(`Locaweb: envie TODO o conteúdo de ${destination}/, incluindo .htaccess, para a pasta pública do domínio.`);