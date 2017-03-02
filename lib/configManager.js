'use strict';

import util from "util";

let redisUrl = 'redis://localhost:6379';

if (process.env.REDIS_URL) {
  redisUrl = process.env.REDIS_URL;
}

//for docker compose setup
if (process.env.REDIS_PORT_6379_TCP_ADDR && process.env.REDIS_PORT_6379_TCP_PORT) {
  redisUrl = util.format("redis://%s:%s/", process.env.REDIS_PORT_6379_TCP_ADDR, process.env.REDIS_PORT_6379_TCP_PORT);
}

const config = {
  autopilot: {
    key: process.env.AUTOPILOT_KEY || '7d72a72715de40668977c638c01273c8',
    clientlist: process.env.AUTOPILOT_CLIENT_LIST || 'contactlist_59EA0BF8-46D0-4733-B6C5-4F2EB7C890AA'
  },
  newRelic: {
    app_name: ['TacticalMastery API'],
    license_key: process.env.NEW_RELIC_LICENSE || '1b75b09c1d7ca8692bcb9792117eea7ac12fea38',
    logging: {
      level: 'info'
    }
  },
  konnective: {
    loginId: process.env.KONNECTIVE_LOGIN_ID || 'flashlightsforever',
    password: process.env.KONNECTIVE_PASSWORD || 'gCx3N8DGqDhTTh'
  },
  leadoutpost: {
    apiKey: process.env.LEADOUTPOST_API_KEY || 'CITg0XHH3kGJQ4kkjZizRxzUEINR2nZaLRRstUyHs',
    campaignId: process.env.LEADOUTPOST_CAMPAIGN_ID || 5
  },
  email: process.env.ADMIN_EMAIL || 'support@tacticalmastery.com',
  redis: {
    REDIS_URL: redisUrl
  },
  secret: process.env.SECRET || '2ab7734c730bb56ee1b6c5205346ae61373b3f6f', //to salt sessions and implement CSRF
  ravenMiddleWareUri: process.env.RAVEN_MIDDLEWARE_URI || 'https://547e29c8a3854f969ff5912c76f34ef0:62c29411c70e46df81438b09d05526b0@sentry.io/106191',
  ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3000
};

module.exports = exports = config;