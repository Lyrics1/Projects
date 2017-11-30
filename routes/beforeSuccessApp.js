const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//字符串转化
// var querystring= require('querystring');
const _ = require('underscore');//替换对象
const port = process.env.PORT || 3000
const app = express();

//连接本地数据库
const mysql = require('mysql');
const MYSQL = require('./mysql/do.js');
const USER = require('./mysql/user.js');
app.set('views','./views/pages');//设置视图根目录
app.set('view engine','jade');//设置模板引擎


//数据格式化
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//数据进行加密
const crypto = require('crypto');

//设置session
app.use(cookieParser())
var FileStore = require('session-file-store')(session);
app.use(session({
	secret:'zzzfff',// 用来对session id相关的cookie进行签名
	store:new FileStore(),// 本地存储session（文本文件，也可以选择其他store，比如redis的）

	resave: true, // 是否每次都重新保存会话，建议false
  	saveUninitialized: true,// 是否自动保存未初始化的会话，建议false
	cookie:{
		maxAge :60*1000// 有效期，单位是毫秒
	}
}))

//设置静态路由
app.use(express.static(path.join(__dirname,"views/includes")));
app.listen(port);

console.log("port",port);

//设置持久化会话
app.use(function(req,res,next){
	console.log("req.session.username : ",req.session.username)
	// var user = req.session.username;
	if(req.session.username){
		// res.send()
		app.locals.user = req.session.username;
	}
	return next();//跳过
	
})


//index views 路由
app.get('/',function(req,res){
	
	//展示所有的数据
	const data ="";
	MYSQL.DO(data,'select',callback=(results)=>{
		// var results = results.parseJSON();
		res.render('index',{
			title:'Lyrics 首页',
			movies:results
		})
	})
})



//detail
app.get('/movie/:id',function(req,res){
	// var id = req.params;
	// console.log(req.params.id,"数据")
	const data ={id:req.params.id}
	//req.body获取post
	//req.query 获取get
	// req.params 通用
	// console.log("data",data)
	MYSQL.DO(data,'select',callback=(results)=>{
		// var results = JSON.parse(results)
		var movie ={
			title:results[0].title,
			doctor:results[0].doctor,
			country:results[0].country,
			language:results[0].language,
			year:results[0].year,
			summary:results[0].summary,
			poster:results[0].poster,
			flash:results[0].flash	
		}
		console.log(results[0]);
		res.render('detail',{
			title:'Lyrics ',
			movies:movie
		})
	})
	
	
})

//update
app.get('/admin/update/:id',function(req,res){
	var data= req.params;
	MYSQL.DO(data,'select',callback=(results)=>{
		// var results = JSON.parse(results)
		//展示给管理员的flash 和 poster 经过路径处理
		var Flash = path.basename( results[0].flash );
		var Poster = path.basename(results[0].poster)
		// console.log(Flash,"flash");
		// console.log(results,"results1")
		var movie ={
			title:results[0].title,
			doctor:results[0].doctor,
			country:results[0].country,
			language:results[0].language,
			year:results[0].year,
			summary:results[0].summary,
			poster:Poster,
			flash:Flash,
			id:results[0].id,
			status :"update"
		}
		console.log(results[0]);
		res.render('admin',{
			title:'Lyrics ',
			movies:movie
		})
	})

	// if(id){
	// 	Movie.findById(id,function(err,movie){
	// 		res.render('admin',{
	// 			title:"lyrics 更新页面",
	// 			movies:movie
	// 		})
	// 	})
	// }
})

//admin post movie接受输入数据
app.post('/admin/movie/new',function(req,res){
	console.log("连接上")
	// console.log(req.body)

	// movies[title]
	// console.log(req.body.title)
	var title = req.body.title;
	var obj = req.body;
	const data = req.body;
	if(req.body.status == "update"){
		console.log("=======update=========")
		
		MYSQL.DO(data,'update',callback=(results)=>{
			// console.log(results,"results update")
			res.redirect('/movie/'+results);
		})
	}else{
		//insert
		console.log("=======insert=========")

		MYSQL.DO(data,'insert',callback=(results)=>{
		// console.log(results,"111")

				res.redirect('/movie/'+results);		
		})
	}
	

})

//admin
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'Lyrics 后台录入页',
		movies:{
			title:"",
			doctor:"",
			country:"",
			language:"",
			year:"",
			summary:"",
			poster:"",
			id:"",
			flash:""
		}
	})
})

//list
app.get('/admin/list',function(req,res){
	const data = "";
	MYSQL.DO(data,'select',callback=(results)=>{
	
		 // console.log("===========")
		for(var i =0;i<results.length;i++){

			 results[i].flash = path.basename( results[i].flash );
		 	results[i].poster = path.basename(results[i].poster)
		}
		// console.log(results.length)
		res.render('list',{
				title:'Lyrics 列表页',
				movies:results
			})		
	})	
})
//delete
app.post('/admin/delete/:id',(req,res)=>{
	var data = req.body;
	// console.log("delete",data)
	MYSQL.DO(data,'delete',callback=(results)=>{
		console.log(results)
		if(results){
			res.send(true)
			// return next()
			// res.redirect('/admin/list');

		}
		
	})
})


//list delete movie
app.delete('/admin/list',(req,res)=>{
	var data = req.query;
	// console.log("delete",data)
	// Object.keys(obj)
	console.log(JSON.stringify(Object.keys(data)));
	var Temp = JSON.stringify(Object.keys(data));
	 data = Temp.substr(5,2);
	 // console.log(data) 
	 data ={
	 	id:data
	 }
	MYSQL.DO(data,'delete',callback=(results)=>{
		
		if(results){
			res.send(true)
			// return next()
			// res.redirect('/admin/list');

		}
		
	})
})


var nameRegExp = /^[\u4e00-\u9fa5]{2,12}$/;
var passRegExp = /^[\w]{6,12}$/;
//注册
app.post('/user/signup',(req,res)=>{
	
	var data = req.body;
	// console.log(data);
	var name = req.body.username;
	var password = req.body.password;
	//正则验证
	if(nameRegExp.test(name) && passRegExp.test(password)){
		//对密码进行加密处理
		var  hash = crypto.createHash('md5');
		const newPass = hash.update(password).digest("zzzfff");
		console.log(newPass,"newPass");
		var data = {
			name :name,
			password:newPass
		}
		USER.SIGN(data,"signup",callback=(results)=>{
			console.log(results);
			if(results){
				res.redirect('/');
				// res.send(results)
			}
		})
	}else{
		console.log("注册信息不合格")
	}
})

//登录
app.post('/user/signin',(req,res,next)=>{
	const name = req.body.username;
	const password = req.body.password;
	if(nameRegExp.test(name) && passRegExp.test(password)){
		var  hash = crypto.createHash('md5');
		const newPass = hash.update(password).digest("zzzfff");
		var data = {
			name :name,
			password:newPass
		}
		console.log(data)
		USER.SIGN(data,"signin",callback=(results)=>{
			console.log(results);
			if(results.length!=0){
				//如果登陆成功则存储session
				// req.session.regenerate(function(err) {
				  // will have a new session here
				  console.log("name",name)
				  req.session.username = name;
				// })
				
				// res.send(results)
				res.redirect('/');
			}
		})
	}else{
		console.log("登录信息不合格")
	}
})

//登出
app.get('/logout',(req,res)=>{
	console.log("LO4")
	delete req.session.username;
	delete app.locals.user //如果不删除 app.licals.user 页面是不会改变的
	res.redirect('/');
})