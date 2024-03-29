const Assignment = require('../models/assignment');
const Notification = require('../models/notification');
const User = require('../models/user');

const client = require('../config/smsSender');
const wClient = require('../config/whatsappSender');

const {mailTransporter} = require('../config/mailer');

exports.postAssignment = (req, res) => {
    const assignment = new Assignment({
        title : req.body.title,
        description: req.body.description,
        course_code: req.body.course_code,
        marks: req.body.marks,
        due_date: req.body.due_date,
        file: req.file.path
    });
    Assignment.save(assignment, (err, result) => {
        if(err) {
            return res.json(err);
        }
        Notification.getUserEmails(assignment.course_code, (err, result) => {
            if(err) {
                return res.json(err);
            }
            const emailList = result.map(resu => resu.EMAIL);
            const subject = `${assignment.course_code}: New Assignment assigned! ${assignment.title}`;
            const mailDetails = {
                from: 'lms554896@gmail.com',
                to: emailList,
                subject: subject,
                text: assignment.description
            };
            mailTransporter.sendMail(mailDetails, (err) => {
                if(err) {
                    console.log(err);
                }
                console.log("Email sent successfully");
            });

        });
        Notification.getUserNumbers(assignment.course_code, (err, result) => {
            if(err) {
                console.log(err);
            }
            const resNumber = result.map(resu => resu.phone);
            const toBinding = resNumber.map(number => {
                    return JSON.stringify({binding_type: "sms", address: `+91${number}`});
                })
            const notificationOpts = {
                toBinding: toBinding,
                body: `${assignment.course_code}: New assignment assigned! ${assignment.title}`
            }
            client.notify
                .services('ISbed373fa9888ddf37e4bcbeb309a81af')
                .notifications.create(notificationOpts)
                .then(notification => console.log(notification.sid))
                .catch(error => console.log(error));

            console.log(toBinding);
            const wResNumber = resNumber.map(number => `whatsapp:+91${number}`);
            client.messages.create({
                from: 'whatsapp:+14155238886',
                to: wResNumber,
                body: `${assignment.course_code}: New assignment assigned! ${assignment.title}`
            }).then(message => console.log(message.sid)).catch(err => console.log(err));
        });
        Notification.getParentsNumber(assignment.course_code, (err, result3) => {
            if(err) {
                console.log(err);
            }
            let resNumber = result3.map(resu => {
                return resu.guardian_phone;
            });

            resNumber = resNumber.filter(num => num !== null);
            console.log(resNumber);
            const toBinding = resNumber.map(number => {
                return JSON.stringify({binding_type: "sms", address: `+91${number}`});
            })
            const notificationOpts = {
                toBinding: toBinding,
                body: `${assignment.course_code}: New assignment assigned! ${assignment.title}`
            }
            client.notify
                .services('ISbed373fa9888ddf37e4bcbeb309a81af')
                .notifications.create(notificationOpts)
                .then(notification => console.log(notification.sid))
                .catch(error => console.log(error));

            console.log(toBinding);
        })
        return res.json(result);
    });
}

exports.getMyAssignments = (req, res) => {
    const course_code = req.params.course_code;
    Assignment.getAllInClass(course_code, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    });
}

exports.scoreAssignments = (req, res) => {
    const user_id = req.body.user_id;
    const assignment_id = req.body.assignment_id;
    const marks = req.body.marks;
    console.log(user_id, assignment_id, marks);
    Assignment.getById(assignment_id, (err, result3) => {
        if(err) {
            return res.json(err);
        }
        Assignment.score(marks, user_id, assignment_id, (err, result) => {
            if(err) {
                res.json(err);
            }
            Assignment.getSubmissionsOfAssignment(assignment_id, (err, result1) => {
                if(err) {
                    res.json(err);
                }
                User.getById(user_id, (err, result2) => {
                    if(err) {
                        return res.json(err);
                    }
                    const emailList = result2[0].Email;
                    const subject = `${result3[0].course_code}: Assignment Scored! ${result3[0].title}`;
                    const mailDetails = {
                        from: 'lms554896@gmail.com',
                        to: emailList,
                        subject: subject,
                        text: `Your submission to the assignment ${result3[0].title} has been scored. You have been awarded ${marks}/${result3[0].marks}`
                    };
                    mailTransporter.sendMail(mailDetails, (err) => {
                        if(err) {
                            console.log(err);
                        }
                        console.log("Email sent successfully");
                    });

                        const resNumber = [result2[0].Phone, result2[0].guardian_phone];
                        const toBinding = resNumber.map(number => JSON.stringify({binding_type: "sms", address: `+91${number}`}));
                        const notificationOpts = {
                            toBinding: toBinding,
                            body: `${result3[0].course_code}: Assignment Scored! ${result3[0].title}`
                        }
                        client.notify
                            .services('ISbed373fa9888ddf37e4bcbeb309a81af')
                            .notifications.create(notificationOpts)
                            .then(notification => console.log(notification.sid))
                            .catch(error => console.log(error));
                    const wResNumber = resNumber.map(number => `whatsapp:+91${number}`);
                    client.messages.create({
                        from: 'whatsapp:+14155238886',
                        to: wResNumber,
                        body: `${result3[0].course_code}: Assignment Scored! ${result3[0].title}`
                    }).then(message => console.log(message.sid)).catch(err => console.log(err));
                        console.log(toBinding);
                });

                return res.json(result1);
            });
        });
    })
}

exports.submitAssignment = (req, res) => {
    // console.log(req.file.path);
    const upload = {
        user_id: req.body.user_id,
        assignment_id: req.body.assignment_id,
        file: req.file.path
    }
    console.log(upload);
    Assignment.submit(upload, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    });
}

exports.getAssignmentSubmissions = (req, res) => {
    const _id = req.params._id;
    Assignment.getSubmissionsOfAssignment(_id, (err, result) => {
        if(err) {
            return res.json(err);
        }
        console.log(result);
        return res.json(result);
    });
}

exports.getAllUserSubmissionsInClass = (req, res) => {
    const _id = req.params._id;
    const course_code = req.params.course_code;
    Assignment.getAllSubmissionsOfUserInClass(_id, course_code, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    });
}

exports.getUnsubmittedAssignmentsCount = (req, res) => {
    const classList = req.query.array.split(',');
    const user_id = req.query.user_id;
    let final_count = [];
    console.log(classList);
    classList.map((class_id, idx) => {
        Assignment.countUnSubmittedInClass(user_id, class_id, (err, result) => {
            if(err) {
                // return res.json(err);
            }
            final_count.push(result);
            console.log(final_count);
            if(idx === classList.length - 1) {
                return res.json(final_count);
            }
        });
    });
    // return res.json(final_count);
}

exports.deleteAssignment = (req, res) => {
    const _id = req.params._id;
    Assignment.deleteAssignment(_id, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    })
}

const test = (assignment) => {

}

