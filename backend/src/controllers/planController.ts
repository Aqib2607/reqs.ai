import { Request, Response, NextFunction } from 'express';
import Plan from '../models/Plan';
import APIKey from '../models/APIKey';
import { generatePlanInternal } from '../services/geminiService';
import { decrypt } from '../utils/encryption';
import { sendResponse } from '../utils/apiResponse';
import AppError from '../utils/AppError';

export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ideaText, visibility } = req.body;

        if (!ideaText) {
            return next(new AppError('Please provide an idea description', 400));
        }

        // 1. Get User's API Key
        const apiKeyDoc = await APIKey.findOne({ userId: req.user!._id, isActive: true }).select('+key');
        if (!apiKeyDoc) {
            return next(new AppError('No active API key found. Please add a Gemini API key in settings.', 400));
        }

        // 2. Create Pending Plan
        const newPlan = await Plan.create({
            userId: req.user!._id,
            ideaText,
            visibility: visibility || 'private',
            status: 'pending',
        });

        // 3. Call Gemini Service (Async handling could be improved with queues, but awaiting for now)
        try {
            const decryptedKey = decrypt(apiKeyDoc.key);
            const generatedContent = await generatePlanInternal(decryptedKey, ideaText);

            newPlan.generatedPlan = generatedContent;
            newPlan.status = 'completed';
            await newPlan.save();

            sendResponse(res, 201, newPlan);
        } catch (error: any) {
            newPlan.status = 'failed';
            await newPlan.save();
            return next(new AppError(`Plan generation failed: ${error.message}`, 500));
        }
    } catch (err) {
        next(err);
    }
};

export const getPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const { status, sortBy, order } = req.query;
        const filter: any = { userId: req.user!._id, isDeleted: false };

        if (status) {
            filter.status = status;
        }

        const sortOptions: any = {};
        if (sortBy) {
            sortOptions[sortBy as string] = order === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1;
        }

        const plans = await Plan.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const total = await Plan.countDocuments(filter);

        sendResponse(res, 200, {
            results: plans.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            plans,
        });
    } catch (err) {
        next(err);
    }
};

export const getPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plan = await Plan.findOne({ _id: req.params.id, userId: req.user!._id, isDeleted: false });

        if (!plan) {
            return next(new AppError('Plan not found', 404));
        }

        sendResponse(res, 200, plan);
    } catch (err) {
        next(err);
    }
};

export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plan = await Plan.findOne({ _id: req.params.id, userId: req.user!._id, isDeleted: false });

        if (!plan) {
            return next(new AppError('Plan not found', 404));
        }

        // Only allow updating generatedPlan or visibility
        if (req.body.generatedPlan) plan.generatedPlan = req.body.generatedPlan;
        if (req.body.visibility) plan.visibility = req.body.visibility;

        await plan.save();

        sendResponse(res, 200, plan);
    } catch (err) {
        next(err);
    }
};

export const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plan = await Plan.findOne({ _id: req.params.id, userId: req.user!._id });

        if (!plan) {
            return next(new AppError('Plan not found', 404));
        }

        plan.isDeleted = true;
        await plan.save();

        sendResponse(res, 204, null);
    } catch (err) {
        next(err);
    }
};
