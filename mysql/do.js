DO = (data,status,callback)=>{
	const mysql = require('mysql');
	const config = require('./config');
	if(data.flash!="undefined"){
		// console.log("拼接字符串1");
		data.flash ="../video/"+data.flash
	}
	if(data.poster!="undefined"){
		// console.log("拼接字符串2");
		data.poster ="../image/"+data.poster
	}

	const connection = mysql.createConnection(config);
	connection.connect((err)=>{
			if(err){
				return console.error('error'+err.message);
			}
			// console.log("connection success");

			//add
			if(status=='insert'){
				//检验是否已将添加过
					var selectSql = `select * from imooc where title = "${data.title}" and doctor = "${data.doctor}"`;
					connection.query(selectSql,(err,results,fields)=>{
						if(err){
							 return  console.error("error0"+err.message);
						}
						// console.log("select success");
						// if(results.length==0){
							var pushTime = new Date();
							var pushTime= pushTime.toLocaleDateString().replace(/\//g, "-") + " " + pushTime.toTimeString().substr(0, 8)
							const addSql = `insert into imooc(doctor,title,country,language,year,poster,summary,flash,pushTime) values(?,?,?,?,?,?,?,?,?)`;
							const addinfo = [`${data.doctor}`,`${data.title}`,`${data.country}`,`${data.language}`,`${data.year}`,`${data.poster}`,`${data.summary}`,`${data.flash}`,`${pushTime}`]
							connection.query(addSql,addinfo,(err,results,fields)=>{
								if(err){
									 return  console.error("error"+err.message);
								}
								// console.log("insert success");
								// 查找最新一条数据记录
								selectNewSQL = `select id from imooc where id=(select max(id) from imooc)`;
								connection.query(selectNewSQL,(err,results,fields)=>{
									if(err){
										 return  console.error("error2"+err.message);
									}
									// console.log(results[0].id);
									callback(results[0].id);
								})

							})
						// }
						// else callback(1);//表示已经添加过了
					})				
			}
			
			//select by id
			if(status=='select'){
				var  selectSql;
				console.log("data.id",data,data.id)
				if(data==""){
					 selectSql = `select * from imooc `;
				}else{
					 selectSql = `select * from imooc where id = ${data}`;
				}
				console.log(selectSql,"selectSql")
				connection.query(selectSql,(err,results,fields)=>{
						if(err){
							callback(false)
							 return  console.error("error3"+err.message);
						}
						// console.log("select success",results);
						callback(results);
					})
			
			}

			
			//update
			if(status=='update'){
				var statusId=1;
				//先查找相关电影的id 根据 title doctor
				// var selectSql = `select id from imooc where title = "${data.title}" and doctor = "${data.doctor}"`;
					// connection.query(selectSql,(err,results,fields)=>{
					// 	if(err){
					// 		 return  console.error("error0"+err.message);
					// 	}
					// console.log("==select success========",results,results[0].id);
					statusId = data.id;
					var newTime = new Date();
					var newTime= newTime.toLocaleDateString().replace(/\//g, "-") + " " + newTime.toTimeString().substr(0, 8)
					const updateSql = `update imooc set title = "${data.title}",doctor ="${data.doctor}",country = "${data.country}",language="${data.language}",year="${data.year}",summary="${data.summary}",poster="${data.poster}",flash="${data.flash}",pushTime="${newTime}" where id=${data.id}`;
					// console.log(updateSql)
					connection.query(updateSql,(err,results,fields)=>{
						if(err){
							 return  console.error("error5"+err.message);
						}
						// console.log("update success",statusId,results);
						callback(statusId)
					})
				// })
				
				
			}

			if(status=='delete'){

				const deleteSql = `delete from imooc where id=${data.id}`;

				// console.log(deleteSql,data.id)

				console.log(deleteSql)

				connection.query(deleteSql,(err,results,fields)=>{
						if(err){
							 return  console.error("error"+err.message);
						}
						// console.log("delete success");
						callback(true)
					})
				
			}

			if(status=='searchInfo'){

				const searchInfo = `select id,title from imooc where title like '%${data}%'`;


				connection.query(searchInfo,(err,results,fields)=>{
						if(err){
							 return  console.error("error"+err.message);
						}
						// console.log(results);
						callback(results)
					})
				
			}

			// connection.end(()=>console.log("connection.end"));		
	})

}

module.exports.DO = DO;