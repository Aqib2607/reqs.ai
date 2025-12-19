import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    isEmailVerified: boolean;
    refreshToken?: string;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    lastLogin?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    createPasswordResetToken(): string;
    createVerificationToken(): string;
}

const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
            select: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
            select: false
        },
        verificationToken: String,
        verificationTokenExpires: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        lastLogin: Date,
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password!, 12);
    next();
});

// Instance method to check if password is correct
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password!);
};

// Instance method to create generic random token
userSchema.methods.createPasswordResetToken = function (): string {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Token expires in 1 hour (changed from 10 mins)
    this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

    return resetToken;
};

userSchema.methods.createVerificationToken = function (): string {
    const verifyToken = crypto.randomBytes(32).toString('hex');

    this.verificationToken = crypto
        .createHash('sha256')
        .update(verifyToken)
        .digest('hex');

    // Token expires in 24 hours
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return verifyToken;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
