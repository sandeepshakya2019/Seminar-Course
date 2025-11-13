// routes/locationRoutes.js
const express = require("express");
const router = express.Router();
const redis = require("../redis/redisClient");
const { broadcast } = require("../sse/sseManager");

router.put("/update", async (req, res) => {
    const { location } = req.body;
    if (!location) return res.status(400).json({ error: "Location required" });

    try {
        await redis.set("global:location", JSON.stringify(location));
        await redis.publish("global-location-update", JSON.stringify(location));

        // 🟢 Broadcast location change to all SSE clients
        broadcast({
            type: "location-update",
            location,
            timestamp: Date.now(),
        });

        console.log("📍 Global location updated & broadcasted:", location);

        res.json({ success: true, message: "Location updated successfully" });
    } catch (err) {
        console.error("Redis error:", err);
        res.status(500).json({ error: "Failed to update location" });
    }
});

router.get("/current", async (req, res) => {
    try {
        const data = await redis.get("global:location");
        if (!data)
            return res.json({ location: null, message: "No location set" });
        res.json({ location: JSON.parse(data) });
    } catch (err) {
        console.error("Redis fetch error:", err);
        res.status(500).json({ error: "Failed to fetch location" });
    }
});

module.exports = router;
