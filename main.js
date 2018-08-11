// content of index.js
const http = require('http')
const serverfs = require('./serverfs');
const port = 3000

const cors = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Request-Method': '*',
	'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT',
	'Access-Control-Allow-Headers': 'authorization, content-type'
};

const requestHandler = (request, response) => {
	if(request.method === 'OPTIONS') {
		response.writeHead(200, cors);
		response.end('');
	}
	else if(request.method === 'GET') {
		if(request.url === '/favicon.ico') {
			return;
		} else if (request.url === '/') {
			const promise = serverfs.parseDir().then(res => {
			console.log(JSON.stringify(res));
			response.writeHead(200, cors);
			response.end(JSON.stringify(res));
			}).catch('some error here');
		} else if (request.url.includes('.json')) {
			let name = decodeURI(request.url);
			const promise = serverfs.parseFile(name).then(res => {
				const character = JSON.parse(res);
				console.log(JSON.stringify(character));
				response.writeHead(200, cors);
				response.end(JSON.stringify(character));
			}).catch('some error there');
			
		}
		
	} else if (request.method === 'POST') {
		let body = [];
		request.on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			body = Buffer.concat(body).toString();
			// console.log(body);
			if (!!body && body != '') {
				let bodyjson = JSON.parse(body);
				console.log(bodyjson);
				const promise = serverfs.writeFile(`${bodyjson._displayName}.json`, body).then(res => {
					// console.log(res);
					response.writeHead(200, cors);
					response.end();
				}).catch('some other error even');
			} else {
				console.log('empty post, no files have been changed');
				response.writeHead(400, cors);
				response.end('Body must not be blank');
			}
		});
		
	} else {
		response.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
		return response.end('Method Not Supported');
	}
	
	
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
	if (err) {
		return console.log('something bad happened', err)
	}

	console.log(`server is listening on ${port}`)
});