$(document).ready(function(){
	var socket = io();
	$('#sendmsg').click(function(){
		console.log(socket.username);
		//$('#m').val("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
		var msg = $('#m').val();
		socket.emit('message', msg, socket.id);
		$('#m').val('');
		return false;
	});
	socket.on('you', function(msg){
		console.log(msg);
	});
	socket.on('message', function(msg, id){
		/*if( ($("#chat-window")[0].scrollHeight - $("#chat-window")[0].scrollTop - $("#chat-window")[0].clientHeight) < 200){
			$("#chat-window").animate({ scrollTop: $('#chat-window')[0].scrollHeight}, 400);
		}*/
		var html = "<li class='chatmsg'>" + id + ":" + "<br>" + msg + "</li>";
		$('#messages').append(html);
	});
	socket.on('whisper', function(msg, wid, id){
		/*if( ($("#chat-window")[0].scrollHeight - $("#chat-window")[0].scrollTop - $("#chat-window")[0].clientHeight) < 200){
			$("#chat-window").animate({ scrollTop: $('#chat-window')[0].scrollHeight}, 400);
		}*/
		var html;
		if (socket.id == id) {
			var html = "<li class='chatmsg'>You whisper to " + wid + ":" + "<br>" + msg + "</li>";
		} else {
			var html = "<li class='chatmsg'>" + id + " whispers to you:" + "<br>" + msg + "</li>";
		}
		$('#messages').append(html);
	});
	socket.on("online", function(online) {
		document.getElementById("online").innerText = "Online: " + online;
	})
});