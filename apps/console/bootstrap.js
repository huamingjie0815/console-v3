import { handler } from './build/handler.js';
import express from 'express';
import http from 'http';

const app = express();

app.use(handler);

const server = http.createServer(app);

server.listen(9000, () => {
	console.log('listening on port 9000');
});

server.timeout = 0;
server.keepAliveTimeout = 0;