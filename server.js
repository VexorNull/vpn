const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Frontend static files serve karne ke liye
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Server-Side Unblock Proxy Route (Bypasses CORS & Restrictions)
app.get('/unblock', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Error: URL parameter is required.');
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VexorVPN/5.0 Anti-Censorship Gateway'
            }
        });

        const contentType = response.headers.get('content-type') || '';
        res.setHeader('Content-Type', contentType);
        
        const bodyText = await response.text();
        res.send(bodyText);

    } catch (error) {
        res.status(500).send(`
            <html>
                <body style="background:#070b14; color:#fff; font-family:sans-serif; text-align:center; padding-top:50px;">
                    <h2 style="color:#ef4444;">VexorVPN Gateway Error</h2>
                    <p>Unable to connect to target URL: ${targetUrl}</p>
                    <p style="color:#94a3b8; font-size:12px;">${error.message}</p>
                    <a href="/" style="color:#06b6d4; text-decoration:none; margin-top:20px; display:inline-block;">&larr; Back to Unblocker</a>
                </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`VexorVPN Server running live at http://localhost:${PORT}`);
});
