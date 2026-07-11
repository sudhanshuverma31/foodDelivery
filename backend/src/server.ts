import app from './app';
import { connectDatabase } from './config/db';
import { seedDishesIfEmpty } from './models/dish.model';
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

async function startServer() {
  // Initialize Database Connection
  await connectDatabase();

  // If connected to a real MongoDB database, seed it if empty
  await seedDishesIfEmpty();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 Status Endpoint: http://localhost:${PORT}/api/status`);
    console.log('Press Ctrl+C to terminate the process\n');
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
