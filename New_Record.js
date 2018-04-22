const accountSid = 'AC7a8c730485635a35f0dbfba4764b2ae9';
const authToken = '3a3425382014bfa510cdc35f356824d2';

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.calls
  .create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+12014234735',
    from: '+12256598763',
  })
  .then(call => process.stdout.write(call.sid));