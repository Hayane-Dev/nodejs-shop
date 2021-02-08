const http = require('http');

const server = http.createServer((req, res) => {
    // process.exit();
    // console.log(req.url, req.method, req.headers);
    console.log('url:', req.url);
    console.log('method', req.method);
    console.log('headers', req.headers);

    // Send a response
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>First Page</title></head>');
    res.write('<body><h1>Hello from my nodejs server</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(3000);