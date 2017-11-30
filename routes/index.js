const MYSQL = require('../mysql/do.js');

//index 主页
exports.index = function(req,res,next){

	const data ="";
	MYSQL.DO(data,'select',callback=(results)=>{
		// var results = results.parseJSON();
		res.render('index',{
			title:'Lyrics 首页',
			world: '我在等你，你来了',
			movies:results
		})
	})
	
}


exports.getName = function(req,res){
	console.log("judge")
	const name = req.session.username;
	console.log(name)
	res.send(`name:${name}`);
}