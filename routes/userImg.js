
// const USER = require('../mysql/user.js');
// const crypto = require('crypto');//数据进行加密
// const path = require('path');

// //index 主页
// exports.img = function(req,res,file){
// 	//解密密码，才可以在数据库中找到
// 	var  hash = crypto.createHash('md5');
// 	const newPass = hash.update(req.session.password).digest("hex");
// 	//判断如果用户登陆的话，获取头像
// 	var Data ={
// 		name:req.session.username,
// 		password:newPass
// 	}
// 	console.log("ig")

// 	if(req.session.username){
// 		// console.log("ig")
// 		USER.SIGN(Data,'userImg',callback=(results)=>{
// 			console.log("res",results[0].img,`${file}`+results[0].img)
// 			req.session.userImg = `${file}`+results[0].img


			
// 		})
// 	}

	
// }

