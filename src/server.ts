/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

const database_url = config.database_url as string;
const port = config.port;

let server: Server;

async function main() {
  try {
    await mongoose.connect(database_url);
    console.log('🛢️  Database connection successful ✅');
    server = app.listen(port, () => {
      console.log(`🎯 Server listening on port: ${port}`);
    });
  } catch (err) {
    console.error('🛢️ Failed to connect to database. ❌', err);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
