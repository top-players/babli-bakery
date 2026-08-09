import { Schema, Document, model, models } from "mongoose";

export interface IOrderItem {
  name: string;
  price: number;
  qty: number;
}

export type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered"
  | "Delivered - Confirmed";

export interface IOrder extends Document {
  customerName: string;
  phone: string;
  address: string;
  items: IOrderItem[];
  totalAmount: number;
  paymentMode: "COD" | "Online";
  status: OrderStatus;
  trackingId: string;
  deliveryConfirmedByCustomer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  name:  { type: String, required: true },
  price: { type: Number, required: true },
  qty:   { type: Number, required: true, min: 1 },
});

const OrderSchema = new Schema<IOrder>(
  {
    customerName:               { type: String, required: true, trim: true },
    phone:                      { type: String, required: true, trim: true },
    address:                    { type: String, required: true, trim: true },
    items:                      [OrderItemSchema],
    totalAmount:                { type: Number, required: true },
    paymentMode:                { type: String, enum: ["COD", "Online"], default: "COD" },
    status:                     {
                                  type: String,
                                  enum: ["Pending", "Preparing", "Out for Delivery", "Delivered", "Delivered - Confirmed"],
                                  default: "Pending",
                                },
    trackingId:                 { type: String, unique: true },
    deliveryConfirmedByCustomer:{ type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order = models.Order || model<IOrder>("Order", OrderSchema);
