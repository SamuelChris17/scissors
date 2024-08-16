import { timeStamp } from 'console';
import mongoose, { Schema, Document } from 'mongoose';

interface IClick {
    ipAddress: string;
    timestamp: Date;
}

export interface IUrl extends Document {
    originalUrl: string;
    shortCode: string;
    createdAt: Date;
    shortUrl: string;
    clicks: number;
    clickDetails: IClick[];
    customShortUrl?: string;
}

const urlSchema: Schema = new Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    shortUrl: { type: String, required: true},
    clicks: { type: Number, default: 0},
    clickDetails: [{
        ipAddress: { type: String },
        timestamp: { type: Date, default: Date.now}
    }],
    customShortUrl: {
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: { type: Date, default: Date.now },
})

const Url = mongoose.model<IUrl>('Url', urlSchema);

export default Url;