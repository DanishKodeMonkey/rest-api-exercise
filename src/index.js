import 'dotenv/config';
import cors from 'cors';
import express from 'express';

// pseudo-database models
import models from './models';

// routes
import routes from './routes';

const app = express();

app.use((req, res, next) => {
    // Create a property, context, that will associate the models object and asssign the req to user 1.
    req.context = {
        models,
        me: models.users[1],
    };
    // next passes the request to the next middleware
    next();
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Set up some routes */
app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

/* Expose a port defined in a hidden, .env file to the express app */
app.listen(process.env.PORT, () =>
    console.log(`Example app listening to port ${process.env.PORT}`)
);
