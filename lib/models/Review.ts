import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IReview extends Document {
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    name:     { type: String, required: true, trim: true, maxlength: 50 },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, required: true, trim: true, maxlength: 500 },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Review = models.Review || model<IReview>("Review", ReviewSchema);
