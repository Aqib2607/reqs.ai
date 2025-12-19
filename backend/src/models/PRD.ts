import mongoose, { Schema, Document } from 'mongoose';

export interface IPRD extends Document {
    userId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    title: string;
    content: any; // Storing the structured PRD JSON
    status: 'pending' | 'completed' | 'failed';
    version: number;
    wordCount: number;
    generationDuration: number; // in seconds
    createdAt: Date;
    updatedAt: Date;
}

const prdSchema = new Schema<IPRD>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'PRD must belong to a user'],
        },
        planId: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            required: [true, 'PRD must belong to a plan'],
        },
        title: {
            type: String,
            default: 'Application PRD',
        },
        content: {
            type: Schema.Types.Mixed,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        version: {
            type: Number,
            default: 1,
        },
        wordCount: {
            type: Number,
            default: 0,
        },
        generationDuration: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
prdSchema.index({ userId: 1, planId: 1 });
prdSchema.index({ planId: 1 });
prdSchema.index({ title: 'text' });

const PRD = mongoose.model<IPRD>('PRD', prdSchema);

export default PRD;
