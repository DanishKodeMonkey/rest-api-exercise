import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import { verifyToken } from '..';
const jwt = require('jsonwebtoken');

const router = Router();
router.get('/', (req, res) => {
    return res.send(Object.values(req.context.models.messages)); //Returns the entire contents of the messages dataset
});

router.get('/:messageId', (req, res) => {
    return res.send(req.context.models.messages[req.params.messageId]); // Returns a specific message based on the provided id
});

// Protect route, by using a middleware for verifying the token (see entrypoint index.js)
router.post('/', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
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

            req.context.models.messages[id] = message;

            return res.send(message);
        }
    });
});
/* Example
❯ curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMSIsInVzZXJuYW1lIjoiUm9iaW4gV2llcnVjaCJ9LCJpYXQiOjE3MTY4OTIzMzB9.DTrS2X9jQRcRFvLAbMLYa6IMwbYpuHIhAucYivR5hAQ" http://localhost:3000/messages -d '{"text":"Your message here"}'

{"id":"9fbb4185-b34f-410b-b5ba-317674c3eaef","text":"Your message here","userId":"1"}%   
*/
router.delete('/:messageId', (req, res) => {
    const { [req.params.messageId]: message, ...otherMessages } =
        req.context.models.messages;

    req.context.models.messages = otherMessages;

    return res.send(message);
});
router.put('/:messageId', (req, res) => {
    const { messageId } = req.params;
    const { text } = req.body;

    req.context.models.messages[messageId].text = text;

    return res.send(req.context.models.messages[messageId]);
});

// Note how we dont define the /messages port of the URI, this is already done during the mounting
//process to the express app, therefore only the sub-routes are needed to be mounted.
export default router;
