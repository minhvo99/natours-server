import app from './index';
import logger from './logger/winston';

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
   console.log(`Server is listening at http://localhost:${port}`);
});

process.on('unhandledRejection', (err: any) => {
   logger.error('UNHANDLED Rejection! 💣 Shutting down...');
   server.close(() => {
      process.exit(1);
   });
});

process.on('uncaughtException', (err: any) => {
   logger.error('UNCAUGHT Exception! 💣 Shutting down...');
   process.exit(1);
});
