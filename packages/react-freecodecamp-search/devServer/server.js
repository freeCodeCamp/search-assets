require('babel-register');
const express = require('express');
const app = express();
const http = require('http').Server(app);
-app.use(express.static(`${process.cwd()}/devServer/build/public`));

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/devServer/build/public/index.html`);
});

http.listen(3000, () => {
  console.log('devServer listening on 3000');
});
