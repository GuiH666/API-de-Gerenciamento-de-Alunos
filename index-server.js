const { createServer} = require('http');

let server = createServer((request,response)=>{
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write('<h1>Hello,Its me</h1><p>Projeto Node</p>');
    response.end();
});

server.listen(3000);
console.log("Projeto iniciado!")