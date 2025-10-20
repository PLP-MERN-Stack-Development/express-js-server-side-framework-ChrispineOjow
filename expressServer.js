import express from 'express';
import 'dotenv/config';
import {connectDB} from'./config/db.js';
import  router  from './routes/Routes.js';
import logger from './Middleware/logger.js';
import errorHandler from './Middleware/errorHandler.js';

//Connect to the database
await connectDB();


//Initialize the express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON Haven't use the body parser cause in new versions of express it is included
app.use(logger)
app.use(express.json());
app.use(router);

//sample route
/*
app.get('/', (req, res) => {

    res.send(`Hello World`);

})
*/ //This section will not run because i've called everything from the route file so its just their incase it isn't connected

// Global error handling middleware
app.use(errorHandler);

//Start the server
app.listen(PORT, () =>{

    console.log(`The server is up and running at http://localhost:${PORT}`);
    
})