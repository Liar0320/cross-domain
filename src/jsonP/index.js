const express = require("express");
const app = express();
const port = 9977;

app.get('*',(req,res)=>{
    const callback = req.query.callback;
    res.contentType('charset=utf-8');
    const message = `欢迎来到${port}端口，我已经放行所有的地址请求`;
    res.end(`${callback}("${ message }")`);
});

const serve = app.listen(port,()=>{
    const host = serve.address().address;
    const port = serve.address().port;
    console.log(`应用实例，访问的地址端口${host +':'+port}`);
});
