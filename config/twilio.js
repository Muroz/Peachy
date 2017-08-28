'use strict';

const cfg = {};

// A random string that will help generate secure one-time passwords and
// HTTP sessions
cfg.secret = process.env.APP_SECRET || 'keyboard cat';

// Your Twilio account SID and auth token, both found at:
// https://www.twilio.com/user/account
//
// A good practice is to store these string values as system environment
// variables, and load them from there as we are doing below. Alternately,
// you could hard code these values here as strings.
cfg.twilioAccountSid = 'AC7e8541693383eb1d3017cb4c1f189b5d';
cfg.twilioAuthToken = 'ce87edae64ab9e52fc2d90889b804d4a';

// A Twilio number you control - choose one from:
// Specify in E.164 format, e.g. "+16519998877"
cfg.twilioPhoneNumber = '+16137030363';



// Export configuration object
module.exports = cfg;