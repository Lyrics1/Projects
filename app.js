var express = require('express');
var path = require('path');

// var Movie = require('./models/movie')
var MovieSchema = require('./schemas/movie');
var bodyParser = require('body-parser')
var _ = require('underscore');//替换对象
var port = process.env.PORT || 3000
var app = express();

//连接本地数据库
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/imooc',{useMongoClient:true})
mongoose.Promise = global.Promise;
var Movie = mongoose.model('Movie',MovieSchema);


app.set('views','./views/pages');//设置视图根目录
app.set('view engine','jade');//设置模板引擎
//数据格式化
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,"views/includes")));
app.listen(port);

console.log("port",port);


//index views 路由
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		console.log("lll");
		if(err){
			console.log(err);
		}
		console.log(movies);
		res.render('index',{
			title:'Lyrics 首页',
			movies:movies
		})

	})

	
})

//detail
app.get('/movie/:id',function(req,res){
	var id = req.params.id;
	console.log(req.params,"数据")

	//req.body获取post
	//req.query 获取get
	// req.params 通用
	Movie.findById(id,function(err,movie){
		if(err){
			console.log("err查询失败");
		}
		console.log(movie)
		res.render('detail',{
			title:'Lyrics ',
			movies:movie
		})
	})
	
})

//update
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:"lyrics 更新页面",
				movies:movie
			})
		})
	}
})

//admin post movie接受输入数据
app.post('/admin/movie/new',function(req,res){
	console.log("连接上")
	console.log(req.body)
	console.log(req.body.title,"title")
	var title = req.body.title;
	var obj = req.body;
	
	
	var _movie =new Movie(obj);

	//查询是否已经添加过根据电影名称来区别
	if(title){
		Movie.find({'title':title},function(err,movie){
			if(err){
				console.log(err)
			}			
			console.log(movie+"查出的数据")
			if(movie.length==0){
				//表示可以添加新的数据
				// _movie =._extend(movie,obj)
				// _movie = new Movie(movie);
					_movie = new Movie({
						doctor:obj.doctor,
						title:obj.title,
						country:obj.country,
						language:obj.language,
						year:obj.year,
						poster:obj.poster,
						summary:obj.summary,
						flash:obj.flash
					})
				console.log(_movie+"_movie")
				console.log("0")
				_movie.save(function(err,movie){
					if(err){
						console.log(err,"err")
					}
					//开始跳转页面
					res.redirect('/movie/'+movie._id)
				})
			}else{
				console.log(movie+"11")
				// 直接跳转
				console.log("1")
				res.redirect('/movie/'+movie._id);
			}
		})
	}


	// var _movie;
	// if(id !== 'undefined'){
	// 	Movie.findById(id,function(err,movie){
	// 		console.log
	// 		if(err){
	// 			console.log(err)
	// 		}
	// 		_movie = _.extend(movie,obj);
	// 		_movie.save(function(err,movie){
	// 			if(err){
	// 				console.log(err)
	// 			}
	// 			res.redirect('/movie/'+movie._id)
	// 		})
	// 	})
	// }else{
	// 	_movie = new Movie({
	// 		doctor:obj.doctor,
	// 		title:obj.title,
	// 		country:obj.country,
	// 		language:obj.language,
	// 		year:obj.year,
	// 		poster:obj.poster,
	// 		summary:obj.summary,
	// 		flash:obj.flash
	// 	})
	// 	_movie.save(function(err,movie){
	// 			if(err){
	// 				console.log(err)
	// 			}
	// 			res.redirect('/movie/'+movies._id)
	// 		})
	// }
	
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
		}
	})
})

//list
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
			if(err){
				console.log(err);
			}
			res.render('list',{
				title:'Lyrics 列表页',
				movies:movies
			})

		})
	
})