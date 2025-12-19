import { Request, Response, NextFunction } from 'express';
import APIKey from '../models/APIKey';
import { encrypt, decrypt } from '../utils/encryption';
import { sendResponse } from '../utils/apiResponse';
import AppError from '../utils/AppError';

export const addKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key, label } = req.body;
        if (!key) return next(new AppError('Please provide an API key', 400));

        // Basic validation for simple strings or patterns could go here

        const encryptedKey = encrypt(key.trim());
        const last4 = key.slice(-4);

        const newKey = await APIKey.create({
            userId: req.user!._id,
            key: encryptedKey,
            last4,
            label: label || 'My Gemini Key',
        });

        sendResponse(res, 201, {
            id: newKey._id,
            last4: newKey.last4,
            label: newKey.label,
        });
    } catch (err) {
        next(err);
    }
};

export const getKeys = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const keys = await APIKey.find({ userId: req.user!._id }).select('label last4 isActive createdAt');
        sendResponse(res, 200, keys);
    } catch (err) {
        next(err);
    }
};

export const deleteKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = await APIKey.findOneAndDelete({ _id: req.params.id, userId: req.user!._id });
        if (!key) return next(new AppError('API Key not found', 404));

        sendResponse(res, 204, null, 'API Key deleted');
    } catch (err) {
        next(err);
    }
};
