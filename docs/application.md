# Getir Case Study

Basic nodejs, express, mongodb application that handles HTTP POST requests.

## Endpoints

### **POST /**

This endpoint handles a specific type of request payload that is a JSON and contains four fields.
Any one of these four fields missing will result in an error message in the response.
Below is an example request payload.

```
{
"startDate": "2016-01-26",
"endDate": "2018-02-02",
"minCount": 2700,
"maxCount": 2720
}
```

As a response, this endpoint will return a JSON message containing status code, message and an array of records that is filtered according
to the request payload. Below is an example response that is the result of the reqeust above.

```
{
    "code": 0,
    "msg": "Success",
    "records": [
        {
            "key": "KYKAKxDr",
            "createdAt": "2016-11-27T00:30:34.725Z",
            "totalCount": 2713
        },
        {
            "key": "uLQICSdH",
            "createdAt": "2016-11-23T23:55:44.449Z",
            "totalCount": 2716
        },
        {
            "key": "HJGWkdmD",
            "createdAt": "2016-06-08T13:28:10.965Z",
            "totalCount": 2718
        },
        {
            "key": "nfzwhnJm",
            "createdAt": "2016-05-15T23:21:00.153Z",
            "totalCount": 2719
        },
        {
            "key": "udZfCkvB",
            "createdAt": "2016-05-15T00:36:34.126Z",
            "totalCount": 2701
        },
        {
            "key": "vZZOIiPi",
            "createdAt": "2016-03-02T09:30:26.664Z",
            "totalCount": 2701
        }
    ]
}
```

## Helper Functions

### **findRecords(pipeline)**

This helper function takes only one argument pipeline that corresponds to the aggregation pipeline for the mongodb which is created according to the
reqeust payload. It establishes a connection to the mongodb, applies the aggregate operation, and returns records. An example pipeline can be seen below.

```javascript
const pipeline = [
            {
                $match: {
                    createdAt: {
                        $gte: new Date(req.body.startDate),
                        $lte: new Date(req.body.endDate)
                    }
                }
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
```

### **checkPayload(payload)**

This function checks the request payload mentioned in the endpoints section and returns ```false``` if any field is missing.
