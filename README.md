# utu-gecko
This app is written for UTU (Melbourne) using **React.js**, **Node.js**, and **Express.js**. 
The app is deployed on **AWS** and the data is hosted by **MongoDB Atlas**.

You can view the app here: <http://ec2-34-216-232-49.us-west-2.compute.amazonaws.com>.

The front end of the app is only consuming two of the following API endpoints:
- /api/data/
- /api/data/:startDate/:duration
- **/api/data/:coin/:startDate/:duration**
- **/api/stats/**
- /api/stats/:startDate/:duration
- /api/stats/:coin/:startDate/:duration

All the API endpoints are accessed with the GET methods and the responses are all in JSON format. 

## Implementations
Considering that we are only dealing with daily records here, the current caching mechanism is simply a lightweight query proxy. 

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

Now, in real use cases where records are being continuously inserted in the database, we surely need to come up with a better caching solution. 
