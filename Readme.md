# Real-Time Systems using Redis and Kafka

Order Tracking System and Log Aggregation System  
Backend and Frontend Implementation

**Authors:**

-   Sandeep Kumar (CS24M112)
-   Ashant Kumar (CS24M113)
-   Dharmendra Chauhan (CS24M115)

This repository contains two separate real-time systems built using Kafka, Redis, Node.js, WebSockets, and React.js.

```

seminar-course/
│
├── 1-order-tracking/
│ ├── backend/
│ └── frontend/
│
└── 2-log-aggregation/
└── backend/

```

---

## Project Overview

### 1. Real-Time Order Tracking System

This system shows live order movement on a map using Kafka for order event streaming, Redis Pub/Sub for fast propagation, a Node.js backend for API and WebSocket communication, and a React.js frontend with a Leaflet map interface.

### 2. Real-Time Log Aggregation System

This system collects logs from microservices, streams them through Kafka, consumes and publishes them with Redis, and displays them on a WebSocket-powered real-time dashboard.

---

## Technologies Used

### Backend

-   Node.js
-   Express.js
-   KafkaJS
-   Redis (ioredis)
-   WebSocket (ws)

### Frontend

-   React.js
-   Leaflet.js
-   Axios

---

## Installation Instructions

Clone this repository:

```bash
git clone https://github.com/sandeepshakya2019/Seminar-Course.git
cd seminar-course
```

---

## Kafka and Redis Setup

### Option 1: Using Docker (recommended)

```bash
docker-compose up -d
```

### Option 2: Manual Installation

Make sure the following services are running locally:

-   Kafka on `localhost:9092`
-   Redis on `localhost:6379`

---

# 1. Order Tracking System

## Backend Setup

```bash
cd 1-order-tracking/backend
npm install
```

Start the backend:

```bash
npm start
```

Backend runs at:

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd 1-order-tracking/frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 2. Log Aggregation System

## Backend Setup

```bash
cd 2-log-aggregation/backend
npm install
```

Create a `.env` file:

```
KAFKA_BROKER=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=6000
```

Start the service:

```bash
npm start
```

Dashboard available at:

```
http://localhost:6000
```

---

## Testing

### Simulate order events:

```bash
node simulate-orders.js
```

### Produce log events:

```bash
node producer.js
```

---

## Folder Structure

```
seminar-course/
│
├── 1-order-tracking/
│   ├── backend/         # Kafka + Redis + Express + WebSocket
│   └── frontend/        # React map interface
│
└── 2-log-aggregation/
    └── backend/         # Kafka consumer -> Redis publisher -> WebSocket dashboard
```

---

## Features

### Order Tracking System

-   Real-time map updates
-   Kafka to Redis streaming
-   WebSocket communication
-   React-based dashboard

### Log Aggregation System

-   Live log monitoring
-   Kafka consumer implementation
-   Redis-backed Pub/Sub
-   WebSocket data streaming

---
