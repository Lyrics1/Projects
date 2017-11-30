const USER = require('../mysql/user.js');
const crypto = require('crypto');//数据进行加密
const path = require('path');
const Comment = require('../mysql/comment.js');
// const UserImg = require('./userImg');
var formidable = require('formidable');
var fs = require('fs');
var nameRegExp = /^[\u4e00-\u9fa5]{2,12}$/;
var passRegExp = /^[\w]{6,12}$/;
//注册
exports.signup=(req,res)=>{
	
	var data = req.body;
	// console.log(data);
	var name = req.body.username;
	var password = req.body.password;
	//正则验证
	if(!nameRegExp.test(name)){
		res.send({status:"用户名格式错误"})
	}
	if(!passRegExp.test(password)){
		res.send({status:"密码格式错误"})
	}
	if(nameRegExp.test(name) && passRegExp.test(password)){
		//对密码进行加密处理
		var  hash = crypto.createHash('md5');
		const newPass = hash.update(password).digest("hex");
		console.log(newPass,"newPass");
		var data = {
			name :name,
			password:newPass
		}
		USER.SIGN(data,"signup",callback=(results)=>{
			
			if(results){
				// console.log("注册成功! 请登录");
				res.send({status:"注册成功! 请登录"});
				// res.redirect('/');
			}else{
				res.send({status:"用户名已经占用"});
			}
		})
	}else{
		res.send({status:"注册信息格式错误"});
		console.log("注册信息格式错误");
		
		
	}
}

//登录
exports.signin=(req,res,next)=>{
	const name = req.body.username;
	const password = req.body.password;
	if(nameRegExp.test(name) && passRegExp.test(password)){
		var  hash = crypto.createHash('md5');
		const newPass = hash.update(password).digest("hex");
		var data = {
			name :name,
			password:newPass
		}

		USER.SIGN(data,"signin",callback=(results)=>{
			console.log(results)
			if(results.length!=0){
				  req.session.username = name;					
				  req.session.password = password;
				  req.session.userID = results[0].id;
				  req.session.userImg=`../image/photo/${req.session.userID}/`+results[0].img;
				  req.session.introduce = results[0].introduce;
				  req.session.sex = results[0].sex;
				  req.session.birthday = results[0].birthday;
				  req.session.address =results[0].address;
				  console.log("登录成功");
				  console.log(req.url)
				  res.send({status:"登录成功"})
				  console.log("_=+++++++++ ",req.session.userImg)
			}else{
				res.send({status:"请先进行注册信息"});
			}
		})
	}else{
		console.log("登录信息不合格")
		res.send({status:"登录信息不合格"});
	}
}


exports.requireSign =function(req,res,next){
console.log("adm",req.body)
	var user  = req.session.username;
	if(!user){
		console.log("没有登录!")
		res.redirect('/');
	}
	console.log("登录!")
		next()
}


exports.requireAdmin = function(req,res,next){
		//判断管理员
		// console.log("admin",req.body)
		const name = req.session.username;
		const password = req.session.password;
		console.log(name,password)
		var  hash = crypto.createHash('md5');
		const newPass = hash.update(password).digest("hex");
		
		var data = {
			username:name,
			password:newPass
		}
		console.log("dataAdmin",data)
		if(nameRegExp.test(name) && passRegExp.test(password)){
			
			var data = {
				name :name,
				password:newPass
			}
			// console.log(data)
			USER.SIGN(data,"signin",callback=(results)=>{
				// console.log(results);
				if(results.length!=0){
					req.session.username = name;
					console.log("role",results,results[0].role )
					if(results[0].role >=10){
						next()
					}else{
						console.log("不是管理员,没有权限查看")
						res.redirect('/');
					}
				}
			})
		}else{
			console.log("登录信息不合格")
		}
}

//comment

