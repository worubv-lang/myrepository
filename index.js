const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/aaa',function(req,res){
  res.send('hello');
});
app.get('/weather',(req,res)=>{
  res.sendFile(__dirname + '/weather.html')
})
app.get('/index',(req,res)=>{
  res.sendFile(__dirname + '/index.html')
})
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});