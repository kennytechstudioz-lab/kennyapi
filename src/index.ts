import app from './app';
import connectDB from './config/db';

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
    🚀 Server ready at: http://localhost:${PORT}
    🛠️  Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
