import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
import { sendResponse } from '../utils/apiResponse';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user!._id);
        sendResponse(res, 200, user);
    } catch (err) {
        next(err);
    }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1) Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
        }

        // 2) Filtered out unwanted fields names that are not allowed to be updated
        const allowedFields = ['name', 'email']; // Add more if needed
        const filteredBody: any = {};
        Object.keys(req.body).forEach((el) => {
            if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
        });

        // 3) Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user!._id, filteredBody, {
            new: true,
            runValidators: true,
        });

        sendResponse(res, 200, updatedUser);
    } catch (err) {
        next(err);
    }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1) Get user from collection
        const user = await User.findById(req.user!._id).select('+password');
        if (!user) return next(new AppError('User not found', 404));

        // 2) Check if POSTed current password is correct
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return next(new AppError('Please provide current and new password', 400));
        }

        if (!(await user.comparePassword(currentPassword))) {
            return next(new AppError('Incorrect current password', 401));
        }

        // 3) Update password
        user.password = newPassword;
        await user.save();

        // 4) Log user in, send JWT
        // For now, we just enforce re-login or return success. Usually we'd send a new token.
        // Let's return success and let client handle re-auth if needed, or we can send token if we want.
        // The requirement didn't specify auto-relogin, but standard security often revokes old tokens.
        // We'll just return success for simplicity.

        sendResponse(res, 200, null, 'Password updated successfully');
    } catch (err) {
        next(err);
    }
};
