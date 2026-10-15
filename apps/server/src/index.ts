import { createHealthServer } from './app.js';
import { ServerConfigError, loadServerConfig } from './config.js';
import { SERVER_VERSION } from './version.js';

let config;
try {
  config = loadServerConfig(process.env);
} catch (error) {
  if (error instanceof ServerConfigError) {
    console.error(`[smash-arena] invalid configuration: ${error.message}`);
    process.exit(1);
  }
  throw error;
}

const server = createHealthServer();

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `[smash-arena] port ${config.port} is already in use. Choose another one with PORT=<port>.`,
    );
  } else {
    console.error('[smash-arena] server error:', error.message);
  }
  process.exit(1);
});

server.listen(config.port, config.host, () => {
  console.log(`[smash-arena] server v${SERVER_VERSION} listening on http://${config.host}:${config.port}`);
  console.log(`[smash-arena] health check: curl http://${config.host}:${config.port}/health`);
});

function shutdown(signal: string): void {
  console.log(`[smash-arena] received ${signal}, shutting down`);
  server.close(() => process.exit(0));
  // Do not hang forever on lingering keep-alive sockets.
  setTimeout(() => process.exit(0), 2000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
