const accountSid = 'AC7fb10e209f14635e5b7a167819952f92';
const authToken = 'dc4670cc2ed05b4fdd5a38672d79b4d8';

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

client.messages.create({
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+919902510073',
    body: 'New Assignment'
}).then(message => console.log(message.sid)).catch(err => console.log(err));
