//memo.mjs는 명령이 실행되는 코드이다. 예시) mode memo.mjs add '공부하기'
//storage.mjs에서 load()로 받은 파일로 add, list, done, remove를 하고 save()한다
import { load, save } from "./storage.mjs";
import fs from "node:fs/promises";

const memofile = load()
let n = memofile['n']

async function add(txt) {
    memofile[n+1] = `[${n+1}][]${txt}`
    memofile['n'] = n+1
    n = n+1
}
//memos.json의 할 일 목록 출력
async function list() {
    console.log(await fs.readFile(memofile, "utf-8"));
}
//할일 완료 표시 1: 공부하기 => 1: 공부하기 (완료!)
async function done(line) {
    memofile[line] = memofile[line] + '(완료!)'
}

save(memofile)