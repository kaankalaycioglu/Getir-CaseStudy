import dotenv from 'dotenv';
import express from 'express';
import { MongoClient } from 'mongodb';
import handleError from './middlewares/handle-error.js';

dotenv.config();

const main = async () => {
    let client = new MongoClient(process.env.MONGO_URI);
    let collection;
    try {
        client = await client.connect();
        const db = client.db(process.env.DB_NAME);
        collection = db.collection(process.env.COLLECTION_NAME);
    
    }
    catch (err) {
        console.error(err);
    }
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ }));
    
    app.get('/', (req, res, next) => {
        try {
            res.send('Hello There');
        }
        catch (err) {
            next(err);
        }
    });
    
    app.post('/', async (req, res, next) => {
        try {
            const filter = {
                createdAt: {
                    $gte: new Date(req.body.startDate).toISOString(),
                    $lte: new Date(req.body.endDate).toISOString()
                }
            };
            const pipeline = [
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(req.body.startDate),
                            $lte: new Date(req.body.endDate)
                        }
                    },
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
                    $match: {
                        totalCount: {
                            $gte: req.body.minCount,
                            $lte: req.body.maxCount
                        }
                    }
                }
            ]
            const aggCursor = collection.aggregate(pipeline);
            let records = [];
            for await (const doc of aggCursor) {
                records.push(doc);
            }
            const response = {
                code: 0,
                msg: 'Success',
                records
            }
            res.json(response);
        }
        catch (err) {
            next(err);
        }
        
    });
    app.use('*', (req, res, next) => {
        const error = new Error('Not Found!');
        error.code = 404;
        next(error);
    });
    app.use(handleError);
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log('Server running');
    });
};
main().catch(console.error);

  
