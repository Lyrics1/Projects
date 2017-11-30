window.onload = function(){

	$('.Fuser').click(function(){
		window.location.href="/information"
	})
	//完成搜索进行跳转的功能
	var searchId=-1;
	$('.search').eq(0).on('click keyup',function(){
		var searchInfo = $.trim($('.search').eq(0).val());
		// console.log(searchInfo)
		var data = {
			info:searchInfo
		}
		$('#search').empty()
			
		if(searchInfo.length==0){
			return;
		}else{
			$.ajax({
				url:"http://localhost:3000/searchInfo",
				type:"POST",
				// dataType:"JSON",
				data:data,
				success:function(results){
					// console.log(results)
					if(results.data!="none"){
						searchId = results.id;
						$('#search').append(`<option>${results.title}</option>`)
					}
				},
				error:function(err){
					console.log(err)
				}
			})
		}
		
	})

	$('.search').eq(1).on('click',function(){
			jump()
	});
	$('.search').eq(0).on('focus',function(){
			//监听Enter键自动跳转 
            $(document).keyup(function(event){  
            	// alert("E")
                  if(event.keyCode ==13){  
                    jump()
                  }  
                });
	});


	
function jump(){

		if(searchId!=-1){
			window.location.href=`http://localhost:3000/movie/${searchId}`
		}
		else{
			location.reload();
		}
}

	




	//实现个人信息修改
	$('.saveInfo').click(function(){
		var data = {
			name:$('.dear').val(),
			introduce:$('.introduce').val(),
			birthday:$('.birthday').val()
		}
		//进行信息的正则验证
		console.log(data);
		$.ajax({
			url:'http://localhost:3000/updateinfo',
			type:"POST",
			dataType:"JSON",
			data: data,
			success:function(result){
				console.log(result);
				location.reload()

			},
			error:function(error){
				console.log(error);
				location.reload()
			}
		})
	})
	//实现点击更换头像实现相应的模块替换
	$('.uodateImg').click(function(){
		$('.showInfo').hide();
		$('.showChange').show();
	})
	$('#picpath').change(function(e){
		console.log($('.upfile').val())
		var src="";
		$('.photos').attr('src',$('.upfile').val());
	})


	//注册
	$('.signUpsubmit').click(function(){
		//正则验证：
		var nameRegExp = /^[\u4e00-\u9fa5]{2,12}$/;
		var passRegExp = /^[\w]{6,12}$/;
		var name = $("input[name='username']").val()
		var pass = $("input[name='password']").val()
		console.log(name,pass);
		if(nameRegExp.test(name)&& passRegExp.test(pass)){
			console.log("true");
			$.ajax({
				url: "http://localhost:3000/user/signup",
				type:"POST",
				dataType:"JSON",
				data:{
					username:name,
					password:pass
				},
				success:function(data){
					console.log(data);
					$('#errTip').text(data.status);	
					

				},
				error:function(err){
					console.log("tip")
				}
			})
		}else{
			var tip = 0;
			if(!nameRegExp.test(name)){
				$('#errTip').text("用户名格式错误");
				$("input[name='username']").val("");
				tip=1;
			}
			if(!passRegExp.test(pass)){
				if(tip==1){
					$('#errTip').text("用户名和密码格式错误")
					$("input[name='password']").val("");
					$("input[name='username']").val("");
				}else{
					$('#errTip').text("密码格式错误")
					$("input[name='password']").val("")
				}	
				
			}

		}
		// $.ajax()
		return false;

	})

//登录
	$('.signInsubmit').click(function(){
		//正则验证：
		var nameRegExp = /^[\u4e00-\u9fa5]{2,12}$/;
		var passRegExp = /^[\w]{6,12}$/;
		var name = $(".name").val()
		var pass = $(".pass").val()
		console.log(name,pass);
		if(nameRegExp.test(name)&& passRegExp.test(pass)){
			console.log("true");
			$.ajax({
				url: "http://localhost:3000/user/signin",
				type:"POST",
				dataType:"JSON",
				data:{
					username:name,
					password:pass
				},
				success:function(data){
					console.log(data);
					$('#signerrTip').text(data.status);	
					location.reload()

				},
				error:function(err){
					console.log("tip")
				}
			})
		}else{
			var tip = 0;
			if(!nameRegExp.test(name)){
				$('#signerrTip').text("用户名格式错误");
				$("input[name='username']").val("");
				tip=1;
			}
			if(!passRegExp.test(pass)){
				if(tip==1){
					$('#signerrTip').text("用户名和密码格式错误")
					$("input[name='password']").val("");
					$("input[name='username']").val("");
				}else{
					$('#signerrTip').text("密码格式错误")
					$("input[name='password']").val("")
				}	
				
			}

		}

		return false;

	})






	var movieID = $('.movieID').html();
	console.log(movieID)
	/*
	 	更新
	*/
	$('.update').click(function(event){
		//使用jq 不要使用es6 容易出错
		console.log($(this).attr("data-id"));
		var ID = $(this).attr("data-id");
		window.location.href="http://localhost:3000/admin/update/"+ID
	})
	/*
	删除
	*/
	$('.del').on('click',function(e){
		var target = $(e.target)//获取当前的点击对象
		var id = target.data('id');
		var tr = $('.item-id-'+id)
		// console.log(id,tr)
		$.ajax({
			url :'http://localhost:3000/admin/list',
			type:'POST',
			dataType:"JSON",
			data:{
				id:id
			}
		})
		.done(function(results){
			if(results){
					if(tr.length >0){
						tr.remove()
					}
				}
			})
		})



	//实现图片并且显示
	$('#inputPoster').change(function(e){
		 if (this.files && this.files[0]) {
		      var reader = new FileReader();
		      reader.onload = function(evt) {
		      	$('<img />',{
			 		 'class':"pic-img",
			 		'src' : `${evt.target.result}`
				}).appendTo('.file-img')
		      }
		      reader.readAsDataURL(this.files[0]);
		  } else{
				$('<img />',{
					  'class':"pic-img",
					 'src' : `${this.value}`
				}).appendTo('.file-img')
		  }

		  $('<div>',{
		  	'class' : 'del-img',
		  }).appendTo('.file-img')
		  $('.del-img').append(`<span class="glyphicon glyphicon-trash del-icno"  aria-hidden="true" > </span> `)
		  //进行提交图片至项目的一个文1件夹中
		  	//图片显示之后可以的删除	
	})

	//利用事件委托实现对上传图片的删除功能
	$('.file-img').on('mouseover','img',function(){
			$('.del-img').show('slow')
	});
	//点击删除
	$('.file-img').on('click','.del-img',function(){

			$('.pic-img').remove();
			$('.del-img').remove();
	});

	$('.content-submit').click(function(){
		var content = $('.textArea').val();
		//去除开头首位空格//对评论信息进行筛选，去除首位空格或者字符

				
		console.log("content,movieID",content,movieID)
		if(content.length >5 && content.length <199){
			//进行提交后台
			$.ajax({
				url:'http://localhost:3000/comment',
				type:'POST',
				dataType:"JSON",
				data:{
					content :content,
					movieID:movieID
				}
			})
			.done(function(results){

				if(results.status){
					console.log("评论成功")
					var newDom = `<div class="media comment" id="${results.id}">
								<a href="" class="pull-left"><img src="${results.img}" class="media-object"></a>
				          <div class="media-body">
				            <p class="media-heading show-username">${results.username} <span class="time">${results.time}</span></p>
				            <div class="media show-content">${results.content}</div>
				          </div>
				        </div>`;
					 $('.content').prepend(newDom);
				}
			})
		}else{
			console.log("亲输入5以上")
		}
	})
	
	//回复功能
		$('.receive').on('click',function(e){
			console.log($('.owner').html())
			if($('.owner').html()==undefined){
				$('.loginTip').show('slow')
				// $('.loginTip').hide('slow')
				return ;
			}

		
			//显示回复框
			var target = $(e.target);
			var id =target.data('id');//取得是那一条评论的id 
			
			console.log(id)
			$('.content-receive').hide()
			$('.iner-'+id).show();
		})


			
			//设置提交回复的事件
			$('.button-receive').click(function(e){
				var target = $(e.target);
				var id =target.data('id');
				console.log(id)
				var content = $('.i-'+id).val()//评论的内容
				var bname = $('.name-'+id).text();
				var bcontent = $('.bcontent-'+id).text()
				console.log(content,bname,bcontent);



			//	进行回复提交并且提交成功后立刻显示评论结果
					$.ajax({
					url:'http://localhost:3000/receive',
					type:'POST',
					dataType:"JSON",
					beforeSend:JudgeLogin,
					data:{
						content :content,
						movieID:movieID,
						bcommentID:id
					}
				})
				.done(function(results){
					console.log("回复成功",results)
					var newDom = `<div class="media comment" id="${results.id}">
								<a href="" class="pull-left"><img src="${results.img}" class="media-object"></a>
				          <div class="media-body">
				            <p class="media-heading show-username">${results.username} <span class="time">${results.time}</span></p>
				            <div class="media show-content">${content}</div>
				          </div>
				          <div class="bcontent">
				          	<label><span class="bname">${bname}</span> : <span class="bbcontent">bcontent</span></label>
				          </div>

				        </div>`;
					 $('.comment').prepend(newDom);
				})
			})
		
	
	//关闭提示框

	$('.icon').click(function(){
		$('.loginTip').hide('slow')
	})

	//点赞功能
	// var judge = true;
	$('.glyphicon-hand-right').click(function(e){

		console.log($('.owner').html())
			if($('.owner').html()==undefined){
			
				$('.loginTip').show('slow')
				// $('.loginTip').hide('slow')
				return ;
			}
		var target = $(e.target);
		var id = target.data('id');
		console.log('那一条评论的赞',id);

		//后台根据两个条件来进行判断 然后返回状态,根据状态进行点赞处理
		$.ajax({
			url:'http://localhost:3000/nice',
			type:"POST",
			dataType:"JSON",
			beforeSend:JudgeLogin,
			data:{
				id:id
			},
			success:function(results){
				console.log(results)
				if(results){
					$(`.count-${id}`).show()
					$(`.count-${id}`).text(parseInt($(`.count-${id}`).text()) +1)
					//没有点过赞的加1 反之减一
				}else{
					$(`.count-${id}`).show()
					$(`.count-${id}`).text(parseInt($(`.count-${id}`).text()) -1)
				}
			},
			error:function(err){
				console.log(err)
			}
		})
		
	})
	
	//回复和评论功能都需要判断是否登录；

	function JudgeLogin(){
		$.ajax({
			url: "http://localhost:3000/get",
			type: 'GET',
			// dataType: 'JSON',
			success:function(results){
				if(results=='undefined'){
					return false;
				}
				console.log(results);
				return true;

			},
			error:function(err){
				console.log(err);

				return false;
			}
		})
	}

	//因为jade 模板渲染都含有回复评论的div ,所以要对没有评论的div 进行隐藏
	var bname=  $('.bcontent .bname');
	var bnameLen = bname.length;
	console.log(bnameLen);
	for(var i=0;i<bnameLen;i++){
		$('.bcontent').eq(i).addClass(`BC-${i}`)
		console.log($('.bname').eq(i).text())
		if($('.bname').eq(i).text()==""){
			// alert("1")
				$(`.BC-${i}`).hide();
		}
	}

	var niceCount = $('.count').length;
	//请求评论
	// for(var j=0;j<niceCount;j++){
	// 	$('.count').eq(j).addClass(`Nice-${j}`);
	// }
	// $.ajax({
	// 		url:'http://localhost:3000/allNice',
	// 		type:'POST',
	// 		dataType:"JSON",
	// 		data:{
	// 			content :content,
	// 			movieID:movieID,
	// 			bcommentID:id
	// 		}
	// 	})
	// 	.done(function(results){
			
	// 	})

	
	



}