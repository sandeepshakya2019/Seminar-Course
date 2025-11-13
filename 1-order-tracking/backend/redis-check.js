// checkRedis.js
const redis = require("./redis/redisClient");

(async () => {
    try {
        // Get all keys from Redis
        const keys = await redis.keys("*"); // or use SCAN for large datasets
        if (keys.length === 0) {
            console.log("⚠️ No keys found in Redis.");
            process.exit(0);
        }

        console.log(`\n🔑 Found ${keys.length} keys in Redis:\n`);

        for (const key of keys) {
            try {
                const rawValue = await redis.get(key);

                // Try to parse JSON if possible
                let value;
                try {
                    value = JSON.parse(rawValue);
                } catch {
                    value = rawValue;
                }

                console.log(`🗝️ Key: ${key}`);

                // Pretty-print structured data
                if (value && typeof value === "object") {
                    if ("lat" in value && "lng" in value) {
                        console.log(
                            `   📍 Position: (${value.lat}, ${value.lng}) ${
                                value.id ? `| ID: ${value.id}` : ""
                            }`
                        );
                    }
                    console.log(
                        "   Full Data:",
                        JSON.stringify(value, null, 2)
                    );
                } else {
                    console.log("   Value:", value);
                }

                console.log(
                    "----------------------------------------------------"
                );
            } catch (err) {
                console.error(`❌ Error reading key ${key}:`, err.message);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Redis check failed:", err);
        process.exit(1);
    }
})();
