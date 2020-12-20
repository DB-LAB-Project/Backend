const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Assignment = function(assignment) {
    this._id = uuidv4();
    this.title = assignment.title;
    this.description = assignment.description;
    this.course_code = assignment.course_code;
    this.marks = assignment.marks;
    this.due_date = assignment.due_date;
}

Assignment.save = (newAssign, result) => {
    const sql_query = 'INSERT INTO ASSIGNMENTS SET ?';
    db.query(sql_query, newAssign, (err, res) => {
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
    const sql_query = `SELECT * FROM ASSIGNMENTS WHERE course_code='${course_code}'`;
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
    const sql_query = file ? `INSERT INTO SUBMISSIONS VALUES('${user_id}', '${assignment_id}', '${file}', NOW(), null)` : `INSERT INTO SUBMISSIONS VALUES('${user_id}', '${assignment_id}', NULL, NOW(), NULL)`;
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
    const sql_query = `SELECT _id,usn,name,date_format(submitted_on, '%d-%m-%Y') as submitted_on,TIME(SUBMITTED_ON) as time,marks FROM USERS,SUBMISSIONS WHERE USERS._id IN (SELECT USER_ID FROM SUBMISSIONS WHERE ASSIGNMENT_ID='${assignment_id}') AND USERS._id=SUBMISSIONS.user_id`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    });

}

module.exports = Assignment;
