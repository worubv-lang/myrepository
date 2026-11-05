//math.mjs의 함수를 불러와서 계산을 실행한다.
import * as math from "./math.mjs";
import express from 'express' //mjs에서 모듈가져오기는 request 가 아니다
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

// mjs 환경에서 __dirname 구현하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, 'calc.html'))
})

// query를 쓴 호출: http://localhost:3000/add?a=1&b=2
app.get("/add", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({ error: "a, b는 숫자여야 합니다" });
  }
  res.json({ result: math.add(a, b) });
  
});
app.get("/sub", (req,res)=>{
    const a = Number(req.query.a);
    const b = Number(req.query.b);
    if (Number.isNaN(a) || Number.isNaN(b)) {
        return res.status(400).json({ error: "a, b는 숫자여야 합니다" });
    }
    res.json({ result: math.sub(a, b) });
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});