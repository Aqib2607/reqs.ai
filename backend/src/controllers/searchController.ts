import { Request, Response, NextFunction } from 'express';
import Plan from '../models/Plan';
import PRD from '../models/PRD';
import { sendResponse } from '../utils/apiResponse';

export const search = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q, type } = req.query;
        const query = q as string;
        const userId = req.user!._id;

        if (!query || query.length < 2) {
            return sendResponse(res, 200, []);
        }

        let results: any[] = [];

        if (!type || type === 'plan') {
            const plans = await Plan.find(
                { userId, isDeleted: false, $text: { $search: query } },
                { score: { $meta: 'textScore' } }
            )
                .sort({ score: { $meta: 'textScore' } })
                .limit(10);

            results.push(...plans.map(p => ({ ...p.toObject(), type: 'plan' })));
        }

        if (!type || type === 'prd') {
            const prds = await PRD.find(
                { userId, $text: { $search: query } },
                { score: { $meta: 'textScore' } }
            )
                .sort({ score: { $meta: 'textScore' } })
                .limit(10);

            results.push(...prds.map(p => ({ ...p.toObject(), type: 'prd' })));
        }

        // Sort combined results by score if mixing types (approximation)
        if (!type) {
            results.sort((a, b) => (b.score || 0) - (a.score || 0));
        }

        sendResponse(res, 200, results);
    } catch (err) {
        next(err);
    }
};
