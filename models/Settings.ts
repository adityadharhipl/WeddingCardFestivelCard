// models/Settings.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISettings extends Document {
  isPremium: boolean;
  upiId: string;
  siteName: string;
  upiName: string;
  defaultNames: string;
  defaultDate: string;
  defaultVenue: string;
  defaultStyle: string;
}

const SettingsSchema: Schema<ISettings> = new mongoose.Schema({
  isPremium: { type: Boolean, default: false },
  upiId: { type: String, default: '' },
  siteName: {
    type: String, default: "Dwivedi's Enterprise" },
  upiName: {
    type: String, default: "Dwivedi's Store" },
  defaultNames: { type: String, default: 'Rahul & Priya' },
  defaultDate: { type: String, default: 'November 26, 2026 at 7:00 PM' },
  defaultVenue: { type: String, default: 'Royal Orchid Banquet, New Delhi' },
  defaultStyle: { type: String, default: 'royal_gold' },
});

const Settings: Model<ISettings> =
  (mongoose.models.Settings as Model<ISettings>) ||
  mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
