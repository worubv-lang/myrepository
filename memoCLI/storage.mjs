import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(import.meta.dirname, "memos.json");

export async function load() {
  try {
    const data = await fs.readFile(FILE, "utf-8");
    if (!data.trim()) return [];          // 빈 파일 처리
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") return []; // 파일이 아직 없으면 빈 목록
    throw err;                            // 그 외 에러는 숨기지 않고 던진다
  }
}

export async function save(memos) {
  await fs.writeFile(FILE, JSON.stringify(memos, null, 2));
}
