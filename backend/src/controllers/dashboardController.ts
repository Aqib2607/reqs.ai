import { Request, Response, NextFunction } from 'express';
import Plan from '../models/Plan';
import PRD from '../models/PRD';
import { sendResponse } from '../utils/apiResponse';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id;

        // 1. Counts
        const planCount = await Plan.countDocuments({ userId, isDeleted: false });
        const prdCount = await PRD.countDocuments({ userId });

        // 2. Recent Activity - Plans
        const recentPlans = await Plan.find({ userId, isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('ideaText status createdAt');

        // 3. This Month's Activity
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const plansThisMonth = await Plan.countDocuments({
            userId,
            isDeleted: false,
            createdAt: { $gte: startOfMonth }
        });

        const prdsThisMonth = await PRD.countDocuments({
            userId,
            createdAt: { $gte: startOfMonth }
        });

        sendResponse(res, 200, {
            totalPlans: planCount,
            totalPRDs: prdCount,
            activityThisMonth: {
                plans: plansThisMonth,
                prds: prdsThisMonth
            },
            recentPlans
        });
    } catch (err) {
        next(err);
    }
};
