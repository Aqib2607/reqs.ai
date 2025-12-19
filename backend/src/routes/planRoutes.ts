import express from 'express';
import * as planController from '../controllers/planController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All routes require auth

router.post('/', planController.createPlan);
router.get('/', planController.getPlans);
router.get('/:id', planController.getPlan);
router.put('/:id', planController.updatePlan);
router.delete('/:id', planController.deletePlan);

export default router;
