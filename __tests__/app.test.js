import request from 'supertest';
import app from '../app.js';

describe('POST / ', () => {
    it('should respond with an array of records, status code and message', async () => {
        const response = await request(app).post('/').send({
        startDate: '2016-01-26',
        endDate: '2018-02-02',
        minCount: 2700,
        maxCount: 3000
        });
        expect(response.body.code).toBe(0);
        expect(response.body.msg).toBe('Success');
        expect(response.body).toHaveProperty('records');
    });
    it('should respond with an error if any request field is missing', async () => {
        const response = await request(app).post('/').send({
        startDate: '2016-01-26',
        endDate: '2018-02-02',
        minCount: 2700
        });
        expect(response.body.code).toBe(500);
        expect(response.body.msg).toBe('Missing fields in request payload');
    });

    it('should respond with an error if request is send to wrong routes', async () => {
        const response = await request(app).post('/getir').send({
        startDate: '2016-01-26',
        endDate: '2018-02-02',
        minCount: 2700,
        maxCount: 3000
        });
        expect(response.body.code).toBe(404);
        expect(response.body.msg).toBe('Not Found!');
    });
  });