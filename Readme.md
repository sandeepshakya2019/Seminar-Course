# Real-Time Systems using Redis & Kafka

### **Order Tracking System + Log Aggregation System**

Full Stack (Backend + Frontend)

This repository contains two complete real-time systems built using **Kafka**, **Redis**, **Node.js**, **WebSockets**, and **React.js**.

---

# Project Overview

## 1. Real-Time Order Tracking System

The Order Tracking System displays **live order movement on a map** using:

-   Kafka (order event producer)
-   Redis Pub/Sub (real-time data propagation)
-   Node.js backend (Express + WebSocket)
-   React.js frontend (Leaflet map updates)

## 2. Real-Time Log Aggregation System

A fully functional log streaming pipeline:

-   Microservices send logs → Kafka
-   Kafka consumer → Redis
-   Redis publishes → WebSocket dashboard

---

# Tech Stack

### Backend:

-   Node.js
-   Express.js
-   KafkaJS
-   Redis (ioredis)
-   WebSocket (ws)

### Frontend:

-   React.js (Vite)
-   Leaflet.js (live map)
-   Axios

---

# Installation Guide

Clone the project:

```bash
git clone https://github.com/sandeepshakya2019/Seminar-Course
cd seminar-course
```

````

---

# ⚙️ Kafka & Redis Setup

## Option 1 — Using Docker (recommended)

```bash
docker-compose up -d
```

## Option 2 — Manual Installation

-   Kafka running on `localhost:9092`
-   Redis running on `localhost:6379`

---

# 🟦 1. ORDER TRACKING SYSTEM

## ▶ Backend Setup

```bash
cd 1-order-tracking/backend
npm install
```

Create `.env`:

```
KAFKA_BROKER=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=5000
```

Start backend:

```bash
npm start
```

Backend URL:

```
http://localhost:5000
```

---

## ▶ Frontend Setup (Order Tracking)

```bash
cd 1-order-tracking/frontend
npm install
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

---

# 🟥 2. LOG AGGREGATION SYSTEM

## ▶ Backend Setup

```bash
cd 2-log-aggregation/backend
npm install
```

Create `.env`:

```
KAFKA_BROKER=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=6000
```

Start:

```bash
npm start
```

Dashboard URL:

```
http://localhost:6000
```

---

# 🧪 Testing Both Systems

## ➤ Simulate Order Events

```bash
node simulate-orders.js
```

## ➤ Produce Logs for Log Aggregation

```bash
node producer.js
```

---

# 📁 Folder Structure

```
seminar-course/
│
├── 1-order-tracking/
│   ├── backend/         # Express + Kafka + Redis + WS
│   └── frontend/        # React map UI
│
└── 2-log-aggregation/
    └── backend/         # Kafka → Redis → WebSocket dashboard
```

---

# 🎯 Features

## Order Tracking System

✔ Real-time map updates
✔ Kafka → Redis pipeline
✔ React + Leaflet UI
✔ WebSocket live streaming

## Log Aggregation System

✔ Fetch logs in real-time
✔ Kafka consumer
✔ Redis publisher
✔ WebSocket streaming

---

# 📜 License

MIT License

---

```markdown
---

Just copy the **entire block** and save it as:
```

README.md

```

Let me know if you want:
- architecture diagrams
- badges (build, technologies)
- separate READMEs for each folder
- Overleaf slide deck for presentation
```
````
