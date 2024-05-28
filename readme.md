# REST API Exercise

This is a proof of concept project, that demonstrates the creation and usage of a custom REST API using Node.js and Express. It performs basic crud operations, using an in-memory data model, showcasing how to set up and structure a RESTish service.

Table of Contents

-   [Introduction](#introduction)
-   [Project Structure](#project-structure)
-   [Setup](#Setup)
-   [Environment Variables](#environment-variables)
-   [Middleware](#middleware)
-   [Routes](#routes)
    -   [Session Routes](#session-routes)
    -   [User Routes](#user-routes)
    -   [Message Routes](#message-routes)
-   [Starting the Server](#starting-the-server)
-   [How It Works](#how-it-works)
-   [Conclusion](#conclusion)

## Introduction

This project is a proof of concept exercise for creating and using a custom REST API to solidify the knowledge gained from various sources, including [Stack Overflow's blog on API best practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design) and [restfulapi.net](https://restfulapi.net/). These are excellent starting points for a deep dive into REST API design.

The API uses Express.js for handling HTTP requests and both built-in and custom middleware for request processing and routing. The data is stored in-memory using JavaScript objects, but could easily be refactored to use a full database infrastructure.

The purpose of this project is to serve as hands-on documentation for setting up a new API and providing a starting point for future projects.

## Project Structure

The project has the following structure:

```
rest-api-exercise/
├── src/
│ ├── index.js
│ ├── models/
│ │ └── index.js
│ ├── routes/
│ │ ├── index.js
│ │ ├── message.js
│ │ ├── session.js
│ │ └── user.js
├── .babelrc
├── .env
├── package.json
└── README.md
```

-   `src/index.js`: Serves as the main entry point of the application.
-   `src/models/index.js`: Acts as our pseudo-database, using in-memory data models.
-   `src/routes/index.js`: Assembles all of the various route modules.
    -   `src/routes/`: Contains the different routers that manage their individual operations.
-   `.babelrc`: A Babel configuration file for ES6+ support.
-   `.env`: A hidden environment variable file holding sensitive information (best practice, not included in the repo).
-   `package.json`: Project metadata and dependencies.

## Setup

The following Node packages were immensely useful throughout the project:

-   [@babel](https://babeljs.io/): A tool that enables browser-compatible JavaScript output from next-gen JavaScript features.
-   [Nodemon](https://www.npmjs.com/package/nodemon): A tool that automatically restarts the application when project files are edited.
-   [CORS](https://www.npmjs.com/package/cors): A middleware package for enabling CORS, which is used to restrict access between web applications on a domain level.
-   [Dotenv](https://www.npmjs.com/package/dotenv): A package for loading environment variables from a `.env` file.
-   [Express](http://expressjs.com/): The main framework used for handling HTTP requests and middleware.
-   [UUID](https://www.npmjs.com/package/uuid): A collection of cryptographically strong random value generators.

## Environment Variables

The project uses environment variables to configure the server. In this case, it holds a single variable:

`PORT=3000`

As the project expands, more secrets such as database connection strings and session secrets can be added here.

## Middleware

There are two kinds of middleware in Express.js: application-level and router-level middleware. Here, we set up some application-level middleware and tie them to the app.

The application uses several middleware functions to handle requests, including some custom middleware:

### Custom Middleware

The custom context middleware associates the request with a specified user and model. This facilitates passing requests and responses through the application and determining the user performing an action, such as creating a message.

This concept is a key characteristic of REST
It should be possible to create multiple server instances to balance traffic evenly between servers.
This is where load balancing comes in. To clarify, the stateless term means to never maintain state,
like an authenticated user, outside of a database. So that the client always has to send its information
along with every request. A server can then take each request and take care of authentication on
an application level. Providing a session state instead, to every Express route in the application.

```javascript
app.use((req, res, next) => {
    req.context = {
        models,
        me: models.users[1],
    };
    next();
});
```

Aside from that, some built-in middleware from express was also used, like the body parsing middleware.
This parses JSON and URL-Encoded payloads

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

This covers another aspect of REST. To use only a single payload format (like JSON)
and stick to it!

## Routes

The key difference between URL routing in a traditional web application and an API is the use of nouns rather than verbs, and the returned resource in response.

Doing this, we can establish a clear chain of operations between the client and the rest of the service: `Client -> (REST API -> Server) -> Database`.

In this case, we have set up our routes separately from the main application entry point to maintain a pure single-purpose state. We mount our modular routes to the application, with each modular route receiving a URI. In REST, this is our resource: an important aspect of REST is that every URI acts as a resource, like /users.

The paths we define also define the resources that the client will use. We can have as many or as few as we need.

### Session Routes

The purposes of this route is to handle session-related requests, simulating user authentication.

-   **GET /session**: Returns the current user
    This path simply returns a pseudo-authenticated user.
    By associating the request.context.me.id property to its value in the users model.

    ```javascript
    router.get('/', (req, res) => {
        return res.send(req.context.models.users[req.context.me.id]);
    });
    ```

    This is the first feature that is not entirely RESTful, since we are offering a very specific endpoint.
    But that is okay, most APIs are not entirely RESTful, but rather RESTish anyway, the point is to
    make it as RESTful as possible.

### User Routes

Handles user-related requests

-   **GET /users**: Returns all users.
    Returns the entire contents of the users dataset

    ```javascript
    router.get('/', (req, res) => {
        return res.send(Object.values(req.context.models.users));
    });
    ```

-   **GET /users/:userId**: Returns a specific user by ID.
    Returns a specific user based on the provided id

    ```javascript
    router.get('/:userId', (req, res) => {
        return res.send(req.context.models.users[req.params.userId]);
    });
    ```

### Message Routes

Handles message-related requests.

-   **GET /messages**: Returns all messages.
    Simply returns the entire contents of the messages dataset

    ```javascript
    router.get('/', (req, res) => {
        return res.send(Object.values(req.context.models.messages));
    });
    ```

-   **GET /messages/:messageId**: Returns a specific message by ID.
    Tries to find a message from the model, based on the dynamic object property :messageId

    ```javascript
    router.get('/:messageId', (req, res) => {
        return res.send(req.context.models.messages[req.params.messageId]);
    });
    ```

-   **POST /messages**: Creates a new message.
    Since we aren't using a database, we will use uuid to create unique identifiers for new posts

    ```javascript
    router.post('/', (req, res) => {
        const id = uuidv4();

        // establish the message object
        const message = {
            // use generaated id as a property in the message object.
            id,
            // extract text payload from body of request HTTP method
            text: req.body.text,
            // attached attained me.id property of request object, as gained through custom middleware.
            userId: req.context.me.id,
        };

        // assign the message, in the messages object by identifier.
        req.context.models.messages[id] = message;

        // return new message to client
        return res.send(message);
    });
    ```

-   **DELETE /messages/:messageId**: Deletes a specific message by ID.
    In order to delete a message, we will use a dynamic object property to exclude the message using some object destructuring.

    ```javascript
    router.delete('/:messageId', (req, res) => {
        // destructure the messages object model, excluding the message, based on the messageId
        const { [req.params.messageId]: message, ...otherMessages } =
            req.context.models.messages;

        // update the messages object with the other messages, now excluding the deleted one.
        req.context.models.messages = otherMessages;

        // send new messages object to database.
        return res.send(message);
    });
    ```

-   **PUT /messages/:messageId**: Updates a specific message by ID.
    Similarly to deleting a message, we can extract the different parts of the request to put
    together an update operation.

    ```javascript
    router.put('/messages/:messageId', (req, res) => {
        const { messageId } = req.params;
        const { text } = req.body;

        // update the database contents with the text from the request
        messages[messageId].text = text;

        // and send the new object to the database.
        return res.send(messages[messageId]);
    });
    ```

## Starting the Server

To start the server, run the following command

```

npm start

```

This will start the server, andd listen on the port specified in the .env file

## How does it work

The application works by sending requests to the API and receiving the requested data (if available and authorized) in a response.

For example, using cURL to access http://localhost:3000/users will, by default, use an HTTP GET method. However, we can specify the HTTP method using the -X (or --request) flag. Doing this, we can access different routes of the Express application, using its API endpoints with a URI.

This is another key aspect of REST: using HTTP methods to perform operations on URIs, commonly referred to as CRUD operations (Create, Read, Update, Delete).

Due to the distinct nature of API practices, using nouns instead of verbs is required. The direct connection between CRUD and REST can be determined as:

    C for Create: HTTP POST
    R for Read: HTTP GET
    U for Update: HTTP PUT
    D for Delete: HTTP DELETE

Thanks to our earlier middleware setup, our API and server can parse these requests to handle new messages!

Examples:

Make new message

```
❯ curl -X POST -H "Content-Type:application/json" http://localhost:3000/messages -d '{"text":"Hi again, World"}'
{"id":"8c310788-ee3d-4bc4-986e-fe1b9f7ec4da","text":"Hi again, World"}%

```

Update message

```
❯ curl -X PUT -H "Content-Type:application/json" http://localhost:3000/messages/1 -d '{"text":"Hi again, World edited!"}'
{"id":"1","text":"Hi again, World edited!","userId":"1"}%
*/
```

## Conclusion

This project showcases the fundamental principles of building a RESTish API with Express. It includes setting up middleware, defining routes, and handling CRUD operations with an in-memory data model. Use this as a reference or starting point for building more complex APIs with persistent storage and advanced features.
