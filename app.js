const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        // Listen data event  (chunk, bus of data...)
        const body = [];

        // Listeners
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        // This return is very important 
        // Event Driven Code Execution
        return req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];

            fs.writeFileSync('message.txt', message);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
    }

    // Sans le return au niveau du 2e listener, le code synchrone suivant aurait été atteint !!!
    // Ne pas oublier les listeners sont stockés dans la pile (Event Loop), le code n'étant pas bloquant on passe à la ligne suivante !
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>First Page</title></head>');
    res.write('<body><h1>Hello from my nodejs server</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(3000);