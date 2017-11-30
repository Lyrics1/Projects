COMMENT=(data,status,callback)=>{
	console.log(data)
	const mysql = require('mysql');
	const config = require('./config.js');
	const connection = mysql.createConnection(config);
	connection.connect((err)=>{
		if(err){
			return console.error('error'+err.message);
		}
		console.log("connection success");
		if(status=="comment"){//评论
			//insert
			const commentSql = `insert into comment(movieID,commenterID,time,content) values(${data.movieID},${data.commenterID},"${data.time}","${data.content}")`;
			// console.log(commentSql)
			connection.query(commentSql,(err,results,fields)=>{
				if(err){
					return console.error('error signUP'+err.message);
				}
				callback(true);
			})
		}
		if(status=="receive"){//回复
			const receiveSql = `select * from comment where name= "${data.name}" and password = "${data.password}"`;
			console.log(receiveSql)
			connection.query(receiveSql,(err,results,fields)=>{
				if(err){
					return console.error('error signin'+err.message);
				}
				if(results.length!=0){
					callback(results);
				}else{
					callback(false);
				}
			})
		}
		if(status=="ALL"){
			//按时间顺序返回所有信息
			const allSql = `select comment.id,comment.messageID,comment.observerID,comment.commenterID,comment.obName,comment.obcontent,comment.time,comment.content,comment.nice,user.name,user.img,user.id as userid from comment,user where comment.movieID = ${data.movieID} and comment.commenterID=user.id order by time desc`;
			// console.log(allSql);
			connection.query(allSql,(err,results,fields)=>{
				if(err){
					return console.error('error signin'+err.message);
				}
					callback(results);
				
			})
		}
		//查找b被评论的name 和 内容
		if(status=='bcomment'){
			const bSql = `select comment.content,user.name,user.id from comment,user where comment.movieID= ${data.movieID} and comment.commenterID = user.id and comment.id= ${data.bcommentID}`;
			console.log(bSql);
			connection.query(bSql,(err,results,fields)=>{
				if(err){
					return console.error('error signin'+err.message);
				}
				callback(results);
				
			})
		}
		//存储回复
		if(status=="inserReceive"){
			const breceiveSql = `insert into comment(messageID,movieID,observerID,obcontent,obName,commenterID,time,content) values(${data.bcommentID},${data.movieID},${data.buserID},"${data.bcontent}","${data.bname}",${data.id},"${data.time}","${data.content}")`;
			console.log(breceiveSql)
			connection.query(breceiveSql,(err,results,fields)=>{
				if(err){
					return console.error('errorReceive'+err.message);
				}
				//查找刚才插入的数据
				// const selectReceive = `select * from comment where id =(select max(id) from comment) `
				// 	console.log(selectReceive)
				// connection.query(selectReceive,(err,results,fields)=>{
				// 	if(err){
				// 		return console.error('errorSelectReceive'+err.message);
				// 	}
				// 	callback(results)
				// })

				callback(true);
			})
		}
		//点赞查询
		if(status=="CheckNice"){
			const niceSql = `select * from nice where messageid =${data.id} and userid = ${data.userID}` ;
			console.log(niceSql)
			connection.query(niceSql,(err,results,fields)=>{
				if(err){
					return console.error('ERR CheckNice'+err.message);
				}
				console.log("点赞",results.length)
				if(results.length==0){
					//添加本条评论的赞
					console.log("添加赞")
					const insertNiceSql = `insert into nice (messageid,userid) values(${data.id},${data.userID})`
					console.log(insertNiceSql)
					connection.query(insertNiceSql,(err,results,fields)=>{
						if(err){
							return console.error('insertNiceSql'+err.message);
						}

						const updateNiceCountADD = `update comment set nice =nice+1 where id=${data.id}`//进行数据更新
						connection.query(updateNiceCountADD,(err,results,fields)=>{

							if(err){
								return console.error('in'+err.message);
							}
							callback(true);
						})
						
					})
				}else{
					//删除赞
					console.log("删除赞")
					const deleteNiceSql = `delete from nice where messageid =${data.id} and userid = ${data.userID}`
					connection.query(deleteNiceSql,(err,results,fields)=>{
						if(err){
							return console.error('i'+err.message);
						}
						const updateNiceCountReduce = `update comment set nice =nice-1 where id=${data.id}`

						connection.query(updateNiceCountReduce,(err,results,fields)=>{

							if(err){
								return console.error('update'+err.message);
							}
							callback(false)
						})
						
					})
				}
			})
		}
	// connection.end(()=>console.log("connection.end"));	

	});

}

module.exports.COMMENT =COMMENT;