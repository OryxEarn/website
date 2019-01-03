var express = require("express"),
    app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;
var num = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
  app.use(express.static('public/'));
});

io.on('connection', function(socket){
	username = "Guest" + num.toString(16);
	num++;
	io.to(`${socket.id}`).emit("connect", num.toString(16));
	socket.on('message', function(msg, id){
		if (msg.slice(0, 3) == "/w ") {
			wid = msg.split(" ")[1];
			msg = msg.split(" ").slice(2).join(" ");
			io.to(`${wid}`).emit('whisper', msg, wid, id);
			io.to(`${socket.id}`).emit('whisper', msg, wid, id);
		} else {
			io.emit('message', msg, id);
		}
	});
	var online = 0;
	for (let i in io.sockets.clients().sockets) {
		online ++;
	}
	io.emit("online", online);
	socket.on('disconnect', function(){
		var online = 0;
		for (let i in io.sockets.clients().sockets) {
			online ++;
		}
		io.emit("online", online);
	});
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});