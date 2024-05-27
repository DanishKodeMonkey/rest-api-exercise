/* Import relevant modules */
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

// we will import some data sets that we will use for this example
// Not a real database, but good enough for the experiment.
let users = {
    1: {
        id: '1',
        username: 'Robin Wieruch',
    },
    2: {
        id: '2',
        username: 'Dave Davids',
    },
};
let messages = {
    1: {
        id: '1',
        text: 'Hello World',
        userId: '1',
    },
    2: {
        id: '2',
        text: 'By World',
        userId: '2',
    },
};

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

/* Custom middleware */
/* It may be nessecary to facilitate custom middleware to pass requests-responses through */
/* 
For instance, here is one that helps determine who performed an action, like creating a message.
This can be used t o determine a user during an request, and associate them with a user in the database 
*/
app.use((req, res, next) => {
    // Determine a pseudo semi-authenticated user, and assign to me property of request object.
    req.me = users[1];
    // next passes the request to the next middleware
    next();
});
// This will be useful for intercepting every incoming request, and determine from the HTTP
// header if the user is authenticated or not. If so, the user is propagated to every express route used here.
// This maintains a stateless express server, while a client sends information of the authenticated user.

// This too, is a characteristic of REST.
/* 
It should be possible to create multiple server instances to balance traffic evenly between servers.
This is where load balancing comes in. To clarify, the stateless term means to never maintain state, 
like an authenticated user, outside of a database. So that the client always has to send its information
along with every request. A server can then take each request and take care of authentication on 
an application level. Providing a session state instead, to every Express route in the application.
*/
/* CORS is used to restrict access between web applications on a domain level. To work with this,
we use a CORS package to apply a CORS header to every request by default. */
app.use(cors());

// Enable the use of express-built in middleware body-parser, to transform body types form our request object.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// keep in mind that this covers another aspect of REST. To use only a single payload format (like JSON)
// and stick to it!

/* Custom middleware */
/* It may be nessecary to facilitate custom middleware to pass requests-responses through */
/* 
For instance, here is one that helps determine who performed an action, like creating a message.
This can be used t o determine a user during an request, and associate them with a user in the database 
*/
app.use((req, res, next) => {
    // Determine a pseudo semi-authenticated user, and assign to me property of request object.
    req.me = users[1];
    // next passes the request to the next middleware
    next();
});
// This will be useful for intercepting every incoming request, and determine from the HTTP
// header if the user is authenticated or not. If so, the user is propagated to every express route used here.
// This maintains a stateless express server, while a client sends information of the authenticated user.

// This too, is a characteristic of REST.
/* 
It should be possible to create multiple server instances to balance traffic evenly between servers.
This is where load balancing comes in. To clarify, the stateless term means to never maintain state, 
like an authenticated user, outside of a database. So that the client always has to send its information
along with every request. A server can then take each request and take care of authentication on 
an application level. Providing a session state instead, to every Express route in the application.
*/

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
    // Since we arent using a database, we will use uuid to create unique identifiers for new posts
    const id = uuidv4();

    // establish the message object
    const message = {
        // use id as a property in the message object.
        id,
        // extract text payload from body of request HTTP method
        text: req.body.text,
        // attached attained me.id property of request, as gained through custom middleware.
        userId: req.me.id,
    };

    // assign the message, in the messages object by identifier.
    messages[id] = message;

    // return new message
    return res.send(message);
});
// And thanks to our earlier middleware setup, our API and server are able to parse these requests
// to new messages!
/* 
❯ curl -X POST -H "Content-Type:application/json" http://localhost:3000/messages -d '{"text":"Hi again, World"}'
{"id":"8c310788-ee3d-4bc4-986e-fe1b9f7ec4da","text":"Hi again, World"}%                          

*/
app.put('/messages/:messageId', (req, res) => {
    // Similarily to deleting a message, we can extract the different parts of the request to put
    // together an update operation.
    const { messageId } = req.params;
    const { text } = req.body;

    // update the database contents with the text from the request
    messages[messageId].text = text;

    // and send the new object to the database.
    return res.send(messages[messageId]);
});
/* 
Example:
❯ curl -X PUT -H "Content-Type:application/json" http://localhost:3000/messages/1 -d '{"text":"Hi again, World edited!"}'
{"id":"1","text":"Hi again, World edited!","userId":"1"}%         
*/
app.delete('/messages/:messageId', (req, res) => {
    // In order to delete a message, we will use a dynamic object property to exclude the message
    // that we want to delete from the messages object.
    const { [req.params.messageId]: message, ...otherMessages } = messages;

    // update the messages object wit hthe other messages, now excluding the deleted one.
    messages = otherMessages;

    // send new messages object to database.
    return res.send(message);
});

// These paths work exactly like the users ones, but on a different resource.
// ❯ curl -X DELETE http://localhost:3000/messages/1
// --> DELETE HTTP method on messages/2 resource%

/* Expose a port defined in a hidden, .env file to the express app */
app.listen(process.env.PORT, () =>
    console.log(`Example app listening to port ${process.env.PORT}`)
);
