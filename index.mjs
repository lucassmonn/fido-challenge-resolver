import fs from 'fs';
import path, { dirname } from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const options = {
    key: fs.readFileSync(path.join(dirname(fileURLToPath(import.meta.url)), 'certs/server.key')),
    cert: fs.readFileSync(path.join(dirname(fileURLToPath(import.meta.url)), 'certs/server.cert'))
}

const serveStaticFile = (res, filePath, contentType, responseCode = 200) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Error');
        } else {
            res.writeHead(responseCode, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

https.createServer(options, (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        serveStaticFile(res, path.join(dirname(fileURLToPath(import.meta.url)), 'index.html'), 'text/html');
    } else if (req.url === '/script.mjs') {
        serveStaticFile(res, path.join(dirname(fileURLToPath(import.meta.url)), 'script.mjs'), 'application/javascript');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Not Found');
    }
}).listen(8443, () => {
    console.log('HTTPS Server running on https://localhost:8443');
});
