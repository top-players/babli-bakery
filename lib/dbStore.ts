import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "./mongodb";
import { Order as MongoOrder } from "./models/Order";
import { Admin as MongoAdmin } from "./models/Admin";
import { Review as MongoReview } from "./models/Review";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

export interface OrderData {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMode: string;
  status: string;
  trackingId: string;
  deliveryConfirmedByCustomer?: boolean;
  createdAt: string;
}

export interface ReviewData {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: string;
}

/* Local memory fallback store */
declare global {
  // eslint-disable-next-line no-var
  var localDbStore: {
    admins: Map<string, { username: string; passwordHash: string }>;
    orders: OrderData[];
    reviews: ReviewData[];
  } | undefined;
}

const store = global.localDbStore ?? (global.localDbStore = {
  admins: new Map([
    ["bablibakery2026", { username: "bablibakery2026", passwordHash: bcrypt.hashSync("babli@2926", 10) }]
  ]),
  orders: [],
  reviews: [
    {
      _id: "rev-1",
      name: "Rahul Sharma",
      rating: 5,
      comment: "Best pizza in Muzaffarnagar! Cheese burst pizza is awesome 🔥",
      date: "Today",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "rev-2",
      name: "Priya Singh",
      rating: 5,
      comment: "Loved the cold coffee and burgers. Great ambience!",
      date: "Yesterday",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ],
});

export async function isMongoAvailable(): Promise<boolean> {
  try {
    const conn = await Promise.race([
      connectDB(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500))
    ]);
    return !!conn;
  } catch {
    return false;
  }
}

/* Helper to map Supabase row to OrderData */
// eslint-disable-next-line @typescript-eslint薪no-explicit-any
function mapSupabaseOrder(row: any): OrderData {
  return {
    _id: row.id || row.tracking_id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    items: row.items || [],
    totalAmount: Number(row.total_amount) || 0,
    paymentMode: row.payment_mode || "Cash on Delivery",
    status: row.status || "Pending",
    trackingId: row.tracking_id,
    deliveryConfirmedByCustomer: Boolean(row.delivery_confirmed_by_customer),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

/* ── SEED ADMIN ── */
export async function seedAdminStore(username = "bablibakery2026", password = "babli@2926") {
  const hash = await bcrypt.hash(password, 10);
  const uname = username.toLowerCase();
  store.admins.set(uname, { username: uname, passwordHash: hash });

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: existing } = await supabase.from("admins").select("id").eq("username", uname).maybeSingle();
      if (!existing) {
        await supabase.from("admins").insert({ username: uname, password_hash: hash });
      } else {
        await supabase.from("admins").update({ password_hash: hash }).eq("username", uname);
      }
    } catch { /* fallback below */ }
  }

  if (await isMongoAvailable()) {
    try {
      const exists = await MongoAdmin.findOne({ username: uname });
      if (!exists) {
        await MongoAdmin.create({ username: uname, passwordHash: hash });
      } else {
        await MongoAdmin.updateOne({ username: uname }, { passwordHash: hash });
      }
    } catch { /* fallback */ }
  }
  return { username, password };
}

/* ── ADMIN AUTH ── */
export async function verifyAdminCredentials(username: string, pass: string) {
  const uname = username.toLowerCase().trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: admin } = await supabase.from("admins").select("*").eq("username", uname).maybeSingle();
      if (admin && admin.password_hash) {
        const isValid = await bcrypt.compare(pass, admin.password_hash);
        if (isValid) return { _id: admin.id, username: admin.username };
      }
    } catch { /* fallback */ }
  }

  if (await isMongoAvailable()) {
    try {
      const admin = await MongoAdmin.findOne({ username: uname });
      if (admin) {
        const isValid = await bcrypt.compare(pass, admin.passwordHash);
        if (isValid) return { _id: admin._id.toString(), username: admin.username };
      }
    } catch { /* fallback */ }
  }

  const local = store.admins.get(uname);
  if (local && bcrypt.compareSync(pass, local.passwordHash)) {
    return { _id: `admin-${uname}`, username: local.username };
  }
  return null;
}

