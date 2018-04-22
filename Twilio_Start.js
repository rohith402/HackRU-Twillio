var accountSid = 'AC7a8c730485635a35f0dbfba4764b2ae9'; // Your Account SID from www.twilio.com/console
var authToken = '3a3425382014bfa510cdc35f356824d2';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+12014234735',  // Text this number
    from: '+12256598763' // From a valid Twilio number
})
.then((message) => console.log(message.sid));