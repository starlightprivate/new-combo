'use strict';


import Redis from 'ioredis';
import config from './configManager.js';
import winston from 'winston';

const redis = new Redis(config.redis.REDIS_URL);

redis.on('connect', function () {
  winston.debug('Connection to redis database established')
});

exports.redis = redis;

/**
 * Sets the value of a key as a string in Redis
 *
 * @param {string} key - the key to store the value at
 * @param {any} value - A JSON serializable value
 * @param {number} [expiresIn] -  optional seconds to wait before deleting this key
 */
export async function setJson (key, value, expiresIn) {
  try {
    // set the key in redis
    redis.set(key, JSON.stringify(value));
    // add expiration in seconds if provided
    if (expiresIn) await redis.expire(key, expiresIn);
  }
  catch(error) {
    winston.error('Error setting json in redis', error.stack);
  }
}


/**
 * Returns the parsed JSON for the given key in redis
 * @param {string} key - the key whose value we want to return
 */
export async function getJson (key) {
  try {
    return JSON.parse(await redis.get(key));
  }
  catch(error) {
    winston.error('Error getting json from redis',error);
  }
}



