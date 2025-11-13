const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "order-producer",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function run() {
    // c
    await producer.connect();
    const order = {
        orderId: "101",
        status: "CREATED",
        ts: new Date().toISOString(),
    };
    await producer.send({
        topic: "orders",
        messages: [{ value: JSON.stringify(order) }],
    });
    console.log("Order event sent:", order);
}
run();
