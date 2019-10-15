const WebSocket = require('ws');
const port = 9977;
let count = 0;

const wss = new WebSocket.Server({
    port:port,
});

wss.on("connection",(ws)=>{
    console.log(`[SERVER] connection()`);
    ws.on("message",function (message) {
        console.log(`[SERVER] Received: ${message}`);
        console.log(message);
        ws.send('我来自后端');
    });
    setInterval(()=>{
        ws.send('我来自后端'+count);
        count++;
    },1000);
});