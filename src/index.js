/* Import relevant modules */
import 'dotenv/config';
import cors from 'cors';
import express from 'express';

/* Establish a express app */
const app = express();

/* After declaring the express app, we can start attaching middleware to the app, and set up routes etc. */

/* Middleware */
/* There are two kinds of middleware in express.js, application level, and router level middleware. */
/* Set up some application-middlewares and tie them to the app*/

/* CORS is used to restrict access between web applications on a domain level. To work with this,
we use a CORS package to apply a CORS header to every request by default. */
app.use(cors());

/* Set up some routes */
// This route points to the root (/) of the domain, and is the first thing we see when we visit the domain.
// When someone req(quests) the root path / we res(pond) with a send method, sending 'Hello world'
// to the user.
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// We could make any path we want this way, just as an example:
app.get('/example', (req, res) => {
    res.send('This is an example !');
});
// Going to localhost:3000/example now outputs this response.

/* Expose a port defined in a hidden, safe, .env file to the express app */
app.listen(process.env.PORT, () =>
    console.log(`Example app listening to port ${process.env.PORT}`)
);
