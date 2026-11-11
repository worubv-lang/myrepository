//fs를 mjs에서 사용하는 코드
import fs from "node:fs/promises";

// 쓰기 (덮어쓰기)
await fs.writeFile("test.json", "첫 줄\n", "utf-8");

// 이어쓰기
await fs.appendFile("test.json", "둘째 줄\n", "utf-8");

// 읽기
const text = await fs.readFile("test.json", "utf-8");
console.log(text);

// 폴더 만들기 (이미 있어도 에러 안 나게)
await fs.mkdir("data", { recursive: true });

// 폴더 내용 목록
const files = await fs.readdir(".");
console.log(files);

// 파일 정보
const info = await fs.stat("test.json");
console.log(info.size, info.isFile(), info.mtime);

// 삭제
//await fs.rm("test.json");
