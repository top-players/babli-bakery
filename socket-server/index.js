const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app    = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

/* ── Health check ── */
app.get("/", (req, res) => {
  res.json({ status: "Babli Bakery Socket Server Running 🚀", connections: io.engine.clientsCount });
});

/* ── REST endpoints called by Next.js API routes ── */

/* New order placed by customer → notify admin */
app.post("/emit-new-order", (req, res) => {
  const { order } = req.body;
  io.emit("new-order", order);
  console.log(`📦 New order emitted: ${order?.customerName}`);
  res.json({ success: true });
});

/* Admin updates order status → notify customer tracking page */
app.post("/emit-order-update", (req, res) => {
  const { order } = req.body;
  io.emit("order-updated", order);
  console.log(`🔄 Order updated: ${order?._id} → ${order?.status}`);
  res.json({ success: true });
});

/* Customer confirms delivery → notify admin dashboard */
app.post("/emit-delivery-confirmed", (req, res) => {
  const { order } = req.body;
  io.emit("order-delivered-confirmed", order);
  console.log(`✅ Delivery confirmed by customer: ${order?._id}`);
  res.json({ success: true });
});

/* ── Socket.io connection log ── */
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id} | Total: ${io.engine.clientsCount}`);
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`\n🍕 Babli Bakery Socket Server`);
  console.log(`   Running on port ${PORT}`);
  console.log(`   http://localhost:${PORT}\n`);
});
