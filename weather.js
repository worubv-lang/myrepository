

function getweather(src){
    fetch('https://goweather.xyz/v2/weather/' + src)
    .then((response) => response.json())
    .then((data) => {
        h = document.getElementById('loc')
        h.innerHTML = '지역:' + src

        tem = document.getElementById('tem')
        tem.innerHTML = "기온은 "+ data['temperature'];

        des = document.getElementById('des');
        des.innerHTML="날씨는 "+data['description'];  
    });

}
