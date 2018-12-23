var express = require("express"),
    app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  app.use(express.static('/public/'));
});

io.on('connection', function(socket){
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
http.listen(3000, function(){
  console.log('listening on *:3000');
});