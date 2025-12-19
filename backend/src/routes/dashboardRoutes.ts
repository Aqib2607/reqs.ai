import express from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/stats', dashboardController.getStats);

export default router;
