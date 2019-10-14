const express = require("express");
const http = require("http");
const fs = require("fs");
const app = express();
const port = 9988;

app.get(/^\/$/,(req,res)=>{
    res.contentType = "text/html; charset=utf-8";
    res.write(fs.readFileSync("./demo.html"));
    res.end();
});

app.get(/^\/api/,(req,res)=>{
    http.get("http://localhost:9977/",responseFromOtherDomain=>{
        responseFromOtherDomain.on("data", function(data) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(data);
        });
    });
});

const serve = app.listen(port,()=>{
    const host = serve.address().address;
    const port = serve.address().port;
    console.log(`应用实例，访问a的地址端口${host +':'+port}`);
});
