'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const cfg = require('../../config/twilio');
const Twilio = require('twilio');

const AppointmentSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  username: String,
  notification: Number,
  timeZone: String,
  time: {type: Date, index: true},
  type: String,
  amount: String,
  medName: String,
  action: String,
  reply:  { type:  Boolean, default: false }
});

AppointmentSchema.methods.requiresNotification = function(date) {
    let difference = (Math.round(moment.duration(moment(this.time).tz(this.timeZone).utc()
                          .diff(moment(date).utc())
                        ).asMinutes()));

    if (difference - this.notification == -5 && !this.reply && difference > 0){
        this.notification = this.notification - 5;
        this.save().then(function() {
            console.log('resending a notification');
        });
    }
  
    return Math.round(moment.duration(moment(this.time).tz(this.timeZone).utc()
                          .diff(moment(date).utc())
                        ).asMinutes()) === this.notification;
};

AppointmentSchema.statics.sendNotifications = function(callback) {
  // now
 
  const searchDate = new Date();
  Appointment
    .find()
    .then(function(appointments) {
      appointments = appointments.filter(function(appointment) {
                console.log(searchDate);
              return appointment.requiresNotification(searchDate);
              //return true;
      });
      if (appointments.length > 0) {
        
        sendNotifications(appointments);
      }
    });

    /**
    * Send messages to all appoinment owners via Twilio
    * @param {array} appointments List of appointments.
    */
    function sendNotifications(appointments) {
        const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
        appointments.forEach(function(appointment) {
            // Create options to send the message
            const options = {
                to: `+ ${appointment.phoneNumber}`,
                from: cfg.twilioPhoneNumber,
                /* eslint-disable max-len */
                // body: `Hi ${appointment.name}. Just a reminder that you have an appointment coming up.`,
                body: `Good morning ${appointment.name}. Hope you had a great sleep! You need to take ${appointment.amount} of ${appointment.medName}. Please reply with the corresponding number before to confirm: (1) I have taken my medication (2) I am not taking it yet, please send another alert (3) I am not taking my medication`,
                /* eslint-enable max-len */
            };
            // Send the message!
            client.messages.create(options, function(err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    let masked = appointment.phoneNumber.substr(0,
                        appointment.phoneNumber.length - 5);
                    masked += '*****';
                    console.log(`Message sent to ${masked}`);
                }
            }).then((message) => console.log(message));
        });

        // Don't wait on success/failure, just indicate all messages have been
        // queued for delivery
        if (callback) {
          callback.call();
        }
    }
};


const Appointment = mongoose.model('appointment', AppointmentSchema);
module.exports = Appointment;