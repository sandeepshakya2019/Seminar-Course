import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import Redis from "ioredis";
import path from "path";
import { fileURLToPath } from "url";

export function startDashboard() {
    const app = express();
    const server = createServer(app);
    const wss = new WebSocketServer({ server });

    const redis = new Redis({
        host: process.env.REDIS_HOST || "redis",
        port: 6379,
    });

    const subscriber = new Redis({
        host: process.env.REDIS_HOST || "redis",
        port: 6379,
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.use(express.static(path.join(__dirname, "../public")));

    app.get("/logs", async (req, res) => {
        const logs = await redis.lrange("logs", 0, 99);
        res.json(logs.map((l) => JSON.parse(l)));
    });

    wss.on("connection", (ws) => {
        console.log("[WS] Dashboard connected");
        subscriber.subscribe("logs-channel");
        subscriber.on("message", (channel, msg) => ws.send(msg));
        ws.on("close", () => console.log("[WS] Dashboard disconnected"));
    });

    server.listen(4000, () => {
        console.log("🚀 Dashboard running on http://localhost:4000");
    });
}
