import { Document, Schema, model } from 'mongoose';

export interface Alarm extends Document {
  mode: 'arrive' | 'leave';
  period: number;
  password: string;
  expireAt: Date;
}

const AlarmSchema = new Schema({
  mode: String,
  period: Number,
  password: String,
  expireAt: { type: Date, default: undefined },
});

AlarmSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default model<Alarm>('Alarm', AlarmSchema);
