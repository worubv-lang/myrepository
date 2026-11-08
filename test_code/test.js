
/*// order1.mjs
console.log("A");
setTimeout(() => console.log("B (타이머 0ms)"), 0);
console.log("C");
//setTimeout이 0ms여도 콜백은 현재 실행 중인 코드가 전부 끝난 뒤에야 실행됩니다. 
// 콜백은 일단 큐에 들어가고, 스택이 빌 때까지 기다리기 때문입니다.
*/
// promise1.mjs
function wait(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error("시간은 0 이상이어야 합니다"));
      return;
    }
    setTimeout(() => resolve(`${ms}ms 지남`), ms);
  });
}

wait(1000)
  .then((msg) => {
    console.log(msg);       // "1000ms 지남"
    return wait(500);       // Promise를 반환하면 그게 끝날 때까지 다음 then이 기다림
  })
  .then((msg) => console.log(msg))   // "500ms 지남"
  .catch((err) => console.error("실패:"+ err.message))
  .finally(() => console.log("정리 작업 (성공/실패 무관)"));
