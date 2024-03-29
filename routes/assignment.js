const express = require('express');

const {postAssignment, getMyAssignments, getAssignmentSubmissions, scoreAssignments, submitAssignment, getAllUserSubmissionsInClass, getUnsubmittedAssignmentsCount, deleteAssignment} = require('../controllers/assignment');

const {facultyAssignmentUpload, submissionsUpload} = require('../config/fileUpload');

const router = express.Router();

router.post('/post/new', facultyAssignmentUpload.single('questions'), postAssignment);

router.get('/my-assignments/:course_code', getMyAssignments);

router.get('/get-submissions/:_id', getAssignmentSubmissions);

router.put('/evaluate', scoreAssignments);

router.post('/submit', submissionsUpload.single('submission'), submitAssignment);

router.get('/get-all-user-submissions/:course_code/:_id', getAllUserSubmissionsInClass);

router.get('/get-unsubmitted-count', getUnsubmittedAssignmentsCount);

router.delete('/delete/:_id', deleteAssignment);

module.exports = router;
