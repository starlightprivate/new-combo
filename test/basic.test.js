'use strict';
import supertest from 'supertest';
import app from './../server.js';

require('should');

describe('web application can be started', function () {
  it('serves 200 on / with proper headers', function (done) {
    supertest(app)
      .get('/')
      .expect('X-Powered-By', 'TacticalMastery')
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect(200, done);
  });
});

describe('server side generated templates', function () {
  it('serves  proper /', function (done) {
    supertest(app)
      .get('/')
      .expect(200)
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect('Content-Type', /text\/html/, done);
  });
  it('serves  proper /checkout.html', function (done) {
    supertest(app)
      .get('/checkout.html')
      .expect(200)
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect('Content-Type', /text\/html/, done);
  });
  it('serves  proper /customercare.html', function (done) {
    supertest(app)
      .get('/customercare.html')
      .expect(200)
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect('Content-Type', /text\/html/, done);
  });
  it('serves  proper /partner.html', function (done) {
    supertest(app)
      .get('/partner.html')
      .expect(200)
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect('Content-Type', /text\/html/, done);
  });
  it('serves  proper /privacy.html', function (done) {
    supertest(app)
      .get('/privacy.html')
      .expect(200)
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect('Content-Type', /text\/html/, done);
  });
  it('serves  proper /terms.html', function (done) {
    supertest(app)
      .get('/terms.html')
      .expect(200)
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect('Content-Type', /text\/html/, done);
  });
  it('serves  proper /us_batteryoffer.html', function (done) {
    supertest(app)
      .get('/us_batteryoffer.html')
      .expect(200)
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect('Content-Type', /text\/html/, done);
  });
  it('serves  proper /us_headlampoffer.html', function (done) {
    supertest(app)
      .get('/us_headlampoffer.html')
      .expect(200)
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect('Content-Type', /text\/html/, done);
  });
});

describe('v2 api', function () {
  it('serves 200 and pong on /api/v2/ping', function (done) {
    supertest(app)
      .get('/api/v2/ping')
      .expect(200)
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect('pong', done);
  });

  it.skip('has 200 for /api/v2/state/0054', function (done) {
    supertest(app)
      .get('/api/v2/state/00544')
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .expect('Content-Type', /application\/json/, done)
      .expect(200)
      .end(function (err, res) {
        if(err){
          return done(err);
        }
        res.body.data.state.should.be.equal('NY');
        done();
      });
  });
  it.skip('it has 200  on /api/v2/add-contact', function (done) {
    supertest(app)
      .post('/api/v2/add-contact')
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .send({
        FirstName: 'test_FirstName',
        LastName: 'test_LastName',
        Email: 'test@email.com',
        Phone: '222-222-4444'
      })
      .expect(200, done);
  });
  it.skip('it has 200  on /api/v2/update-contact', function (done) {
    supertest(app)
      .post('/api/v2/update-contact')
      .expect('set-cookie', /PHPSESSID/)
      .expect('set-cookie', /XSRF-TOKEN/)
      .send({
        firstName: 'test_FirstName_updated',
        lastName: 'test_LastName_updated',
        emailAddress: 'test@email.com',
        phoneNumber: '111-222-3333'
      })
      .expect(200, done);
  });
});