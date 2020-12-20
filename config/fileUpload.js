const multer = require('multer');

const generalFacultyStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'faculty_uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const assignmentQuestionStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'assignment/questions');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const submissionStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'assignment/submissions');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

exports.generalFacultyUpload = multer({storage: generalFacultyStorage});
exports.facultyAssignmentUpload = multer({storage: assignmentQuestionStorage});
exports.submissionsUpload = multer({storage: submissionStorage});

