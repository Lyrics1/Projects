// //websocket 实现消息提示

// var ws = new webSocket("ws://localhost:3000");
// //如果连接成功
// if(ws.readyState ==1){
// 	ws.onopen=function(){
// 		console.log("success")
// 		ws.send("链接成功");
// 	}
// 	//接收服务器消息
// 	ws.onmessage = function(event){
// 		var data = event.data;
// 		//判断信息，对应显示信息
// 		if()
// 	}
// 	ws.onerror = function(event){
// 		console.log("ERR",event.data)
// 	}
// }