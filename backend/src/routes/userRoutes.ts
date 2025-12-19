import express from 'express';
import * as userController from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/me', userController.getMe);
router.put('/me', userController.updateMe);
router.patch('/me/password', userController.updatePassword);

export default router;
