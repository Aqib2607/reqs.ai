import { Request, Response, NextFunction } from 'express';
import PRD from '../models/PRD';
import Plan from '../models/Plan';
import APIKey from '../models/APIKey';
import { generatePRDInternal } from '../services/prdService';
import { generatePDF, generateMarkdown } from '../services/exportService';
import { decrypt } from '../utils/encryption';
import { sendResponse } from '../utils/apiResponse';
import AppError from '../utils/AppError';

export const generatePRD = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { planId } = req.params;

        // 1. Verify Plan Ownership
        const plan = await Plan.findOne({ _id: planId, userId: req.user!._id, isDeleted: false });
        if (!plan) return next(new AppError('Plan not found', 404));

        if (plan.status !== 'completed' || !plan.generatedPlan) {
            return next(new AppError('Plan must be completed before generating a PRD', 400));
        }

        // 2. Get API Key
        const apiKeyDoc = await APIKey.findOne({ userId: req.user!._id, isActive: true }).select('+key');
        if (!apiKeyDoc) {
            return next(new AppError('No active API key found', 400));
        }

        // 3. Create Pending PRD
        const newPRD = await PRD.create({
            userId: req.user!._id,
            planId: plan._id,
            status: 'pending',
        });

        // 4. Generate Content
        try {
            const decryptedKey = decrypt(apiKeyDoc.key);
            const prdContent = await generatePRDInternal(decryptedKey, plan.generatedPlan);

            newPRD.content = prdContent;
            newPRD.title = prdContent.title || 'Generated PRD';
            newPRD.status = 'completed';
            newPRD.wordCount = JSON.stringify(prdContent).length; // Rough estimate
            await newPRD.save();

            sendResponse(res, 201, newPRD);
        } catch (error: any) {
            newPRD.status = 'failed';
            await newPRD.save();
            return next(new AppError(`PRD generation failed: ${error.message}`, 500));
        }
    } catch (err) {
        next(err);
    }
};

export const getPRDs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const { planId, status, sortBy, order } = req.query;
        const filter: any = { userId: req.user!._id };

        if (planId) filter.planId = planId;
        if (status) filter.status = status;

        const sortOptions: any = {};
        if (sortBy) {
            sortOptions[sortBy as string] = order === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1;
        }

        const prds = await PRD.find(filter)
            .populate('planId', 'ideaText')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const total = await PRD.countDocuments(filter);

        sendResponse(res, 200, {
            results: prds.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            prds,
        });
    } catch (err) {
        next(err);
    }
};

export const getPRD = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prd = await PRD.findOne({ _id: req.params.id, userId: req.user!._id })
            .populate('planId', 'ideaText');

        if (!prd) return next(new AppError('PRD not found', 404));

        sendResponse(res, 200, prd);
    } catch (err) {
        next(err);
    }
};

export const exportPRD = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { format } = req.query;

        const prd = await PRD.findOne({ _id: id, userId: req.user!._id });
        if (!prd) return next(new AppError('PRD not found', 404));
        if (!prd.content) return next(new AppError('PRD has no content', 400));

        if (format === 'pdf') {
            const buffer = await generatePDF(prd.content);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${prd.title}.pdf"`);
            res.send(buffer);
        } else if (format === 'markdown') {
            const markdown = generateMarkdown(prd.content);
            res.setHeader('Content-Type', 'text/markdown');
            res.setHeader('Content-Disposition', `attachment; filename="${prd.title}.md"`);
            res.send(markdown);
        } else {
            // Default to JSON
            sendResponse(res, 200, prd.content);
        }
    } catch (err) {
        next(err);
    }
};
