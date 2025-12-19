import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
    userId: mongoose.Types.ObjectId;
    ideaText: string;
    generatedPlan: any;
    status: 'pending' | 'completed' | 'failed';
    visibility: 'private' | 'public';
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Plan must belong to a user'],
        },
        ideaText: {
            type: String,
            required: [true, 'Please provide an idea'],
            maxlength: [5000, 'Idea cannot exceed 5000 characters'],
        },
        generatedPlan: {
            type: Schema.Types.Mixed, // Storing JSON structure
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        visibility: {
            type: String,
            enum: ['private', 'public'],
            default: 'private',
        },
        isDeleted: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
planSchema.index({ userId: 1, createdAt: -1 });
planSchema.index({ status: 1 });
planSchema.index({ ideaText: 'text' });

const Plan = mongoose.model<IPlan>('Plan', planSchema);

export default Plan;
