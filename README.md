-11/05일 공부: 

mycalc.mjs, math.mjs, calc.html:

nodemon mycalc.mjs 를 실행하고 localhost:3000으로 접속하면 calc.html 파일이 전송된다. calc.html에서 a,b값을 입력하고 버튼을 누르면 /add, /sub로 이동하는 링크는 쿼리가 추가된 주소로 바뀐다. 바뀐 주소로 이동하면 a,b값을 계산한 결과를 볼 수 있다.

weather.html, weather.js:

weather.html에는 weather.js파일을 받아들인다. weather.js에는 getweather(src)함수가 있다. 이 함수는 'https://goweather.xyz/v2/weather/' 에 src(지역의 이름이 들어갈 파라미터) api를 받아 html을 변경한다.
