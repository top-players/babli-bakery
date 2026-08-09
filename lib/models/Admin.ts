import { Schema, Document, model, models } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username:     { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin = models.Admin || model<IAdmin>("Admin", AdminSchema);
