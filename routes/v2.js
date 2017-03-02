import mailCtrl from './controllers/mail';
import smsCtrl from './controllers/sms';
import leadoutpostCtrl from './controllers/leadoutpost';
import konnektiveCtrl from './controllers/konnektive';
import resError from './middlewares/res_error';
import resSuccess from './middlewares/res_success';

function route(router) {
  router.use(resError);
  router.use(resSuccess);

  router.get('/get-lead/:id', konnektiveCtrl.getLead);
  router.post('/create-lead', konnektiveCtrl.createKonnektiveLead);
  router.post('/create-order', konnektiveCtrl.addKonnektiveOrder);
  router.post('/upsell', konnektiveCtrl.upsell);
  router.get('/get-trans/:id', konnektiveCtrl.getTrans);

  // router.post('/text/:contactId', smsCtrl.sendSMS);
  // router.get('/text/:contactId', smsCtrl.sendSMS);
  // router.get('/text2', smsCtrl.sendSMS2);
  // router.post('/text2', smsCtrl.sendSMS2);

  // router.get('/verify-phone/:phone', mailCtrl.verifyPhoneNumber);

  // router.get('/aphq', mailCtrl.triggerJourney);
  // router.post('/aphq', mailCtrl.triggerJourney);
  
  router.get('/state/:stateNumber', mailCtrl.getStateInfo);
  // router.get('/ipinfo', mailCtrl.getIpinfo);
  router.get('/ping' , function (req,res) {
    res.send('pong');
  });
  
  router.post('/add-contact', leadoutpostCtrl.addContact);
  router.post('/update-contact', leadoutpostCtrl.updateContact);
  //router.post('/add-leadoutpost', leadoutpostCtrl.addLeadoutpost);

  //router.get('/run-migrator', leadoutpostCtrl.migrate);
};

var routes = {v2 : route};

export {routes};
