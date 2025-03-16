const Fastify = require('fastify');
const proxy = require('fastify-http-proxy');
require('dotenv').config();

const fastify = Fastify();

// Serve the main HTML page with merged CSS
fastify.get('/', (req, reply) => {
    reply.type('text/html').send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Fast Proxy</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    text-align: center;
                    margin: 50px;
                }
                .container {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    width: 300px;
                    margin: auto;
                }
                input {
                    width: 80%;
                    padding: 10px;
                    margin-top: 10px;
                }
                button {
                    padding: 10px;
                    margin-top: 10px;
                    background-color: blue;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Fast Proxy</h1>
                <input type="text" id="urlInput" placeholder="Enter website URL">
                <button onclick="proxyRequest()">Go</button>
            </div>
            <script>
                function proxyRequest() {
                    let url = document.getElementById('urlInput').value;
                    
                    if (!url) {
                        alert("Please enter a valid URL.");
                        return;
                    }

                    if (!url.startsWith("http://") && !url.startsWith("https://")) {
                        url = "https://" + url;
                    }

                    window.location.href = "/proxy?url=" + encodeURIComponent(url);
                }
            </script>
        </body>
        </html>
    `);
});

// Proxy route
fastify.register(proxy, {
    upstream: 'https://example.com', // Default target URL
    rewritePrefix: '/proxy',
    async preHandler(req, reply) {
        let target = req.query.url;
        if (!target) {
            return reply.status(400).send({ error: 'Missing target URL' });
        }

        // Auto-add "https://" if missing
        if (!target.startsWith("http://") && !target.startsWith("https://")) {
            target = `https://${target}`;
        }

        req.raw.url = target;
    }
});

// Start server
const PORT = process.env.PORT || 3000;
fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server running at ${address}`);
});
