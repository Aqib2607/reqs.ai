import { Request, Response, NextFunction } from 'express';
import Feedback from '../models/feedback.model';

export const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, message, rating, email } = req.body;
        const feedback = await Feedback.create({ type, message, rating, email });
        res.status(201).json({ status: 'success', data: { feedback } });
    } catch (error) {
        next(error);
    }
};

export const getFeedbacks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', results: feedbacks.length, data: { feedbacks } });
    } catch (error) {
        next(error);
    }
}
