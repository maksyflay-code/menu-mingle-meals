import { access, cp, mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

// Fail closed: never upload a server bundle or a client-only shell as a site.
const candidates = ["dist/client", ".output/client", ".output/public"];
let source;
for (const candidate of candidates) {
  try {
    const home = await readFile(path.join(candidate, "index.html"), "utf8");
    await access(path.join(candidate, "entrega/index.html"));
    if (!home.includes("X-Burguer") && !home.includes("Lanches")) continue;
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
console.log(`Locaweb: envie TODO o conteúdo de ${destination}/, incluindo .htaccess, para a pasta pública do domínio.`);