exports.comment = function(req,res,next){
	var content = req.body.content
	console.log("获的评论",content);
	console.log(content.trim());
	content = content.trim();
	
	const user  = req.session.username;
	const password = req.session.password;
	const userID = req.session.userID ;
	const movieID = req.body.movieID;

	// console.log(user,movieID)
	if(user){
	console.log("可以收纳评论了")
		var pushTime = new Date();
		var pushTime= pushTime.toLocaleDateString().replace(/\//g, "-") + " " + pushTime.toTimeString().substr(0, 8)
		var data ={
				commenterID:userID,
				content:content,
				time:pushTime,
				movieID:movieID
		}	
		Comment.COMMENT(data,'comment',(results)=>{
			// console.log(results);
			if(results){
				var returnData ={
					id:userID,
					img:req.session.userImg,
					username:user,
					content:content,
					time:pushTime,
					status:results
				}
				res.send(returnData)
			}else{
				returnData ={
					status:false
				}
				res.send(returnData)
			}
		})

	}
}
//回复功能
exports.receive =function(req,res,next){

	var movieID = req.body.movieID;
	var content= req.body.content;
	var bcommentID = req.body.bcommentID;//被评论的id
	//根据bcommentID 查找被评论者的名字和评论的内容,然后插入comment
	console.log(bcommentID,content,movieID)
	var Judge = req.session.username;

	if(Judge==null){
		res.send(`status:false`);
		return ;
	}
	var DATA={
		movieID:movieID,
		bcommentID:bcommentID
	}
	Comment.COMMENT(DATA,'bcomment',callback=(results)=>{
		var pushTime = new Date();
		var pushTime= pushTime.toLocaleDateString().replace(/\//g, "-") + " " + pushTime.toTimeString().substr(0, 8)
			console.log(results);
			var data = {
				movieID:movieID,//电影的id
				content:content,//回复的内容
				buserID:results[0].id,//被回复者的id
				bcommentID:bcommentID,//被回复的内容的id
				bcontent:results[0].content,//被回复的内容
				bname:results[0].name,//被回复的用户名
				id:	req.session.userID,//回复者的id 
				time:pushTime//时间
			}
			Comment.COMMENT(data,'inserReceive',callback=(results)=>{
				console.log(results);
				var returnData ={
					id:1,
					img:"../image/2.jpg",
					username:req.session.username,
					content:content,
					time:pushTime,
					status:results
				}
				res.send(returnData)

				// res.send(results)
			})
	})
}


exports.nice=function(req,res,next){
	var Judge = req.session.username;
	if(Judge==null){
		res.send(`status:false`);
		return ;
	}
	var id = req.body.id;
	var userID = req.session.userID;
	console.log(id,userID);
	var data ={
		id : id,
		userID:userID
	}
	//向数据库发出请求,判断是否本用户已经对这条评论进行点赞
	Comment.COMMENT(data,'CheckNice',callback=(results)=>{
		res.send(results)
	})
}
//个人信息展示
exports.info=(req,res)=>{
	
	var data = req.query;
	console.log(data);
	
		var  hash = crypto.createHash('md5');
		const newPass = hash.update(req.session.password).digest("hex");
		console.log(newPass,"newPass");
		var data = {
			name :req.session.username,
			password:newPass
		}
		USER.SIGN(data,"info",callback=(results)=>{
				  req.session.userImg=`../image/photo/${req.session.userID}/`+results[0].img;
				  req.session.introduce = results[0].introduce;
				  req.session.sex = results[0].sex;
				  req.session.birthday = results[0].birthday;
				  req.session.address =results[0].address;
			var man,woman,none;
			console.log(results[0].sex)
			if(results[0].sex=='男'){
				console.log("1")
				man = "true";
				woman=none="false"
			}
			if(results[0].sex=='女'){
					console.log("2")
				woman = "true";
				man=none="false"
			}
			if(!results[0].sex=='女'&&results[0].sex=='男'){
				none="true";
					console.log("10")
				woman=man="false"
			}
			// if(birthday)
			
			res.render('information',{
				title:'个人设置',
				world: '写一段描述自己的话，用心去感受自己的内心',
				name:results[0].name,
				introduce:results[0].introduce,
				man:man,
				woman:woman,
				none:none,
				birthday:results[0].birthday

			})
			
		})

	
}
exports.updateImg=(req,res)=>{
	// console.log("getIMg",req);
	var  hash = crypto.createHash('md5');
		const newPass = hash.update(req.session.password).digest("hex");
		console.log(newPass,"newPass");
	var NewImg={
			name:req.session.username,
			password:newPass,
			img:"ll"
		}
	var form = new formidable.IncomingForm();
	console.log(__dirname)
	var dir = path.resolve(__dirname,'..')
	console.log(__dirname,dir)
	var filename = req.session.userID;

	fs.exists(`${dir}/views/includes/image/photo/${filename}`, function (exists) {
		if(exists){
				form.uploadDir = `${dir}/views/includes/image/photo/${filename}`;//指定上传文件路径，默认是系统缓存路径
				form.keepExtensions = true;//保留上传文件的格式名称
				form.parse(req,(error,fields,files)=>{
	       		console.log("解析完毕");
	        	if(error) {
	        		console.log("____")
	        	}

				var NewPath = new Date();
				console.log(files.picpath.path,form.uploadDir);
				var photoSRC = path.basename(files.picpath.path);
				console.log(photoSRC);
				NewImg.img=photoSRC
				req.session.userImg = `../image/photo/${filename}/${photoSRC}`;
				USER.SIGN(NewImg,"updateImg",callback=(results)=>{
					console.log(results);
					// if(results){
						 res.redirect('/information');
					// }
				})
    		})
			

			
			}else{
					fs.mkdir(`${dir}/views/includes/image/photo/${filename}`,function(err){
						if(err){
						console.log("创建失败",err);	
						return;
					}
					console.log("创建成功")
				   form.uploadDir = `${dir}/views/includes/image/photo/${filename}`;//指定上传文件路径，默认是系统缓存路径
					form.keepExtensions = true;//保留上传文件的格式名称
					form.parse(req,(error,fields,files)=>{
		       		console.log("解析完毕");
		        	if(error) {
		        		console.log("____")
		        	}

					var NewPath = new Date();
					console.log(files.picpath.path,form.uploadDir);
					var photoSRC = path.basename(files.picpath.path);
					console.log(photoSRC);
					NewImg.img=photoSRC
					req.session.userImg = `../image/photo/${filename}/${photoSRC}`;
					USER.SIGN(NewImg,"updateImg",callback=(results)=>{
						console.log(results);
						// if(results){
							 res.redirect('/information');
						// }
					})
	    		})
			
			})
		
		} 
	});
}

exports.updateinfo=function(req,res){
	console.log(req.body);
	var  hash = crypto.createHash('md5');
	const newPass = hash.update(req.session.password).digest("hex");
	console.log(newPass,"newPass");
	var INFO = {
		Newname :req.body.name,
		introduce:req.body.introduce,
		birthday:req.body.birthday,
		name:req.session.username,
		password:newPass
	}

	//进行信息正则验证
	USER.SIGN(INFO,'updateinfo',callback=(results)=>{
		console.log(results);
		req.session.username=req.body.name;

		res.send({status:"success"})
	})
}

//某一部电影的评论全部加载
// exports.comments =function(req,res,next){
// 	const movieID =req.params.id
// 	console.log(movieID);
// 	var data={
// 		movieID:movieID
// 	}
// 	Comment.COMMENT(data,'ALL',(results)=>{
// 		if(results){
// 			res.render('detail',{
// 			title:'Lyrics ',
// 			movies:movie
// 		})
// 		}else{
// 			returnData ={
// 				status:false//表示当前没有评论
// 			}
// 			// res.send(returnData);
// 		}
// 	})
// }


