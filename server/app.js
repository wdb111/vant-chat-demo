var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// let msgList = [];
// let userList = 0;
let msgObj = {
  num: 0,
  msgList: []
}
app.get('/', function (req, res) {
  res.send('<h1>Welcome Realtime Server</h1>');
});
io.on('connection', function (socket) {
  console.log('a user connected');
  msgObj.num++;
  io.emit("message", msgObj);
  socket.on("login", function (newUserName) {
    console.log("a user login");
    let obj={
      num:msgObj.num,
      name:newUserName
    }
    io.emit("loginOk", obj);
  });
  socket.on("disconnect", function (e) {
    console.log("a user go out");
    console.log(e)
    msgObj.num--;
    if (msgObj.num === 0) {
      msgObj.msgList = []
    }
    console.log(msgObj)
    io.emit("message", msgObj);
  });
  socket.on("message", function (obj) {
    console.log(obj)
    msgObj.msgList.push(obj);
    io.emit("message", msgObj);
  });
});
http.listen(3000, function () {
  console.log('listening on *:3000');
});