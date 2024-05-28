import { Router } from 'express';
// Import the router middleware of express and enable the method.
// This will allow us to access the router across the app.
const router = Router();
// security, import the jsonwebtoken package
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    // Security:

    // Get a Json web token, attach it with a user header. with secret, and expiration
    jwt.sign(
        { user: req.context.models.users[req.context.me.id] },
        'secretKey',
        { expiresIn: '30s' },
        (err, token) => {
            res.json({ token });
        }
    );
});

/* 
❯ curl http://localhost:3000/session 
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMSIsInVzZXJuYW1lIjoiUm9iaW4gV2llcnVjaCJ9LCJpYXQiOjE3MTY4OTIzMzB9.DTrS2X9jQRcRFvLAbMLYa6IMwbYpuHIhAucYivR5hAQ"}%    
*/
export default router;
