import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import { config } from './src/config/config.js';

/* Connect to DB first, then start listening */
connectDB()
  .then(() => {
    const port = Number(config.PORT);
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Fatal startup error:", err.message);
    process.exit(1);
  });
