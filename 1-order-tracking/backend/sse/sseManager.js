// Simple manager to handle SSE clients and broadcast updates
let clients = [];

function registerClient(res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.flushHeaders();

    clients.push(res);
    console.log(`+ New SSE client connected (${clients.length})`);

    // Keep connection alive by sending periodic comments
    const keepAlive = setInterval(() => {
        res.write(": keep-alive\n\n");
    }, 20000);

    res.on("close", () => {
        clearInterval(keepAlive);
        clients = clients.filter((client) => client !== res);
        console.log(`- SSE client disconnected (${clients.length})`);
    });
}

function broadcast(event) {
    // Deep clone to prevent shared reference issues
    const safeCopy = JSON.parse(JSON.stringify(event));
    const data = JSON.stringify(safeCopy);
    clients.forEach((client) => client.write(`data: ${data}\n\n`));
}

module.exports = { registerClient, broadcast };
