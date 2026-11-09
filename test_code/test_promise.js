const fs = require("node:fs/promises");
//const fs = require('fs')

// callbackhell() : 파일 읽기 → 변환 → 다른 파일에 쓰기 → 확인
function callbackhell(){
    fs.readFile("a.txt", "utf-8", (err, text) => {
        if (err) return console.error(err);
        const upper = text.toUpperCase();
        fs.writeFile("b.txt", upper, (err) => {
            if (err) return console.error(err);
            fs.stat("b.txt", (err, info) => {
                if (err) return console.error(err);
                console.log("완료, 크기:", info.size);
            });
        });
    });
}

//callbackhell()을 promise로 바꾼 함수
function promise(){
    fs.readFile('a.txt','utf-8')
        .then((text)=>{
            fs.writeFile('b.txt', text.toUpperCase());
        })
        .then(()=>{
            return fs.stat('b.txt');
        })
        .then((info)=>{
            console.log("완료, 크기:", info.size);
        })
        .catch((err)=>{
            console.log(err);
        })
}

//callbackhell()을 async,await로 바꾼 함수
async function async1(){
    try{
        const file = await fs.readFile('a.txt','utf-8')  
        await fs.writeFile('b.txt', file.toUpperCase())      
        const info = await fs.stat('b.txt')
        console.log("완료, 크기:", info.size);
    }
    catch(err){
        console.log(err);
    }
}

//callbackhell()
//promise()
async1()
console.log("process 호출 직후");