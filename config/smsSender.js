// sid-ISbed373fa9888ddf37e4bcbeb309a81af
const accountSid = 'AC7fb10e209f14635e5b7a167819952f92';
const authToken = 'dc4670cc2ed05b4fdd5a38672d79b4d8';

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

// client.messages.create({
//     body: 'Hello From Node',
//     to: '+919902510073',
//     from: '+12093406727'
// }).then(message => console.log(message.sid));

// const notificationOpts = {
//     toBinding: JSON.stringify({
//         binding_type: 'sms',
//         address: '+919902510073',
//     }),
//     body: 'New Assignment Assigned',
// };

const sendSMS = (notificationOpts) => {
    client.notify
        .services('ISbed373fa9888ddf37e4bcbeb309a81af')
        .notifications.create(notificationOpts)
        .then(notification => console.log(notification.sid))
        .catch(error => console.log(error));
}


