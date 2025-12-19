import express from 'express';
import * as apiKeyController from '../controllers/apiKeyController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All routes require auth

router.post('/', apiKeyController.addKey);
router.get('/', apiKeyController.getKeys);
router.delete('/:id', apiKeyController.deleteKey);

export default router;
