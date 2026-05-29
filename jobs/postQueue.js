const { Queue } = require('bullmq');

const redisConnection =
  require('../config/redis');

const postQueue = new Queue(
  'postQueue',
  {
    connection: redisConnection
  }
);


redisConnection.on('connect', () => {
  console.log('Redis Connected');
});

redisConnection.on('error', (err) => {
  console.log('Redis Error:', err.message);
});


module.exports = postQueue;