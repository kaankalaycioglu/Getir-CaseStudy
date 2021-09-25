const request = require('supertest');
const app = require('../app');

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
  });