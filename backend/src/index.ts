import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import borrowRoutes from './routes/borrowRoutes';
import { startCronJobs } from './cron/overdueCron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/borrow', borrowRoutes);

// Start background jobs
startCronJobs();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
