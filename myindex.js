const express = require('express');
const http = require('http');

app = express()
server = http.createServer(app);

app.get('/', function (req, res) {
  res.send('Hello /');
});

app.get('/hello.html', function (req, res) {
  res.send('Hello World');
});

server.listen(8000, function () {
  console.log('Express server listening on port ' + server.address().port);
});
