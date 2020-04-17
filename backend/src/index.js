// Start it all in here
require('dotenv').config({ path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Express Middleware happens here


// Start 
server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  },
}, details => {
  console.log(`Server is now running on port http://localhost:${details.port}`)
});