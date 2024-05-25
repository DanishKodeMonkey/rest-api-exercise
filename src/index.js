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
// Express is ideal for creating and exposing APIs to communicate as a client to ea server application.
// The key difference from a url routing direction to a API is the use of nouns rather than verbs, and
// a returned resource in response.

// the four main nouns to use are:

app.get('/', (req, res) => {
    return res.send('Received a GET HTTP method');
});

app.post('/', (req, res) => {
    return res.send('Received a POST HTTP method');
});

app.put('/', (req, res) => {
    return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
    return res.send('Received a DELETE HTTP method');
});

/* 
cURL'ing http://localhost:3000 will, by default, use a HTTP get method.
We can however specify the HTTP method, using the -X (or --request) flag.
Doing this, we can access different routes of the express application.
Using its API endpoints with an URI
*/
/* 
This is one of the key aspects to REST: Using HTTP methods to perfor moperations on URIs, 
most commonly refered to as CRUD operations for create, read, update and delete operations. 
git */

/* Expose a port defined in a hidden, safe, .env file to the express app */
app.listen(process.env.PORT, () =>
    console.log(`Example app listening to port ${process.env.PORT}`)
);
