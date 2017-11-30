const MYSQL = require('../mysql/do.js');
const path = require('path');
const Comment = require('../mysql/comment.js');


//detail
exports.detail=function(req,res,next){
	const data =req.params.id

	MYSQL.DO(data,'select',callback=(results)=>{
		if(results){
		var movie ={
			id:data,
			title:results[0].title,
			doctor:results[0].doctor,
			country:results[0].country,
			language:results[0].language,
			year:results[0].year,
			summary:results[0].summary,
			poster:results[0].poster,
			flash:results[0].flash	
		}
		var Data={
			movieID:data
		}
		// console.log(Data,"data")
		Comment.COMMENT(Data,'ALL',(result)=>{
			// console.log("comment",result)
			
			if(result){
				res.render('detail',{
				title:'Lyrics',
				world: '因为遇见了你，我的人生也得到了很多',
				movies:movie,
				comment:result
			})
			}else{
				returnData ={
					status:false//表示当前没有评论
				}
				// res.send(returnData);
			}
		})
	}else{
		res.end()
	}
	})

	
	
}

//update
exports.update=function(req,res){
	var data= req.params;

	console.log("******",data.id)

	data = data.id;
	MYSQL.DO(data,'select',callback=(results)=>{

	if(results){
		//展示给管理员的flash 和 poster 经过路径处理
		var Flash = path.basename( results[0].flash );
		var Poster = path.basename(results[0].poster)

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
		// console.log("UP")
		res.render('update',{
			title:'Lyrics ',
			movies:movie
		})
	}else{
		res.end()
	}
	})
}

//admin post movie new 接受输入数据
exports.newMovie=function(req,res){
	var title = req.body.title;
	var obj = req.body;
	const data = req.body;
// <<<<<<< HEAD
	console.log("data")
// =======
	console.log("movieID-----------",data)
// >>>>>>> c8acf45a1dd9dc9c62125e7e65dc4c523a5ff937
	if(req.body.status == "update"){	
		MYSQL.DO(data,'update',callback=(results)=>{
			res.redirect('/movie/'+results);
		})
	}else{

		MYSQL.DO(data,'insert',callback=(results)=>{
				res.redirect('/movie/'+results);		
		})
	}
	

}

//admininsert
exports.admininsert=function(req,res){
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
}

//adminlist
exports.adminlist=function(req,res){
	const data = "";
	MYSQL.DO(data,'select',callback=(results)=>{
		// console.log("list",results.id)
		 // console.log("===========")
	if(results){
		for(var i =0;i<results.length;i++){

			 results[i].flash = path.basename( results[i].flash );
		 	results[i].poster = path.basename(results[i].poster)
		}
		res.render('list',{
				title:'Lyrics 列表页',
				movies:results
			})
		}else{
			res.end()
		}		
	})	
}

//list delete movie
exports.del=(req,res)=>{
	var data = req.body;
	 // console.log("moviedelId ",data)
	MYSQL.DO(data,'delete',callback=(results)=>{
		
		if(results){
			res.send(true)
		}
		
	})
}

exports.searchInfo =function(req,res){
	console.log(req.body);
	var data = req.body.info
	// data =(req.body).replace(/^\s+/,'').split('').reverse().join('').replace(/^\s+/,'').split('').reverse().join('')
	console.log(req.body,data);

	MYSQL.DO(data,'searchInfo',callback=(results)=>{
		// console.log(results[0].id);
		if(results.length==0){
			res.send({data:"none"})
		}else{
			var IdTitle={
				id:results[0].id,
				title:results[0].title
			}
			res.send(IdTitle)
		}
		
	})
}
