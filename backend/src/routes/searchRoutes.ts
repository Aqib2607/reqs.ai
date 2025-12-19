import express from 'express';
import * as searchController from '../controllers/searchController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', searchController.search);

export default router;
