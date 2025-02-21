const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Proxy API requests to the backend
app.use('/api', createProxyMiddleware({
    target: 'http://backend-service:3001', // Backend service URL
    changeOrigin: true,
    pathRewrite: { '^/api': '' }, // Remove /api prefix before forwarding
}));

// Start the server
app.listen(port, () => {
    console.log(`Frontend server running at http://localhost:${port}`);
});