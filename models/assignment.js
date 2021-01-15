const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Assignment = function(assignment) {
    this._id = uuidv4();
    this.title = assignment.title;
    this.description = assignment.description;
    this.course_code = assignment.course_code;
    this.marks = assignment.marks;
    this.due_date = assignment.due_date;
    this.file = assignment.file;
}

Assignment.save = (newAssign, result) => {
    const sql_query = `INSERT INTO ASSIGNMENTS VALUES ('${newAssign._id}', '${newAssign.title}', '${newAssign.description}', '${newAssign.file}', '${newAssign.course_code}', ${newAssign.marks}, NOW(), '${newAssign.due_date}')`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }

        return result(null, {...newAssign});
    });
}

Assignment.getById = (_id, result) => {
    const sql_query = `SELECT * FROM ASSIGNMENTS WHERE _id='${_id}'`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    });
}

Assignment.getAllInClass = (course_code, result) => {
    const sql_query = `SELECT _id,title,description,file,course_code,marks,date_format(uploaded_at, '%d-%m-%Y') as upload_date, TIME(uploaded_at) as upload_time,date_format(due_date, '%d-%m-%Y') as due_date, TIME(due_date) as due_date_time FROM ASSIGNMENTS WHERE course_code='${course_code}' ORDER BY uploaded_at DESC`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    })
}

Assignment.score = (marks, user_id, assignment_id, result) => {
    const sql_query = `UPDATE SUBMISSIONS SET MARKS=${marks} WHERE USER_ID='${user_id}' AND ASSIGNMENT_ID='${assignment_id}'`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, {user_id, assignment_id, marks});
    })
}

Assignment.submit = (upload, result) => {
    const user_id = upload.user_id;
    const assignment_id = upload.assignment_id;
    const file = upload.file;
    console.log(file);
    const sql_query = file ? `INSERT INTO SUBMISSIONS VALUES('${user_id}', '${assignment_id}', '${file}', NOW(), null, null)` : `INSERT INTO SUBMISSIONS VALUES('${user_id}', '${assignment_id}', NULL, NOW(), NULL, NULL)`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, {
            user_id,
            assignment_id,
            message: "Successfully submitted assignment"
        });
    });
}

Assignment.getSubmissionsOfAssignment = (assignment_id, result) => {
    const sql_query = `SELECT USERS._id,usn,name,date_format(submitted_on, '%d-%m-%Y') as submitted_on,TIME(SUBMITTED_ON) as time, SUBMISSIONS.file, SUBMISSIONS.marks, SUBMISSIONS.submitted_late FROM USERS,SUBMISSIONS WHERE USERS._id IN (SELECT USER_ID FROM SUBMISSIONS WHERE ASSIGNMENT_ID='${assignment_id}') AND USERS._id=SUBMISSIONS.user_id AND SUBMISSIONS.assignment_id='${assignment_id}'`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    });

}

Assignment.getAllSubmissionsOfUserInClass = (_id, course_code, result) => {
    const sql_query = `SELECT user_id, assignment_id, file, date_format(submitted_on, '%d-%m-%Y') as submitted_on, TIME(submitted_on) as time, marks, submitted_late FROM submissions WHERE user_id='${_id}' AND assignment_id IN (SELECT assignments._id FROM ASSIGNMENTS WHERE course_code='${course_code}')`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    });
}

Assignment.countUnSubmittedInClass = (user_id, course_code, result) => {
    const sql_query = `select count(*) - (select count(*) from submissions where assignment_id in (select _id from assignments where course_code='${course_code}') and user_id='${user_id}') as count from assignments where course_code='${course_code}'`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, {course_code, count: res[0]["count"]});
    });
}

Assignment.deleteAssignment = (_id, result) => {
    const sql_query = `DELETE FROM ASSIGNMENTS WHERE _id='${_id}'`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, _id);
    })
}

module.exports = Assignment;
