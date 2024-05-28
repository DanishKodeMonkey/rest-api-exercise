import { Router } from 'express';
// Import the router middleware of express and enable the method.
// This will allow us to access the router across the app.
const router = Router();

// And since we, thanks to our custom middleware, have a pseudo-authenticated users, we can offer a
// dedicated route for this too!

// This path simply returns a pseudo-authenticated user.
// By associating the request.context.me.id property to its value in the users model.
router.get('/', (req, res) => {
    return res.send(req.context.models.users[req.context.me.id]);
});

// This is the first feature that is not entirely RESTful, since we are offering a very specific endpoint.
// But that is okay, most APIs are not entirely RESTful, but rather RESTish anyway, the point is to
// make it as RESTful as possible.

// These paths work exactly like the users ones, but on a different resource.
// ❯ curl -X DELETE http://localhost:3000/messages/1
// --> DELETE HTTP method on messages/2 resource%

export default router;
