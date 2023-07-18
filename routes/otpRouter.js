const express = require('express');
const router = express.Router();

const {sendSMS, verifySMS} = require('../controller/otp/sms');
const {sendEmail, verifyEmail} = require('../controller/otp/mail'); 

router.post('/send-sms', sendSMS);
router.post('/verify-sms', verifySMS);

router.post('/send-email', sendEmail);
router.post('/verify-email', verifyEmail);

module.exports = router;
