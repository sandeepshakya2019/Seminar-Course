const { Kafka, Partitioners } = require("kafkajs");

const kafka = new Kafka({
    clientId: "order-tracking-service",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

const consumer = kafka.consumer({ groupId: "order-tracker-group" });

module.exports = { kafka, producer, consumer };
