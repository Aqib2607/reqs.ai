import jwt from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../models/User';
import { Response } from 'express';

export const signToken = (id: string) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions);
};

export const createSendToken = (user: IUser, statusCode: number, res: Response) => {
    const token = signToken(user._id as unknown as string);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

export const sendEmail = async (options: { email: string; subject: string; message: string }) => {
    // MOCK EMAIL SENDER
    console.log('--- EMAIL SENT ---');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log('------------------');
};
