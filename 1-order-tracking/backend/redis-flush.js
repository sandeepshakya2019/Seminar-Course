const redis = require("./redis/redisClient");

(async () => {
    try {
        await redis.flushall();
        console.log("✅ Redis flushed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Failed to flush Redis:", err);
        process.exit(1);
    }
})();
