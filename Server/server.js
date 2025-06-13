const http = require('http');
const fs = require('fs')
const path = require('path')

const server = http.createServer((req,res) => {
    const filePath  = path.join(__dirname, req.url === '/' ? "index.html" : req.url);
    const extName = String(path.extname(filePath)).toLowerCase();
    const Types = {
        '.html' : 'text/html',
        '.css' : 'text/css',
        '.js' : 'text/javascript',
        'png' : 'text/png'
    }
    const conType =  Types[extName] || 'application/octet-stream ';
    fs.readFile(filePath, (error,content) => {
        if(error){
            if(error.code === 'ENOENT'){
                res.writeHead(404,{'content-type' : "text/html"})
                res.end("404 : FILE NOT FOUND")
            }
        }else{
            res.writeHead(200,{'content-type' : conType})
            res.end(content, 'utf-8')
        }
    })



});
const port = 3002;
server.listen(port,() => {
    console.log(`SERVER IS RUNNING ON PORT :- ${port}`)
})