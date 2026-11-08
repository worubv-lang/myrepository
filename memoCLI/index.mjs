import { load, save } from "./storage.mjs";

const [command, ...rest] = process.argv.slice(2);
const arg = rest.join(" ");               // 따옴표 없이 입력해도 전체를 하나로
const memos = await load();               // [{ id, text, done }, ...]

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseId(value, usage) {
  const id = Number(value);
  if (!value || !Number.isInteger(id)) fail(usage);
  return id;
}

switch (command) {
  case "add": {
    if (!arg) fail("사용법: node memo.mjs add <내용>");
    const id = Math.max(0, ...memos.map((m) => m.id)) + 1;
    memos.push({ id, text: arg, done: false });
    await save(memos);
    console.log(`추가됨: [${id}] ${arg}`);
    break;
  }

  case "list": {
    if (memos.length === 0) {
      console.log("메모가 없습니다.");
      break;
    }
    for (const { id, done, text } of memos) {
      console.log(`[${id}] [${done ? "x" : " "}] ${text}`);
    }
    break;
  }

  case "done": {
    const id = parseId(arg, "사용법: node memo.mjs done <id>");
    const memo = memos.find((m) => m.id === id);
    if (!memo) fail(`id ${id} 메모를 찾을 수 없습니다.`);
    memo.done = true;
    await save(memos);
    console.log(`완료: [${memo.id}] ${memo.text}`);
    break;
  }

  case "remove": {
    const id = parseId(arg, "사용법: node memo.mjs remove <id>");
    const target = memos.find((m) => m.id === id);
    if (!target) fail(`id ${id} 메모를 찾을 수 없습니다.`);
    await save(memos.filter((m) => m.id !== id));
    console.log(`삭제됨: [${target.id}] ${target.text}`);
    break;
  }

  default:
    fail("명령: add | list | done | remove");
}
