import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';

const router = Router();
// the four main nouns to keep in mind for a REST api are: GET, POST, PUT and DELETE
router.get('/', (req, res) => {
    return res.send(Object.values(req.context.models.messages)); //Returns the entire contents of the messages dataset
});

router.get('/:messageId', (req, res) => {
    return res.send(req.context.models.messages[req.params.messageId]); // Returns a specific message based on the provided id
});

router.post('/', (req, res) => {
    // Since we arent using a database, we will use uuid to create unique identifiers for new posts
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
// And thanks to our earlier middleware setup, our API and server are able to parse these requests
// to new messages!
/* 
❯ curl -X POST -H "Content-Type:application/json" http://localhost:3000/messages -d '{"text":"Hi again, World"}'
{"id":"8c310788-ee3d-4bc4-986e-fe1b9f7ec4da","text":"Hi again, World"}%                          

*/

router.delete('/:messageId', (req, res) => {
    // In order to delete a message, we will use a dynamic object property to exclude the message
    // that we want to delete from the messages object.
    const { [req.params.messageId]: message, ...otherMessages } =
        req.context.models.messages;

    // update the messages object with the other messages, now excluding the deleted one.
    req.context.models.messages = otherMessages;

    // send new messages object to database.
    return res.send(message);
});
router.put('/messages/:messageId', (req, res) => {
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

// Note how we dont define the /messages port of the URI, this is already done during the mounting
//process to the express app, therefore only the sub-routes are needed to be mounted.
export default router;
