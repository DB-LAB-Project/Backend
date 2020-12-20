const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Classroom = function(newClass) {
    this._id = uuidv4();
    this.subject = newClass.subject;
    this.course_code = newClass.course_code;
}

Classroom.save = (newClass, result) => {
    const sql_query = 'INSERT INTO CLASS SET ?';
    db.query(sql_query, newClass, (err, res) => {
        if(err) {
            return result(err, null);
        }
        console.log('User Created: ', {...newClass});
        return result(null, {_id: newClass._id, subject: newClass.subject, course_code: newClass.course_code});
    })
}

Classroom.getByCode = (code, result) => {
    const sql_query = 'SELECT * FROM CLASS WHERE COURSE_CODE=?';
    db.query(sql_query, code, (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    })
}

Classroom.getById = (_id, result) => {
    const sql_query = 'SELECT * FROM CLASS WHERE _id=?';
    db.query(sql_query, _id, (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    })
}

Classroom.getAllClassByUserId = (userId, result) => {
    const sql_query = 'SELECT * FROM CLASS WHERE course_code IN (SELECT course_code FROM ENROLLED_IN WHERE user_id=?)';
    db.query(sql_query, userId, (err, res) => {
        if(err) {
            return result(err,null);
        }
        return result(null,res);
    });
}

Classroom.enroll = (userId, courseCode, result) => {
    const sql_query = `INSERT INTO ENROLLED_IN VALUES ('${userId}', '${courseCode}')`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err,null);
        }
        return result(null, {userId, courseCode});
    })
}

Classroom.leave = (userId, courseCode, result) => {
    const sql_query = `DELETE FROM ENROLLED_IN WHERE user_id='${userId}' and course_code='${courseCode}'`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err,null);
        }
        return result(null, {message: `Successfully left the class ${courseCode}`});
    })
}

Classroom.facultyUpload = (upload, result) => {
    const faculty_id = upload.faculty_id;
    const class_id = upload.class_id;
    const course_code = upload.course_code;
    const title = upload.title;
    const description = upload.description;
    const file = upload.file;

    const sql_query = file ? `INSERT INTO FACULTY_UPLOADS VALUES ('${faculty_id}', '${class_id}', '${course_code}', NOW(), '${title}', '${description}', '${file.path}')` : `INSERT INTO FACULTY_UPLOADS VALUES ('${faculty_id}', '${class_id}', '${course_code}', NOW(), '${title}', '${description}', NULL)`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            result(err, null);
        }
        return result(null, upload);
    });
}

Classroom.getAllFacultyUploadsInClass = (course_code, result) => {
    const sql_query = `SELECT * FROM faculty_uploads WHERE COURSE_CODE=${course_code}`;
    db.query(sql_query, [], (err, res) => {
       if(err) {
           return result(err, null);
       }
       return result(null, res);
    });
}

module.exports = Classroom;

// f2d6aa60-a9f5-445a-8f09-b1002ac80fda - User Id
// eeb56573-cfc7-4116-9f7b-1121a542d84c - Class Id
// CS5M01 - Course Code
