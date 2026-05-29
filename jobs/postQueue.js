const { Queue } = require('bullmq');

const redisConnection =
  require('../config/redis');

const postQueue = new Queue(
  'postQueue',
  {
    connection: redisConnection
  }
);

module.exports = postQueue;