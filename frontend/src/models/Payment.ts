import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
    driver: mongoose.Types.ObjectId;
    trip: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    gateway: string;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
        trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        status: {
            type: String,
            enum: ['PENDING', 'SUCCESS', 'FAILED'],
            default: 'PENDING',
        },
        gateway: { type: String, default: 'RAZORPAY' },
        gatewayOrderId: String,
        gatewayPaymentId: String,
    },
    { timestamps: true }
);

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
