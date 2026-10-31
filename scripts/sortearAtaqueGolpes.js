import { readFileSync, writeFileSync } from "node:fs";

const caminho = "data/testes/golpes.json";
const golpes = JSON.parse(readFileSync(caminho, "utf-8"));

for (const golpe of golpes) {
    golpe.ataqueGolpe = Math.round((0.5 + Math.random()) * 100) / 100;
}

writeFileSync(caminho, JSON.stringify(golpes, null, 2) + "\n", "utf-8");
console.log(`${golpes.length} golpes atualizados com ataqueGolpe entre 1 e 3.`);