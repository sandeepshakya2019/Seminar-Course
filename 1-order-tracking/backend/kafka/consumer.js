// backend/kafka/consumer.js
const redis = require("../redis/redisClient");
const { consumer } = require("./kafkaConfig");
const { broadcast } = require("../sse/sseManager");

const TOPIC = "order-events";

// Full order lifecycle stages
const STAGES = ["Order Processed", "Packed", "Shipped", "Delivered"];

// ✅ Simulate status transitions safely
async function simulateOrderLifecycle(orderId, baseEvent = {}) {
    try {
        for (const status of STAGES) {
            // Wait 3 seconds before each update
            await new Promise((r) => setTimeout(r, 3000));

            // Try to read the existing order from Redis
            let orderData = {};
            try {
                const existing = await redis.get(`order:${orderId}`);
                orderData = existing ? JSON.parse(existing) : { ...baseEvent };
            } catch {
                orderData = { ...baseEvent };
            }

            // Always preserve all fields
            orderData.orderId = orderId;
            orderData.customerName =
                orderData.customerName || baseEvent.customerName || "N/A";
            orderData.items =
                Array.isArray(orderData.items) && orderData.items.length > 0
                    ? orderData.items
                    : baseEvent.items || [];
            orderData.status = status;
            orderData.timestamp = Date.now();

            // ✅ Save full JSON back to Redis
            await redis.set(`order:${orderId}`, JSON.stringify(orderData));

            // ✅ Broadcast full order update
            broadcast(orderData);
            console.log(`[Kafka] ${orderId} → ${status}`);
        }
    } catch (err) {
        console.error(`[Kafka] ❌ Error simulating ${orderId}:`, err);
    }
}

// ✅ Consumer main logic
async function runConsumer() {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: TOPIC, fromBeginning: true });

        console.log(`[Kafka] ✅ Consumer subscribed to "${TOPIC}"`);

        await consumer.run({
            eachMessage: async ({ message }) => {
                const raw = message.value.toString();
                let event;

                try {
                    event = JSON.parse(raw);
                } catch {
                    console.error("[Kafka] ❌ Invalid JSON:", raw);
                    return;
                }

                const { orderId, customerName, items } = event;

                console.log(
                    `[Kafka] 📬 Received order event for ${orderId}`,
                    event
                );

                // ✅ Normalize and store full JSON for creation
                const fullOrder = {
                    orderId,
                    customerName,
                    items: Array.isArray(items) ? items : [],
                    status: event.status || "Order Created",
                    timestamp: Date.now(),
                };

                await redis.set(`order:${orderId}`, JSON.stringify(fullOrder));

                // ✅ Broadcast the exact fullOrder (not raw event)
                broadcast(fullOrder);

                // ✅ Start lifecycle with this full data
                // simulateOrderLifecycle(orderId, fullOrder);
            },
        });
    } catch (err) {
        console.error("[Kafka] ❌ Consumer failed:", err);
    }
}

module.exports = runConsumer;
