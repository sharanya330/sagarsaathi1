import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDriver extends Document {
    email: string;
    phone: string;
    name?: string;
    vehicleType: 'SUPRO' | 'INNOVA' | 'SUV' | 'TEMPO_TRAVELLER' | 'OTHER';
    vehicleNumber?: string;
    cityBase?: string;
    docs?: {
        licenseUrl?: string;
        rcUrl?: string;
        insuranceUrl?: string;
        permitUrl?: string;
        selfieUrl?: string;
    };
    isVerified: boolean;
    strikeCount: number;
    isSuspended: boolean;
    scheduledTrips: Array<{
        tripId: mongoose.Types.ObjectId;
        startDate: Date;
        endDate: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const driverSchema = new Schema<IDriver>(
    {
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        name: { type: String },
        vehicleType: {
            type: String,
            enum: ['SUPRO', 'INNOVA', 'SUV', 'TEMPO_TRAVELLER', 'OTHER'],
            required: true,
        },
        vehicleNumber: { type: String },
        cityBase: { type: String },
        docs: {
            licenseUrl: String,
            rcUrl: String,
            insuranceUrl: String,
            permitUrl: String,
            selfieUrl: String,
        },
        isVerified: { type: Boolean, default: false },
        strikeCount: { type: Number, default: 0 },
        isSuspended: { type: Boolean, default: false },
        scheduledTrips: [
            {
                tripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
                startDate: Date,
                endDate: Date,
            },
        ],
    },
    { timestamps: true }
);

const Driver: Model<IDriver> = mongoose.models.Driver || mongoose.model<IDriver>('Driver', driverSchema);

export default Driver;
