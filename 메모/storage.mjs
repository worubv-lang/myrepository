// storage.mjs는 save(), load()함수를 제공한다.
import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(import.meta.dirname, "memos.json");

export async function load() {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf-8"));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    console.log(err)
  }
}

export async function save(memos) {
  await fs.writeFile(FILE, JSON.stringify(memos, null, 2));
}

