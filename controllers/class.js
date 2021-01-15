const Classroom = require('../models/class');
const Notification = require('../models/notification')

const {mailTransporter} = require('../config/mailer');
const client = require('../config/smsSender');


exports.createClass = (req,res) => {
    const newClass = new Classroom({
            subject: req.body.subject,
            course_code: req.body.course_code,
    });
    Classroom.save(newClass, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    });
}

exports.enroll = (req, res) => {
    const {_id, course_code} = req.body;
    Classroom.enroll(_id, course_code, (err, result) => {
        if(err) {
            return res.json(err);
        }
        Classroom.getAllClassByUserId(_id, (err, result1) => {
            if(err) {
                return res.json(err);
            }
            return res.json(result1);
        })
    })
}

exports.getClassByCode = (req,res) => {
    const course_code = req.params.code;
    Classroom.getByCode(course_code, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    })
}

exports.getClassById = (req,res) => {
    const _id = req.params._id;
    Classroom.getById(_id, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    });
}

exports.getClassesOfUser = (req, res) => {
    const user_id = req.params.user_id;
    Classroom.getAllClassByUserId(user_id, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    })
}

exports.leaveClass = (req, res) => {
    const {_id, course_code} = req.body;
    Classroom.leave(_id, course_code, (err, result) => {
        if(err) {
            return res.json(err);
        }
        Classroom.getAllClassByUserId(_id, (err, result1) => {
            if(err) {
                return res.json(err);
            }
            return res.json(result1);
        })
    })
}

exports.postIntoClass = (req, res) => {
    const upload = {
        faculty_id: req.body.faculty_id,
        class_id: req.body.class_id,
        course_code: req.body.course_code,
        title: req.body.title,
        description: req.body.description,
        file: req.file ? req.file : null
    }
    console.log(req.file);
    Classroom.facultyUpload(upload, (err, result) => {
        if(err) {
            return res.json(err);
        }
        Notification.getUserEmails(upload.course_code, (err, result) => {
            if(err) {
                return res.json(err);
            }
            console.log(result);
            const emailList = result.map(resu => resu.EMAIL);
            const subject = `${upload.course_code}: New Material Posted! ${upload.title}`;
            const mailDetails = {
                from: 'lms554896@gmail.com',
                to: emailList,
                subject: subject,
                text: upload.description
            };
            mailTransporter.sendMail(mailDetails, (err) => {
                if(err) {
                    console.log(err);
                }
                console.log("Email sent successfully");
            });

        });
        Notification.getUserNumbers(upload.course_code, (err, result) => {
            if(err) {
                console.log(err);
            }
            const resNumber = result.map(resu => resu.phone);
            const toBinding = resNumber.map(number => {
                return JSON.stringify({binding_type: "sms", address: `+91${number}`});
            })
            const notificationOpts = {
                toBinding: toBinding,
                body: `${upload.course_code}: New Material Posted! ${upload.title}`
            }
            client.notify
                .services('ISbed373fa9888ddf37e4bcbeb309a81af')
                .notifications.create(notificationOpts)
                .then(notification => console.log(notification.sid))
                .catch(error => console.log(error));
            const wResNumber = resNumber.map(num => `whatsapp:+91${num}`);
            client.messages.create({
                from: 'whatsapp:+14155238886',
                to: wResNumber,
                body: `${upload.course_code}: New Material Posted! ${upload.title}`
            }).then(message => console.log(message.sid)).catch(err => console.log(err));

            console.log(toBinding);
        });
        return res.json(upload);
    });

}

exports.getFacultyUploads = (req, res) => {
    const course_code = req.params.course_code;
    Classroom.getAllFacultyUploadsInClass(course_code, (err, result) => {
       if(err) {
           return res.json(err);
       }
       return res.json(result);
    });
}

exports.deleteClass = (req, res) => {
    const course_code = req.params.course_code;
    Classroom.deleteClass(course_code, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    });
}

exports.editFacultyPost = (req, res) => {
    const upload = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        file: req.file ? req.file.path : (req.body.file === 'null' ? null : req.body.file)
    }
    console.log(upload);
    Classroom.facultyUploadEdit(upload, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    });

}

exports.deletePost = (req, res) => {
    const _id = req.params._id;
    Classroom.deletePost(_id, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    })
}

exports.getUnreadNotifications = (req, res) => {
    const classList = req.query.array.split(',');
    const user_id = req.query.user_id;
    const final_count = [];
    classList.map((class_id, idx) => {
        Classroom.getUnreadNotifications(user_id, class_id, (err, result) => {
            if(err) {
                return res.json(err);
            }
            final_count.push(result);
            if(idx === classList.length - 1) {
                return res.json(final_count);
            }
        })
    });
}
