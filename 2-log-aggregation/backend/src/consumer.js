import { Kafka } from "kafkajs";
import Redis from "ioredis";

const kafka = new Kafka({
    clientId: "log-consumer",
    brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "log-group" });
const redis = new Redis({
    host: process.env.REDIS_HOST || "redis",
    port: 6379,
});

export async function startConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: "service-logs", fromBeginning: true });

    console.log("[Consumer] Listening for logs...");

    await consumer.run({
        eachMessage: async ({ message }) => {
            const log = JSON.parse(message.value.toString());
            console.log("[Consumed]", log);
            await redis.lpush("logs", JSON.stringify(log));
            await redis.ltrim("logs", 0, 99);
            await redis.publish("logs-channel", JSON.stringify(log));
        },
    });
}
