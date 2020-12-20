const express = require('express');

const {generalFacultyUpload} = require('../config/fileUpload');

const {createClass, enroll, getClassByCode, getClassById, getClassesOfUser, leaveClass, postIntoClass, getFacultyUploads} = require('../controllers/class');

const router = express.Router();

router.post('/create', createClass);

router.post('/enroll', enroll)

router.get('/get_by_code/:code', getClassByCode);

router.get('/get-by-id/:_id', getClassById);

router.post('/post', generalFacultyUpload.single('attachment'), postIntoClass);

router.get('/get-my-classes/:user_id', getClassesOfUser);

router.get('/get-faculty-uploads/:course_code', getFacultyUploads);

router.delete('/leave-class', leaveClass)

module.exports = router;
