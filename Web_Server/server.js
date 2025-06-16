const { log } = require('console');
const http = require('http');

const hostname = '127.0.0.1';
const port = 3001

const server = http.createServer((req,res) =>{
   if (req.url === '/') {
     res.statusCode = 200
     res.setHeader('Content-Type','text/plain')
     res.end("HELLO WORLD")
   }else if(req.url === '/login'){
     res.statusCode = 200
     res.setHeader('Content-Type','text/plain')
     res.end("LOGIN PAGE")
   }else{
     res.statusCode = 404
     res.setHeader('Content-Type','text/plain')
     res.end("404 PAGE NOT FOUND")
   }
})
server.listen(port,hostname,() =>{
    console.log(`Server Listening on at http://${hostname}:${port}`)
})