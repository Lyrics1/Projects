var socketio = {} ;

var  socket = require('socket.io');

//获取io 
socketio.getSocketIo = function(server){
		var io = socket.listen(server)
}

module.exports = socketio;