할 일을 저장하고 수정할 수 있는 CLI프로그램입니다.

index.mjs
사용방법: 터미널에서 아래의 방법처럼 add, list, done, remove 사용

add: 할 일을 추가
node index.mjs add "추가할 일"

list: 저장된 할 일 보기
node index.mjs list

done 완료한 일의 id번호: 완료한 일 표시
node index.mjs done 1

remove 삭제할 일의 id번호: 일을 삭제
node index.mjs remove 1

storage.mjs
json파일을 주고 저장하는 save(), load(file) 함수를 index.mjs에 export한다.

