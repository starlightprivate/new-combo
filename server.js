'use strict';

import config from './lib/configManager.js';
import winston from 'winston';
import path from 'path';

import express from 'express';
import http from 'http';

//to parse POST, PUT, DELETE, PATCH body
import bodyParser from 'body-parser';

//to comprese response to save bandwith
import compression from 'compression'


import expressPromiseRouter from 'express-promise-router';


import hoganExpress from 'hogan-express';

//proper session implementation
import expressSession from 'express-session'; //initialize sessions
import cookieParser from 'cookie-parser'; // parse cookies to start sessions from
import connectRedis from 'connect-redis'//store session data in redis database
import csurf from 'csurf'; //add CSRF protection https://www.npmjs.com/package/csurf

//redis database
import redis from './lib/redisManager.js';

// "protection" middlewares :-)
import helmet from 'helmet';
import hpp from 'hpp';
import csp from 'helmet-csp';

//error reporting middleware
import raven from 'raven';


// import csvimport from './config/import';
import { routes } from './routes/v2';
import serverSideGeneratedPagesRoutes from './routes/serverSideGeneratedPages';

const app = express();

winston.cli();
if (config.ENV === 'development') {
  winston.level = 'silly';
} else {
  winston.level = 'info';
}


winston.info("Running on %s environment", config.ENV);


//setting server side templates
app.engine('html', hoganExpress);
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.set('view engine', 'html');

//to not conflict with Angular and other client side JS that use {{ }} for data
app.locals.delimiters = '[[ ]]';

app.use(raven.middleware.express.requestHandler(config.ravenMiddleWareUri));
app.use(compression());

//see https://www.npmjs.com/package/helmet
//we add headers that improve security here
app.use(helmet());
app.use(helmet.referrerPolicy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.ieNoOpen());
app.use(helmet.xssFilter());
//not sure about it
app.use(helmet.hpkp({
  maxAge: 24 * 60 * 60,
  sha256s: ['AbCdEfSeTyLBvTjEOhGD1627853=', 'ZyXwYuBdQsPIUVxNGRDAKGgxhJVu456=']
}));


//see https://www.npmjs.com/package/helmet-csp
app.use(csp({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'"]
  }
}));


//we parse POST, PUT, DELETE, PATCH body here
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//https://www.npmjs.com/package/hpp
app.use(hpp());


//why????
// var MAX_CONTENT_LENGTH_ACCEPTED = 9999;
// app.use(expressContentLength.validateMax({
//   max: MAX_CONTENT_LENGTH_ACCEPTED,
//   status: 400,
//   message: "stop max size for the content-length!"
// })); // max size accepted for the content-length


//setup redis powered sessions
//https://github.com/vodolaz095/hunt/blob/master/lib/http/expressApp.js#L236-L244
const RedisSessionStore = connectRedis(expressSession);
app.use(cookieParser(config.secret));
app.use(expressSession({
  key: 'PHPSESSID', //LOL
  store: new RedisSessionStore({
    prefix: 'starlight_session_',
    client: redis
  }),
  expireAfterSeconds: 3 * 60 * 60, //3 hours
  secret: config.secret,
  httpOnly: true,
  resave: true,
  saveUninitialized: true
}));

const csrfProtectionMiddleware = csurf({ cookie: true });
app.use(csrfProtectionMiddleware);

app.use(function (req, res, next) {
  res.set(`X-Powered-By`, `TacticalMastery`);
  next();
});

//protect from tampering session - basic example
//it saves IP and entry point into session.
//if IP changes, it is likely to be bot or somebody using tor
//if entryPoint is the api endpoint being called now, it is likely to be bot

//https://starlightgroup.atlassian.net/browse/SG-5
//https://starlightgroup.atlassian.net/browse/SG-8
//https://starlightgroup.atlassian.net/browse/SG-9
app.use(function (req,res, next) {
  //http://stackoverflow.com/a/10849772/1885921
  req.session.ip =  req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!req.session.entryPoint) {
    //http://expressjs.com/en/api.html#req.originalUrl
    req.session.entryPoint = req.originalUrl;
  }
  next();
});



//provide CSRF token in Anatolij's way - it works with angular 1.x from the box
app.use(function (req,res,next) {
  if (req.session) {
    const token = req.csrfToken();
    res.locals.csrf = token;
    res.cookie('XSRF-TOKEN', token);
    next();
  } else {
    next();
  }
});

//provide csrf token in Safi's way.
app.get('/api_key.js', function(req, res) {
  res.setHeader('content-type', 'text/javascript');
  res.setHeader('Cache-Control', 'no-cache');
  res.end("window.api_key = '" + req.csrfToken() + "'");
});

// server side generated pages, not api!

serverSideGeneratedPagesRoutes(app);

//load API routes with appropriate version prefix
Object.keys(routes).forEach(r => {
  const router = expressPromiseRouter();
  // pass promise route to route assigner
  routes[r](router);
  app.use(`/api/${r}`, router);
});
//and, serve static assets at last
app.use(express.static(path.join(__dirname, 'public')));

app.use(raven.middleware.express.errorHandler(config.ravenMiddleWareUri));

//creepy error handler
app.use(function (err, req, res, next) {
  if (err) {
    winston.error(err);
    if (typeof err.status != "undefined") res.status(err.status);
    res.error(err.message || err);
  }
});

//for unit tests
module.exports = exports = app;

//actually start application
if (!module.parent) {
  http
    .createServer(app)
    .listen(config.PORT, config.HOST, function (error) {
      if (error) {
        throw error
      }
      winston.info('Application is listening on %s:%s port', config.HOST, config.PORT);
    });
}
