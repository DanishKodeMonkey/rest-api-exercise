/* Import relevant modules */
import 'dotenv/config';
import cors from 'cors';
import express from 'express';

// we will import some data sets that we will use for this example
// Not a real database, but good enough for the experiment.
import users from '../database/users';
import messages from '../database/messages';

// Express is ideal for creating and exposing APIs to communicate as a client to ea server application.
// The key difference from a url routing direction to a API is the use of nouns rather than verbs, and
// a returned resource in response.

// Doing this, we can establish a clear chain of operations between the Client, and the rest of the service
// Client -> (REST API -> Server) -> Database

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

// the four main nouns to use are: GET, POST, PUT and DELETE

// An important aspect of REST is that every URI acts as a resource. like /users.
app.get('/users', (req, res) => {
    return res.send(Object.values(users)); //Returns the entire contents of the users dataset
});
/* 
❯ curl http://localhost:3000/users            
[{"id":"1","username":"Robin Wieruch"},{"id":"2","username":"Dave Davids"}]%                     
*/

// Lets add another path ,that will return a specific user, based on the provided id
app.get('/users/:userId', (req, res) => {
    return res.send(users[req.params.userId]); // Returns a specific user based on the provided id
});
/* 
❯ curl http://localhost:3000/users/1
{"id":"1","username":"Robin Wieruch"}%                                                           
*/

app.post('/users', (req, res) => {
    return res.send('Received a POST HTTP method on users resource');
});

/* 
Naturally, commencing a put or delete operation, is done to a single part of a resource 
instead of the whole collection. This is spcified with a :userid in the URI
*/
app.put('/users/:userId', (req, res) => {
    return res.send(`PUT HTTP method on user/${req.params.userid} resource`);
});

app.delete('/users/:userId', (req, res) => {
    return res.send(`DELETE HTTP method on user/${req.params.userid} resource`);
});
// ❯ curl -X DELETE http://localhost:3000/users/2
// --> DELETE HTTP method on user/2 resource%

/* 
cURL'ing http://localhost:3000/users will, by default, use a HTTP get method.
We can however specify the HTTP method, using the -X (or --request) flag.
Doing this, we can access different routes of the express application.
Using its API endpoints with an URI
*/
/* 
This is another of the key aspects to REST: Using HTTP methods to perform operations on URIs, 
most commonly refered to as CRUD operations for create, read, update and delete operations. 
git */

/* 
Due to the distinct nature of APi practices, using nouns instead of verbs are required. 
The direct connection between CRUD and REST can be determined as:
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE
*/

// The paths we define, also define the resources that the client will use. We can have as many or few as we need.
// For instance, lets create another one for messages

app.get('/messages', (req, res) => {
    return res.send(Object.values(messages));
});
app.get('/messages/:messageId', (req, res) => {
    return res.send(messages[req.params.messageId]);
});

app.post('/messages', (req, res) => {
    return res.send('Received a POST HTTP method on messages resource');
});

app.put('/messages/:messageId', (req, res) => {
    return res.send(`PUT HTTP method on user/${req.params.messageId} resource`);
});

app.delete('/messages/:messageId', (req, res) => {
    return res.send(
        `DELETE HTTP method on user/${req.params.messageId} resource`
    );
});

// These paths work exactly like the users ones, but on a different resource.
// ❯ curl -X DELETE http://localhost:3000/messages/1
// --> DELETE HTTP method on messages/2 resource%

/* Expose a port defined in a hidden, .env file to the express app */
app.listen(process.env.PORT, () =>
    console.log(`Example app listening to port ${process.env.PORT}`)
);
