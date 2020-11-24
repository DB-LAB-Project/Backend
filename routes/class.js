const express = require('express');

const {createClass, enroll, getClassByCode, getClassById, getClassesOfUser, leaveClass} = require('../controllers/class');

const router = express.Router();

router.post('/create', createClass);

router.post('/enroll', enroll)

router.get('/get_by_code/:code', getClassByCode);

router.get('/get-by-id/:_id', getClassById)

router.get('/get-my-classes/:user_id', getClassesOfUser);

router.delete('/leave-class', leaveClass)

module.exports = router;
