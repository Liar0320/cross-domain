const express = require("express");
const app = express();
const port = 9977;

app.get(/^\//,(req,res)=>{
    res.end(`欢迎来到${port}端口，我已经放行所有的地址请求`);
});

const serve = app.listen(port,()=>{
    const host = serve.address().address;
    const port = serve.address().port;
    console.log(`应用实例，访问a的地址端口${host +':'+port}`);
});
