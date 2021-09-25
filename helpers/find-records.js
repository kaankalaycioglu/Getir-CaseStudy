import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const findRecords = async pipeline => {
    // establish mongodb connection
    let client = new MongoClient(process.env.MONGO_URI);
    let collection;
    try {
        client = await client.connect();
        const db = client.db('getir-case-study');
        collection = db.collection('records');
        
        // apply pipeline to get records from db
        const aggCursor = collection.aggregate(pipeline);
        let records = [];
        for await (const doc of aggCursor) {
            records.push(doc);
        }
        // close mongodb connection
        client.close();
        
        return records;
    }
    catch (err) {
        return err;
    }

};

export default findRecords;