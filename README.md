# utu-gecko
This app is written for UTU (Melbourne) using **React.js**, **Node.js**, and **Express.js**. 
The app is deployed on **AWS** and the data is hosted by **MongoDB Atlas**.

<img src="https://user-images.githubusercontent.com/47294779/109730987-8bb1be00-7c0e-11eb-9719-9fab7a3a6e96.png" width="400" height="400" />

You can view the app here: <http://ec2-34-216-232-49.us-west-2.compute.amazonaws.com>.

The front end of the app is only consuming two of the following API endpoints:
- /api/data/
- /api/data/:startDate/:duration
- **/api/data/:coin/:startDate/:duration**
- **/api/stats/**
- /api/stats/:startDate/:duration
- /api/stats/:coin/:startDate/:duration

All the API endpoints are accessed with the GET methods and the responses are all in JSON format. 

As for the stats, we use each currency record's close price as the price for a particular day. 
We then compute the price change using `(current day close - target day close) / target day close`.

Let's say a user has requested the endpoint `/api/stats/2019-11-08/10`, we would get:
```js
{
    "date": "2019-11-08",
    "requested": 10,
    "length": 10,
    "stats": [
        {
            "Currency": "tezos",
            "Date": "2019-11-08",
            "Price": 1.17,
            "Volume": 44195683,
            "Market Cap": 770094896,
            "24h": -4.1,
            "7d": 33.3,
            "All": 28
        },
        {
            "Currency": "bitcoin",
            "Date": "2019-11-08",
            "Price": 8804.88,
            "Volume": 24333037836,
            "Market Cap": 158808570729,
            "24h": -5,
            "7d": -4.9,
            "All": -4.4
        },
        // ...
    ]
}
```

We do not have the `"30d"` stats since the requested duration is only 10.  

## Implementations
For the backend, we have 
- `db.js`: returns a method that's gonna give us a MongoDB client object, which we can use to connect to the database and perform queries.
- `data-process.js`: initial process to populate the MongoDB Atlas database; data is replicated into two collections, one by date, and another that simply stores each record.
- `query.js`: returns two query proxies, which `server.js` can use to query and cache results
- `server.js`: handles the user requests; returns either the HTML page for the built React app or JSON responses.

### Proxies and Cache
Considering that we are only dealing with daily records here, the current caching mechanism simply 
consists of two lightweight query proxies, one for data, and one for stats.

```js
function Proxy() {
  // ...
  const cache = {}
  
  return {
    queryMethod1(params) {
      return new Promise((resolve, reject) => {
        // create cacheKey from params
        // check if cache exists
        //    return the value immediately if available
        // otherwise connect to Atlas and make the necessary queries and processing
        //    store result in cache and resolve
      })
    },
  
    queryMethod2(params) {
    
    },
    
    // ...
  }
}

```

As the app is only for demonstration purpose, cache here does not have a capacity limitation. 
When we need to deal with capacity, data structures like LRU Cache can be adopted.

Now, in real use cases where records are being continuously inserted in the database, 
we surely need to come up with a better caching solution. 

It would be ideal to set up dedicated cache servers and have one or a few servers query the database and 
update the caches periodically. As for the cache invalidation methods, I personally favor LRU Cache, which is both
simple and effective. Depending on the actual functional and non-functional requirements, 
we can then adjust our cache strategy accordingly.

Having set up the cache servers, when our API deali with user requests, they can first try the caches 
and then query the database and ask the cache servers to cache the query results if necessary. 
