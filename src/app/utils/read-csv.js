import fs from "node:fs";
import { parse } from "csv-parse";

const parser = fs.createReadStream("src/assets/example.csv").pipe(
  parse({
    delimiter: ",",
    columns: true,
  })
);

async function readCsv() {
  const results = [];

  for await (const record of parser) {
    results.push(record);
  }

  return results;
}

const data = await readCsv();

fetch("http://localhost:3334/upload", {
  method: "POST",
  body: JSON.stringify({ data }),
});
