const express = require('express');

const {postAssignment, getMyAssignments, getAssignmentSubmissions, scoreAssignments, submitAssignment} = require('../controllers/assignment');

const {facultyAssignmentUpload, submissionsUpload} = require('../config/fileUpload');

const router = express.Router();

router.post('/post/new', facultyAssignmentUpload.single('questions'), postAssignment);

router.get('/my-assignments/:course_code', getMyAssignments);

router.get('/get-submissions/:_id', getAssignmentSubmissions);

router.put('/evaluate', scoreAssignments);

router.post('/submit', submissionsUpload.single('submission'), submitAssignment);

module.exports = router;
