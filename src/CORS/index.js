const express = require("express");
const app = express();
const port = 9977;
var allowCrossDomain = function(req, res, next) {
    /**允许所有的地址访问， 取消跨域拦截 */
    res.header("Access-Control-Allow-Origin", "*");

    // #region 复杂请求必须设置 Access-Control-Allow-Methods 和 Access-Control-Allow-Headers
    // 其中Access-Control-Allow-Headers中除了基础的Origin, X-Requested-With, Content-Type, Accept
    // 如果用户有自己新增的头信息则必须加入Access-Control-Allow-Headers
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, ' + "t");
    // #endregion

   
  
    // #region  如果需要携带cookie或者session  同时前端 xhr.withCredentials = true; // 设置运行跨域操作
    // Access-Control-Allow-Origin必须为指定的域名 不能为*
    // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    // res.header('Access-Control-Allow-Credentials','true');
    // #endregion

    // res.header("Content-Type", "application/json;charset=utf-8");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
};
app.use(allowCrossDomain);
app.get('*',(req,res)=>{
    
    res.end(`欢迎来到${port}端口，我已经放行所有的地址请求`);
});

const serve = app.listen(port,()=>{
    const host = serve.address().address;
    const port = serve.address().port;
    console.log(`应用实例，访问的地址端口${host +':'+port}`);
});