import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    return res.send(Object.values(req.context.models.users)); //Returns the entire contents of the users dataset
});
/*  EXAMPLE -- 
❯ curl http://localhost:3000/users            
[{"id":"1","username":"Robin Wieruch"},{"id":"2","username":"Dave Davids"}]%                     
*/

// Lets add another path ,that will return a specific user, based on the provided id
router.get('/:userId', (req, res) => {
    return res.send(req.context.models.users[req.params.userId]); // Returns a specific user based on the provided id
});
/* EXAMPLE --
❯ curl http://localhost:3000/users/1
{"id":"1","username":"Robin Wieruch"}%                                                           
*/

/*
Naturally, commencing a put or delete operation, is done to a single part of a resource 
instead of the whole collection. This is spcified with a :userid in the URI
*/
router.put('/users/:userId', (req, res) => {
    return res.send(`PUT HTTP method on user/${req.params.userid} resource`);
});

router.delete('/users/:userId', (req, res) => {
    return res.send(`DELETE HTTP method on user/${req.params.userid} resource`);
});

/* EXAMPLE -- */
// ❯ curl -X DELETE http://localhost:3000/users/2
// --> DELETE HTTP method on user/2 resource%

// Note how we dont define the /users port of the URI, this is already done during the mounting
//process to the express app, therefore only the sub-routes are needed to be mounted.
export default router;
