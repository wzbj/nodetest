var express = require('express');//引入express
var router = express.Router();//绑定router变量到Express路由方法

/* GET home page. */
// 当HTTP使用根目录("/")的时候为其渲染页面
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendfile("./views/flopgame/index.html"); 
});

/* hello world */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello, World!' });
});

// 导出路由方法到程序中
module.exports = router;