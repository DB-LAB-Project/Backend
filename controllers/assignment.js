const Assignment = require('../models/assignment');
const Notification = require('../models/notification');

const {mailTransporter} = require('../config/mailer');

exports.postAssignment = (req, res) => {
    const assignment = new Assignment({
        title : req.body.title,
        description: req.body.description,
        course_code: req.body.course_code,
        marks: req.body.marks,
        due_date: req.body.due_date
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
    Assignment.score(marks, user_id, assignment_id, (err, result) => {
       if(err) {
           res.json(err);
       }
       Assignment.getSubmissionsOfAssignment(assignment_id, (err, result1) => {
           if(err) {
               res.json(err);
           }
           return res.json(result1);
       });
    });
}

exports.submitAssignment = (req, res) => {
    // console.log(req.file.path);
    const upload = {
        user_id: req.body.user_id,
        assignment_id: req.body.assignment_id,
        file: req.file.path
    }

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

