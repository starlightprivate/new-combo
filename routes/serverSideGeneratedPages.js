'use strict';

import express from 'express';

function route(app) {
  const router = express.Router();
  
  router.get('/', function (req, res) {
    res
      .status(200)
      .render('index', {
        'title': 'Index'
      });
  });

  router.get('/checkout.html', function (req, res) {
    res
      .status(200)
      .render('checkout', {
        'title': 'Checkout'
      });
  });

  router.get('/customercare.html', function (req, res) {
    res
      .status(200)
      .render('customercare', {
        'title': 'Customer\'s care'
      });
  });

  router.get('/partner.html', function (req, res) {
    res
      .status(200)
      .render('partner', {
        'title': 'Partner'
      });
  });

  router.get('/privacy.html', function (req, res) {
    res
      .status(200)
      .render('privacy', {
        'title': 'Privacy'
      });
  });

  router.get('/terms.html', function (req, res) {
    res
      .status(200)
      .render('terms', {
        'title': 'Terms'
      });
  });

  router.get('/us_batteryoffer.html', function (req, res) {
    res
      .status(200)
      .render('us_batteryoffer', {
        'title': 'US Battery Offer'
      });
  });

  router.get('/us_headlampoffer.html', function (req, res) {
    res
      .status(200)
      .render('us_headlampoffer', {
        'title': 'US Headlamp Offer'
      });
  });


  app.use('/', router);
}

module.exports = exports = route;