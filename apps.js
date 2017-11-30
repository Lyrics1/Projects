const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// const _ = require('underscore');//替换对象 没有用到
// var querystring= require('querystring');//字符串转化

const port = process.env.PORT || 3000
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);


app.set('views','./views/pages');//设置视图根目录
app.set('view engine','jade');//设置模板引擎


// parse application/x-www-form-urlencoded  数据格式化
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var logConfig = require('./logs/log.config');

//设置日志配置
const log4js = require('log4js');//日志管理
log4js.configure(logConfig);
const logger = log4js.getLogger('ruleFile');
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');


app.use(function(req,res,next){
	res.io = io;
	next()
})

//设置session
app.use(cookieParser())
var FileStore = require('session-file-store')(session);//每次都会生成一个session 文件
app.use(session({
	secret:'zzzfff',// 用来对session id相关的cookie进行签名
	store:new FileStore(),// 本地存储session（文本文件，也可以选择其他store，比如redis的）
	
	resave: false, // 是否每次都重新保存会话，建议false
  	saveUninitialized: false,// 是否自动保存未初始化的会话，建议false
	cookie:{
		maxAge :6000*1000// 有效期，单位是毫秒
	}
}))

//设置错误提示信息app.config  app.get("env")获取环境变量
if("development" === app.get("env")){//开发环境
	//进行设置
	app.set("showStackError",true);//屏幕上打印错误信息
	// app.use(express.logger(':method :url :status'))
	app.locals.pretty = true;//页面源码不要展示为压缩的
	// app.use(log4js);
	// app.use(app.router);
}

require('./routes/route')(app)
//设置静态路由
app.use(express.static(path.join(__dirname,"views/includes")));
server.listen(port);

console.log("port",port);

