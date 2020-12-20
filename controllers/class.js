const Classroom = require('../models/class');


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
