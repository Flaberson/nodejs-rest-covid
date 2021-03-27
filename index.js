const request = require('request');
const http = require('http');

const hostname='127.0.0.1';
const port = 3000;

const server = http.createServer((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-type','text/plain');
    res.end('Olá aplicação ok');
});

server.listen(port,hostname, () =>{
    console.log('Servidor iniciado: '+ hostname+':'+port);
});