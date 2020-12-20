const nodemailer = require('nodemailer');

exports.mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lms554896@gmail.com',
        pass: 'lmslmslms'
    }
});

// const mailDetails = {
//     from: 'lms554896@gmail.com',
//     to: ['uzumakinaruto1582@gmail.com', 'lms554896@gmail.com'],
//     subject: 'Test mail',
//     text: 'Node.js testing mail for LMS'
// };
//
// mailTransporter.sendMail(mailDetails, function(err, data) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log('Email sent successfully');
//     }
// });
