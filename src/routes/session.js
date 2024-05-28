import { Router } from 'express';
// Import the router middleware of express and enable the method.
// This will allow us to access the router across the app.
const router = Router();

router.get('/', (req, res) => {
    return res.send(req.context.models.users[req.context.me.id]);
});

export default router;
