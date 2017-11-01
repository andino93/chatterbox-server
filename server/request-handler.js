const fs = require('fs');
let results;

const requestHandler = (request, response) => {
  // let data = {
  //   results: results
  // };

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  let statusCode;
  let headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  
  if (request.url !== '/classes/messages') {
    statusCode = 404;
  }
  
  
  if (request.method === 'GET' && statusCode !== 404) {
    statusCode = 200;
    console.log('start reading the data')
    fs.readFile('./test.txt', (err, mess) => {
      if(err) {
        throw err;
      }
      console.log('data read')
      results = JSON.parse(mess.toString().slice(0, -1) + ']');
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results}));
    })
  }
  
  if (request.method === 'OPTIONS' && statusCode !== 404) {
    statusCode = 202;
    response.writeHead(statusCode, headers);
    response.end();
  }
  
  if (request.method === 'POST' && statusCode !== 404) {
    statusCode = 201;
    let currentPost = [];
    request.on('data', (chunk) => {
      currentPost.push(chunk);
    }).on('end', () => {    
      currentPost = Buffer.concat(currentPost).toString();
      fs.appendFile('test.txt', currentPost + ',')
    });
    response.writeHead(statusCode, headers);
    response.end();
  }
  
  
};

const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10
};

exports.requestHandler = requestHandler;
