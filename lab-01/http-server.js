/**
 * BDF Lab 01: Node.js and Express Server
 * Part 1: Basic HTTP Server using Node.js built-in 'http' module
 */

// Step 1: Import the built-in 'http' module
const http = require('http');

// Step 2: Define the port to listen on
const PORT = 3000;

// Step 3: Create the server using http.createServer()
// The callback function receives the request (req) and response (res) objects
const server = http.createServer((req, res) => {
  // Set the response HTTP status code to 200 (OK)
  // Set the Content-Type header to plain text
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Return "Hello" as the response body and end the response
  res.end('Hello');
});

// Step 4: Start listening for incoming requests on port 3000
server.listen(PORT, () => {
  console.log(`HTTP Server is running successfully at http://localhost:${PORT}`);
});

