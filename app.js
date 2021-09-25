import dotenv from 'dotenv';
import express from 'express';
import { MongoClient } from 'mongodb';
import handleError from './middlewares/handle-error.js';

dotenv.config();

// establish mongodb connection
let client = new MongoClient(process.env.MONGO_URI);
let collection;
try {
    client = await client.connect();
    const db = client.db('getir-case-study');
    collection = db.collection('records');

}
catch (err) {
    console.error(err);
}

// start defining express app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ }));

// basic get route for convenience
app.get('/', (req, res, next) => {
    try {
        res.send('Getir Case Study');
    }
    catch (err) {
        next(err);
    }
});

// main endpoint that handles http post requests
app.post('/', async (req, res, next) => {
    try {

        // define filters for aggregate operation using the request body
        const filter = [
            {
                createdAt: {
                    $gte: new Date(req.body.startDate),
                    $lte: new Date(req.body.endDate)
                }
            },
            {
                totalCount: {
                    $gte: req.body.minCount,
                    $lte: req.body.maxCount
                }
            }
        ];

        // define mongodb aggregate pipeline
        const pipeline = [
            {
                $match: filter[0]
            },
            {
                $project: {
                    _id: false,
                    key: true,
                    createdAt: true,
                    totalCount: { $sum: '$counts'}
                }
            },
            {
                $match: filter[1]
            }
        ];

        // get results from mongodb collection and store in an array
        const aggCursor = collection.aggregate(pipeline);
        let records = [];
        for await (const doc of aggCursor) {
            records.push(doc);
        }
        // create response according to the specifications and send it
        const response = {
            code: 0,
            msg: 'Success',
            records
        }
        res.json(response);
    }
    catch (err) {
        // if an error is thrown pass it to the error handler middleware
        next(err);
    }
    
});
// if a request comes to an undefined route throw Not Found error
app.use('*', (req, res, next) => {
    const error = new Error('Not Found!');
    error.code = 404;
    next(error);
});
app.use(handleError);

export default app;
