import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    phone: string;
    name?: string;
    emergencyContact?: {
        name?: string;
        phone?: string;
    };
    activeTrip?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        name: { type: String },
        emergencyContact: {
            name: String,
            phone: String,
        },
        activeTrip: { type: Schema.Types.ObjectId, ref: 'Trip' },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
