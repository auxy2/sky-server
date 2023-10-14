const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Function to send the SMS
exports.sendSMS = message => {
  client.messages
    .create({
      body: message,
      from: twilioPhoneNumber,
      to: '+234'+message.phoneNumber
    })
    .then(message => console.log('SMS sent successfully:', message.sid))
    .catch(error => console.error('Error sending SMS:', error));
}





