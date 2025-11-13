const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { producer, consumer } = require("./kafka/kafkaConfig");
const redis = require("./redis/redisClient");
const orderRoutes = require("./routes/orderRoutes");
const locationRoutes = require("./routes/locationRoutes");

const { registerClient, broadcast } = require("./sse/sseManager");
const runConsumer = require("./kafka/consumer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use("/order", orderRoutes);
app.get("/events", (req, res) => registerClient(res));
app.use("/location", locationRoutes);

const TOPIC = "order-events";

// Start server
async function startServer() {
    try {
        await producer.connect();
        console.log("✅ Kafka Producer connected");
        setTimeout(runConsumer, 10000);
        app.listen(5000, () => console.log("🚀 Backend running on port 5000"));
    } catch (err) {
        console.error("Startup Error:", err);
    }
}

startServer();
