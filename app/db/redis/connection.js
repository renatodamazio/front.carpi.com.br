const redis = require('redis');
const bluebird = require('bluebird');
const redisOpts = {
    host: process.env.REDIS_HOST !== 'null' ? process.env.REDIS_HOST : '127.0.0.1',
    port: process.env.REDIS_PORT !== 'null' ? process.env.REDIS_PORT : '6379'
}
const client = redis.createClient(redisOpts);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = {
    connection: () => client
}
