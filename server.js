const Fastify = require('fastify');
const axios = require('axios');
const fastify = Fastify();

fastify.get('/', async (req, reply) => {
    try {
        // Generate random number between 1 and 20 for the proxy URL
        const randomNumber = Math.floor(Math.random() * 20) + 1;
        const proxyUrl = `https://us${randomNumber}.proxysite.com`;

        // Make the request to the proxied website
        const response = await axios.get(proxyUrl, {
            headers: {
                'User-Agent': req.headers['user-agent'], // Send the same user agent as the client
                'Accept': 'text/html', // Ensure it's HTML content
                'Accept-Language': 'en-US,en;q=0.5' // Optional: Customize as needed
            }
        });

        // Serve the proxied content as HTML
        reply.type('text/html').send(response.data);
    } catch (error) {
        console.error('Error fetching proxy content:', error);
        reply.status(500).send('Internal Server Error');
    }
});

// Start the Fastify server
const PORT = process.env.PORT || 3000;
fastify.listen(PORT, '0.0.0.0', (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server running at ${address}`);
});
