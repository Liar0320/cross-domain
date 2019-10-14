const express = require("express");
const app = express();
const port = 9977;

app.get('*',(req,res)=>{
    /**允许所有的地址访问， 取消跨域拦截 */
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");

    res.end(`欢迎来到${port}端口，我已经放行所有的地址请求`);

});

const serve = app.listen(port,()=>{
    const host = serve.address().address;
    const port = serve.address().port;
    console.log(`应用实例，访问的地址端口${host +':'+port}`);
});