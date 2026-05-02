import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import { config } from './src/config/config.js';

connectDB();
const port = Number(config.PORT);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

