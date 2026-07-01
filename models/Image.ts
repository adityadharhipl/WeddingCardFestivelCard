// models/Image.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IImage extends Document {
  title: string;
  category: 'wedding' | 'birthday' | 'anniversary' | 'housewarming' | 'god' | 'frame' | 'festival';
  imageUrl: string;
  price: number;
  createdAt: Date;
}

const ImageSchema: Schema<IImage> = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['wedding', 'birthday', 'anniversary', 'housewarming', 'god', 'frame', 'festival'],
    required: true,
  },
  imageUrl: { type: String, required: true },
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const ImageModel: Model<IImage> =
  (mongoose.models.Image as Model<IImage>) ||
  mongoose.model<IImage>('Image', ImageSchema);

export default ImageModel;
