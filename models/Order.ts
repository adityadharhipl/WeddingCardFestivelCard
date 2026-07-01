// models/Order.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
  imageId: string;
  title: string;
  price: number;
  imageUrl: string;
}

export interface IOrder extends Document {
  customerName: string;
  phone: string;
  items: IOrderItem[];
  total: number;
  upiRef: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date;
}

const OrderItemSchema = new mongoose.Schema({
  imageId: { type: String, required: true },
  title:   { type: String, required: true },
  price:   { type: Number, required: true },
  imageUrl:{ type: String, required: true },
});

const OrderSchema: Schema<IOrder> = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone:        { type: String, required: true },
  items:        { type: [OrderItemSchema], required: true },
  total:        { type: Number, required: true },
  upiRef:       { type: String, required: true },
  status:       { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
  createdAt:    { type: Date, default: Date.now },
});

const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
