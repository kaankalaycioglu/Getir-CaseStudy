import express from 'express';

// middlewares
import handleError from './middlewares/handle-error.js';

// helpers
import findRecords from './helpers/find-records.js';
import checkPayload from './helpers/check-payload.js';

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
        if(!checkPayload(req.body)) {
            throw new Error('Missing fields in request payload');
        }
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
        const records = await findRecords(pipeline);
        if (records instanceof Error) {
            throw records;
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
