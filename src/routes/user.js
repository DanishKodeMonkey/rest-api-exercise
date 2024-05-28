import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    return res.send(Object.values(req.context.models.users)); //Returns the entire contents of the users dataset
});

router.get('/:userId', (req, res) => {
    return res.send(req.context.models.users[req.params.userId]); // Returns a specific user based on the provided id
});

// Note how we dont define the /users port of the URI, this is already done during the mounting
//process to the express app, therefore only the sub-routes are needed to be mounted.
export default router;
