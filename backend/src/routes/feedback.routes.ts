import express from 'express';
import { createFeedback, getFeedbacks } from '../controllers/feedback.controller';
// import { protect, restrictTo } from '../middleware/auth'; // Uncomment if you want to protect getting feedbacks

const router = express.Router();

router.post('/', createFeedback);
router.get('/', getFeedbacks); // Add protection middleware if needed

export default router;
