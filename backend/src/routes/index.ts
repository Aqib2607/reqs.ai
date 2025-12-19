import { Router } from 'express';
import { sendResponse } from '../utils/apiResponse';
import authRoutes from './authRoutes';
import apiKeyRoutes from './apiKeyRoutes';
import planRoutes from './planRoutes';
import prdRoutes from './prdRoutes';
import userRoutes from './userRoutes';
import dashboardRoutes from './dashboardRoutes';
import searchRoutes from './searchRoutes';
import feedbackRoutes from './feedback.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/api-keys', apiKeyRoutes);
router.use('/plans', planRoutes);
router.use('/prds', prdRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/search', searchRoutes);
router.use('/feedback', feedbackRoutes);

router.get('/health', (req, res) => {
    sendResponse(res, 200, { status: 'healthy', timestamp: new Date() }, 'Server is healthy');
});

export default router;
