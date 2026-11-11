mircosoft azure에서 제공하는 ocr 엔진를 사용하여 만든 프로젝트입니다. (미완성입니다)  
구현하려는 앱: 영상을 업로드 하면 영상의 글씨를 텍스트로 변환하는 앱  

코드 요약:  
| 파일 | 역할 |  
| config.mjs | 환경 변수를 읽고, 빠진 게 있으면 시작 단계에서 바로 에러를 냅니다. |  
| storage.mjs | videos, results 컨테이너 접근과 결과 JSON 저장·읽기를 담당합니다. |  
| frames.mjs | ffmpeg를 실행해 영상을 frame_00001.jpg 같은 이미지로 쪼갭니다. |  
| ocr.mjs | 이미지 1장을 Vision에 보내 글자를 받고, 동시 호출 수를 제한합니다(mapLimit). |  
| merge.mjs | 프레임마다 나온 비슷한 글자를 하나로 합치고 시작/종료 시간을 계산합니다. |  
| createJob / startJob / getJob | HTTP API 3개입니다. |  
| processVideo | 큐 메시지가 오면 실행되는 실제 처리 파이프라인입니다. |  
| web/index.html | 촬영·업로드·진행률·폴링·결과 표시를 하는 화면입니다. |  

