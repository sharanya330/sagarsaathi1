import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String },
    },
    { timestamps: true }
);

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
