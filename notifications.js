'use strict';

const Appointment = require('./app/models/appointment');

const notificationSender = function() {
  return {
    run: function() {
      Appointment.sendNotifications();
    },
  };
};

module.exports = notificationSender();