/* ── ORDERS ── */
export async function getOrdersStore(): Promise<OrderData[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        return data.map(mapSupabaseOrder);
      }
    } catch { /* fallback */ }
  }

  if (await isMongoAvailable()) {
    try {
      const orders = await MongoOrder.find({}).sort({ createdAt: -1 }).lean();
      return orders.map((o) => ({
        ...o,
        _id: o._id.toString(),
        createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch { /* fallback */ }
  }

  return store.orders;
}

export async function getOrderByIdOrTrackingStore(idOrTracking: string): Promise<OrderData | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .or(`id.eq.${idOrTracking},tracking_id.eq.${idOrTracking}`)
        .maybeSingle();
      if (data) return mapSupabaseOrder(data);
    } catch { /* fallback */ }
  }

  if (await isMongoAvailable()) {
    try {
      const order = await MongoOrder.findOne({
        $or: [{ _id: idOrTracking.match(/^[0-9a-fA-F]{24}$/) ? idOrTracking : null }, { trackingId: idOrTracking }]
      }).lean();
      if (order) {
        return {
          ...order,
          _id: order._id.toString(),
          createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch { /* fallback */ }
  }

  const local = store.orders.find((o) => o._id === idOrTracking || o.trackingId === idOrTracking);
  return local || null;
}

export async function createOrderStore(data: {
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMode?: string;
}): Promise<OrderData> {
  const trackingId = uuidv4();
  const newOrder: OrderData = {
    _id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerName: data.customerName,
    phone: data.phone,
    address: data.address,
    items: data.items,
    totalAmount: data.totalAmount,
    paymentMode: data.paymentMode || "Cash on Delivery",
    status: "Pending",
    trackingId,
    deliveryConfirmedByCustomer: false,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: inserted, error } = await supabase.from("orders").insert({
        tracking_id: trackingId,
        customer_name: data.customerName,
        phone: data.phone,
        address: data.address,
        items: data.items,
        total_amount: data.totalAmount,
        payment_mode: data.paymentMode || "Cash on Delivery",
        status: "Pending",
        delivery_confirmed_by_customer: false,
      }).select().single();

      if (!error && inserted) {
        newOrder._id = inserted.id;
      }
    } catch { /* fallback */ }
  }

  if (await isMongoAvailable()) {
    try {
      const doc = await MongoOrder.create({
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        items: data.items,
        totalAmount: data.totalAmount,
        paymentMode: data.paymentMode || "Cash on Delivery",
        trackingId,
        status: "Pending",
      });
      newOrder._id = doc._id.toString();
    } catch { /* fallback */ }
  }

  store.orders.unshift(newOrder);
  return newOrder;
}

export async function updateOrderStatusStore(idOrTracking: string, status: string): Promise<OrderData | null> {
  let updated: OrderData | null = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from("orders")
        .update({ status })
        .or(`id.eq.${idOrTracking},tracking_id.eq.${idOrTracking}`)
        .select()
        .maybeSingle();

      if (data) updated = mapSupabaseOrder(data);
    } catch { /* fallback */ }
  }

  if (await isMongoAvailable()) {
    try {
      const doc = await MongoOrder.findOneAndUpdate(
        { $or: [{ _id: idOrTracking.match(/^[0-9a-fA-F]{24}$/) ? idOrTracking : null }, { trackingId: idOrTracking }] },
        { status },
        { new: true }
      ).lean();
      if (doc) {
        updated = {
          ...doc,
          _id: doc._id.toString(),
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch { /* fallback */ }
  }

  const localIdx = store.orders.findIndex((o) => o._id === idOrTracking || o.trackingId === idOrTracking);
  if (localIdx !== -1) {
    store.orders[localIdx].status = status;
    if (!updated) updated = store.orders[localIdx];
  }

  return updated;
}

export async function confirmDeliveryStore(idOrTracking: string): Promise<OrderData | null> {
  let updated: OrderData | null = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from("orders")
        .update({ status: "Delivered", delivery_confirmed_by_customer: true })
        .or(`id.eq.${idOrTracking},tracking_id.eq.${idOrTracking}`)
        .select()
        .maybeSingle();

      if (data) updated = mapSupabaseOrder(data);
    } catch { /* fallback */ }
  }

  if (await isMongoAvailable()) {
    try {
      const doc = await MongoOrder.findOneAndUpdate(
        { $or: [{ _id: idOrTracking.match(/^[0-9a-fA-F]{24}$/) ? idOrTracking : null }, { trackingId: idOrTracking }] },
        { status: "Delivered", deliveryConfirmedByCustomer: true },
        { new: true }
      ).lean();
      if (doc) {
        updated = {
          ...doc,
          _id: doc._id.toString(),
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch { /* fallback */ }
  }

  const localIdx = store.orders.findIndex((o) => o._id === idOrTracking || o.trackingId === idOrTracking);
  if (localIdx !== -1) {
    store.orders[localIdx].status = "Delivered";
    store.orders[localIdx].deliveryConfirmedByCustomer = true;
    if (!updated) updated = store.orders[localIdx];
  }

  return updated;
}

export async function deleteOrderStore(idOrTracking: string): Promise<boolean> {
  let deleted = false;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .or(`id.eq.${idOrTracking},tracking_id.eq.${idOrTracking}`);
      if (!error) deleted = true;
    } catch { /* fallback */ }
  }

  if (await isMongoAvailable()) {
    try {
      await MongoOrder.deleteOne({
        $or: [{ _id: idOrTracking.match(/^[0-9a-fA-F]{24}$/) ? idOrTracking : null }, { trackingId: idOrTracking }]
      });
      deleted = true;
    } catch { /* fallback */ }
  }

  const localIdx = store.orders.findIndex((o) => o._id === idOrTracking || o.trackingId === idOrTracking);
  if (localIdx !== -1) {
    store.orders.splice(localIdx, 1);
    deleted = true;
  }

  return deleted;
}

/* ── REVIEWS ── */
export async function getReviewsStore(): Promise<ReviewData[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((r: any) => ({
          _id: r.id,
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          date: r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "Recently",
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        }));
      }
    } catch { /* fallback */ }
  }

  if (await isMongoAvailable()) {
    try {
      const revs = await MongoReview.find({}).sort({ createdAt: -1 }).lean();
      return revs.map((r) => ({
        ...r,
        _id: r._id.toString(),
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch { /* fallback */ }
  }

  return store.reviews;
}

export async function createReviewStore(data: { name: string; rating: number; comment: string }): Promise<ReviewData> {
  const newRev: ReviewData = {
    _id: `rev-${Date.now()}`,
    name: data.name,
    rating: data.rating,
    comment: data.comment,
    date: "Just now",
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: doc } = await supabase.from("reviews").insert({
        name: data.name,
        rating: data.rating,
        comment: data.comment,
        approved: true,
      }).select().single();
      if (doc) newRev._id = doc.id;
    } catch { /* fallback */ }
  }

  if (await isMongoAvailable()) {
    try {
      const doc = await MongoReview.create(data);
      newRev._id = doc._id.toString();
    } catch { /* fallback */ }
  }

  store.reviews.unshift(newRev);
  return newRev;
}
