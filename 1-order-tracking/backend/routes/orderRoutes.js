// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const redis = require("../redis/redisClient");
const { producer } = require("../kafka/kafkaConfig");
const { broadcast } = require("../sse/sseManager");

const TOPIC = "order-events";

// --------------------------------------------------
// 1️⃣ CREATE NEW ORDER (Customer)
// --------------------------------------------------
router.post("/", async (req, res) => {
    const { orderId, customerName, items } = req.body;

    if (!orderId || !customerName || !items) {
        return res.status(400).json({ error: "Missing order fields" });
    }

    const orderData = {
        orderId,
        customerName,
        items,
        status: "Order Created",
        timestamp: Date.now(),
    };

    try {
        // 1. Save to Redis first (persistent state)
        await redis.set(`order:${orderId}`, JSON.stringify(orderData));

        // 2. Send event to Kafka topic
        await producer.send({
            topic: TOPIC,
            messages: [{ key: orderId, value: JSON.stringify(orderData) }],
        });

        // 3. Broadcast same order data to all SSE clients
        broadcast(orderData);

        console.log(
            `[${new Date().toISOString()}] 🆕 Created order ${orderId} (${customerName})`
        );

        res.json({
            message: "✅ Order created successfully",
            orderData,
        });
    } catch (err) {
        console.error("❌ Producer/Redis Error:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

// --------------------------------------------------
// 2️⃣ FETCH ALL ORDERS (Admin Dashboard)
// --------------------------------------------------
router.get("/", async (req, res) => {
    console.log(
        `[${new Date().toISOString()}] 📦 [GET] /order request received`
    );

    try {
        const keys = await redis.keys("order:*");
        const orders = [];
        for (const key of keys) {
            const data = await redis.get(key);
            console.log(`Fetched order ${key}:`, data);
            let orderData;
            try {
                orderData = JSON.parse(data);
            } catch {
                console.warn(`[WARN] Non-JSON Redis entry for key: ${key}`);
                orderData = { orderId: key.split(":")[1], status: data };
            }

            orders.push({
                orderId: orderData.orderId || key.split(":")[1],
                customerName: orderData.customerName || "N/A",
                items: orderData.items || [],
                status: orderData.status || "Unknown",
                timestamp: orderData.timestamp || null,
            });
        }

        res.json(orders);
    } catch (err) {
        console.error("❌ Redis fetch error:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// --------------------------------------------------
// 3️⃣ FETCH SINGLE ORDER STATUS
// --------------------------------------------------
router.get("/:id/status", async (req, res) => {
    const { id } = req.params;
    try {
        const orderStr = await redis.get(`order:${id}`);
        if (!orderStr)
            return res.status(404).json({ error: "Order not found" });

        const order = JSON.parse(orderStr);
        res.json({
            orderId: id,
            status: order.status,
            customerName: order.customerName,
            items: order.items,
            timestamp: order.timestamp,
        });
    } catch (err) {
        console.error("❌ Fetch single order error:", err);
        res.status(500).json({ error: "Failed to fetch order status" });
    }
});

// --------------------------------------------------
// 4️⃣ UPDATE ORDER STATUS (Admin)
// --------------------------------------------------
router.put("/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    try {
        // Try to fetch existing order data
        const orderStr = await redis.get(`order:${id}`);
        let orderData = {};

        if (orderStr) {
            try {
                orderData = JSON.parse(orderStr);
            } catch {
                // Old plain-string entries fallback
                orderData = { orderId: id };
            }
        } else {
            orderData = { orderId: id };
        }

        // ✅ Merge data safely
        orderData.status = status;
        orderData.timestamp = Date.now();

        // ✅ Always preserve existing fields or fallback values
        orderData.customerName = orderData.customerName || "Unknown Customer";
        orderData.items =
            Array.isArray(orderData.items) && orderData.items.length > 0
                ? orderData.items
                : [];

        // ✅ Save full JSON
        await redis.set(`order:${id}`, JSON.stringify(orderData));

        // ✅ Notify all clients
        broadcast(orderData);

        console.log(`🧑‍💼 Admin updated order ${id} → ${status}`);

        res.json({
            message: "Order status updated successfully",
            orderData,
        });
    } catch (err) {
        console.error("❌ Failed to update order:", err);
        res.status(500).json({ error: "Failed to update order" });
    }
});

// --------------------------------------------------
// 5️⃣ DELETE ORDER (Admin)
// --------------------------------------------------
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const exists = await redis.get(`order:${id}`);
        if (!exists) return res.status(404).json({ error: "Order not found" });

        await redis.del(`order:${id}`);
        console.log(`[${new Date().toISOString()}] 🗑️ Deleted order: ${id}`);

        // Notify connected clients
        broadcast({ orderId: id, deleted: true, timestamp: Date.now() });

        res.json({ message: `Order ${id} deleted successfully.` });
    } catch (err) {
        console.error("❌ Delete order error:", err);
        res.status(500).json({ error: "Failed to delete order" });
    }
});

module.exports = router;
