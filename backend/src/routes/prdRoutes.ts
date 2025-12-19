import express from 'express';
import * as prdController from '../controllers/prdController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All routes require auth

router.post('/plans/:planId/generate', prdController.generatePRD);
router.get('/', prdController.getPRDs);
router.get('/:id', prdController.getPRD);
router.get('/:id/export', prdController.exportPRD);

export default router;
