//math.mjs의 함수를 불러와서 계산을 실행한다.
import *as math from "./math.mjs";
import express from 'express' //mjs에서 모듈가져오기는 request 가 아니다
const app = express();
app.get("/add", (req,res)=>{
    res.send(math.add(1,2))
})
app.get("/subtraction",(req,res)=>{
    res.send(math.sub(3,5))
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});