import mongoose, { Schema, Document } from 'mongoose';

export interface IAPIKey extends Document {
    userId: mongoose.Types.ObjectId;
    key: string; // Encrypted
    last4: string;
    label: string;
    keyType: 'gemini';
    isActive: boolean;
    createdAt: Date;
}

const apiKeySchema = new Schema<IAPIKey>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'API Key must belong to a user'],
        },
        key: {
            type: String,
            required: true,
            select: false, // Never return full encrypted key by default
        },
        last4: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: 'My API Key',
        },
        keyType: {
            type: String,
            enum: ['gemini'],
            default: 'gemini',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

apiKeySchema.index({ userId: 1 });

const APIKey = mongoose.model<IAPIKey>('APIKey', apiKeySchema);

export default APIKey;
