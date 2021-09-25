import config from './config/config.json';
import express from 'express';
import { MongoClient } from 'mongodb';
//import Record from './record.model.js';
const findRecords = async (collection, pipeline) => {
    const aggCursor = coll.aggregate(pipeline);
    for await (const doc of aggCursor) {
        console.log(doc);
    }
};
const main = async () => {
    let client = new MongoClient(config.mongoUrl);
    try {
        MongoClient.connect(config.mongoUrl, (err, client) => {
            const db = client.db('getir-case-study');
            db.collection('records').findOne({
                createdAt: {
                    $lte: new Date('2015-06-03')
                }
            }, (findErr, result) => {
                if (findErr) throw findErr;
                console.log(result);
            })
        });
    }
    catch (err) {
        console.error(err);
    }
    client = await client.connect();
    const db = client.db('getir-case-study');
    const collection = db.collection('records');

    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ }));
    
    app.get('/', (req, res, next) => {
        res.json(['Yaren']);
        });
    
    app.post('/', async (req, res, next) => {
        console.log(req.body);
        const filter = {
            createdAt: {
                $gte: new Date(req.body.startDate).toISOString(),
                $lte: new Date(req.body.endDate).toISOString()
            }
        };
        console.log(filter);
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
    });
    
    app.listen(3000, () => {
        console.log('Server running');
    });
};
main().catch(console.error);

  