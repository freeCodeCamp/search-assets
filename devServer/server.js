require('babel-register');

const express = require('express');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

app.use(express.static(`${process.cwd()}/devServer/build/public`));

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/devServer/build/public/index.html`);
});

http.listen(3000, () => {
  console.log('devServer listening on 3000');
});
