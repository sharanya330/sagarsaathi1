import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITrip extends Document {
    user: mongoose.Types.ObjectId;
    driver?: mongoose.Types.ObjectId;
    origin?: {
        address?: string;
        lat?: number;
        lng?: number;
    };
    stops: Array<{
        address?: string;
        lat?: number;
        lng?: number;
        order?: number;
    }>;
    groupSize: number;
    startDate: Date;
    endDate: Date;
    status: 'PENDING' | 'OFFERED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    lastKnownLocation?: {
        lat?: number;
        lng?: number;
        updatedAt?: Date;
    };
    sosTriggered: boolean;
    sosHistory: Array<{
        triggeredAt?: Date;
        lat?: number;
        lng?: number;
        handledBy?: string;
    }>;
    ratingByUser?: number;
    leadFeePaid: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const tripSchema = new Schema<ITrip>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
        origin: {
            address: String,
            lat: Number,
            lng: Number,
        },
        stops: [
            {
                address: String,
                lat: Number,
                lng: Number,
                order: Number,
            },
        ],
        groupSize: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ['PENDING', 'OFFERED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
            default: 'PENDING',
        },
        lastKnownLocation: {
            lat: Number,
            lng: Number,
            updatedAt: Date,
        },
        sosTriggered: { type: Boolean, default: false },
        sosHistory: [
            {
                triggeredAt: Date,
                lat: Number,
                lng: Number,
                handledBy: String,
            },
        ],
        ratingByUser: { type: Number, min: 1, max: 5 },
        leadFeePaid: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Trip: Model<ITrip> = mongoose.models.Trip || mongoose.model<ITrip>('Trip', tripSchema);

export default Trip;
