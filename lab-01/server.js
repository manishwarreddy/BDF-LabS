/**
 * BDF Lab 01: Node.js and Express Server
 * Part 2: Express Server with routing, status codes, and error handling
 */
// Step 1: Import express module
const express = require('express');
// Step 2: Initialize Express application instance
const app = express();
// Step 3: Define port number (defaults to 3000, configurable via environment variable)
const PORT = process.env.PORT || 3000;
// ==========================================
// ROUTES
// ==========================================
/**
 * Route 1: GET /
 * Method: GET
 * Description: Returns a welcome text message
 * Status Code: 200 OK
 */
app.get('/', (req, res) => {
  res.status(200).send('Welcome to BDF Lab 01: Node.js and Express Server!');
});
/**
 * Route 2: GET /about
 * Method: GET
 * Description: Returns JSON containing student name and section
 * Status Code: 200 OK
 */
app.get('/about', (req, res) => {
  res.status(200).json({
    name: 'A. Manishwar Reddy', // Student Name (update if needed)
    section: 'CSE 1A (AI & DE)'          // Student Section (update if needed)
  });
});
/**
 * Route 3: GET /time
 * Method: GET
 * Description: Returns the current date and time using JavaScript new Date()
 * Status Code: 200 OK
 */
app.get('/time', (req, res) => {
  const currentDateTime = new Date();
  res.status(200).send(`Current Date and Time: ${currentDateTime.toString()}`);
});
/**
 * Route 4: Catch-all 404 Handler for Unknown Routes
 * Method: Any / GET
 * Description: Intercepts requests that do not match any defined endpoint
 * Status Code: 404 Not Found
 */
app.use((req, res) => {
  res.status(404).send('404 Not Found: The requested route does not exist.');
});
// ==========================================
// START SERVER & EXPORT
// ==========================================

// Step 4: Start Express server locally when executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Express Server is running successfully at http://localhost:${PORT}`);
  });
}

// Export Express app for Vercel serverless deployment
module.exports = app;

