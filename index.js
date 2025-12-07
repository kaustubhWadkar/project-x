// index.js
const express = require('express');
const morgan = require('morgan');

const PORT = parseInt(process.env.PORT || '3000', 10);
const GREETING = process.env.GREETING || 'Hello from Microservice';
const app = express();

app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.send(GREETING);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Optional readiness endpoint
app.get('/ready', (req, res) => {
  res.status(200).send('ready');
});

const server = app.listen(PORT, () => {
  console.log(`Microservice listening on port ${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal}, shutting down...`);
  server.close((err) => {
    if (err) {
      console.error('Error during close', err);
      process.exit(1);
    }
    console.log('Shutdown complete');
    process.exit(0);
  });

  // force exit after 10s
  setTimeout(() => {
    console.warn('Forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
