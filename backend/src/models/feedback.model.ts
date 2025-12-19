import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
    type: string;
    message: string;
    rating?: number;
    email?: string;
    createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
    type: { type: String, required: true, enum: ['bug', 'feature', 'general'] },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    email: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
