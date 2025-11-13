import { startProducer } from "./producer.js";
import { startConsumer } from "./consumer.js";
import { startDashboard } from "./dashboard.js";

console.log("🧩 Starting Real-Time Log Aggregation System...");

startDashboard();
startConsumer();
startProducer();
