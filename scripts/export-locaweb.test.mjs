import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, access, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const exporter = fileURLToPath(new URL("./export-locaweb.mjs", import.meta.url));

test("export contains both static routes, Apache config and assets, never Worker code", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "locaweb-export-"));
  try {
    await mkdir(path.join(cwd, "dist/client/entrega"), { recursive: true });
    await mkdir(path.join(cwd, "dist/client/assets"));
    await mkdir(path.join(cwd, "hosting"));
    await writeFile(path.join(cwd, "hosting/locaweb.htaccess"), "DirectoryIndex index.html");
    await writeFile(path.join(cwd, "dist/client/index.html"), "<h1>PARRILLA - BLACK</h1>");
    await writeFile(path.join(cwd, "dist/client/entrega/index.html"), "Entrega");
    await writeFile(path.join(cwd, "dist/client/assets/site.js"), "export {};");
    await writeFile(path.join(cwd, "dist/client/_worker.js"), "private server");
    await mkdir(path.join(cwd, "src/assets"), { recursive: true });
    await mkdir(path.join(cwd, "dist/client/__l5e/assets-v1/test"), { recursive: true });
    await writeFile(path.join(cwd, "dist/client/__l5e/assets-v1/test/logo.jpg"), "logo original");
    await writeFile(path.join(cwd, "src/assets/logo.jpg.asset.json"), JSON.stringify({ url: "/__l5e/assets-v1/test/logo.jpg" }));
    const result = spawnSync(process.execPath, [exporter], { cwd, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(await readFile(path.join(cwd, "dist/locaweb/entrega/index.html"), "utf8"), "Entrega");
    await access(path.join(cwd, "dist/locaweb/assets/site.js"));
    await access(path.join(cwd, "dist/locaweb/.htaccess"));
    assert.equal(await readFile(path.join(cwd, "dist/locaweb/__l5e/assets-v1/test/logo.jpg"), "utf8"), "logo original");
    await assert.rejects(access(path.join(cwd, "dist/locaweb/_worker.js")));
    await writeFile(path.join(cwd, "dist/client/index.html"), '<div id="root"></div>');
    const invalid = spawnSync(process.execPath, [exporter], { cwd, encoding: "utf8" });
    assert.notEqual(invalid.status, 0);
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});