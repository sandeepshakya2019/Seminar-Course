import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "log-producer",
    brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const producer = kafka.producer();

const services = ["auth", "orders", "payment", "inventory"];
const levels = ["INFO", "WARN", "ERROR"];

export async function startProducer() {
    await producer.connect();
    console.log("[Producer] Connected to Kafka");

    setInterval(async () => {
        const log = {
            service: services[Math.floor(Math.random() * services.length)],
            level: levels[Math.floor(Math.random() * levels.length)],
            message: "Random log message " + Math.floor(Math.random() * 1000),
            timestamp: new Date().toISOString(),
        };

        await producer.send({
            topic: "service-logs",
            messages: [{ value: JSON.stringify(log) }],
        });

        console.log("[Produced]", log);
    }, 10000);
}
