const express = require('express');

const {getAllUsers, getById, updateUser, getAllUsersInClass} = require('../controllers/user');
const {isSignedIn} = require('../controllers/auth');

const router = express.Router();

router.get('/get_all', getAllUsers);

router.get('/get_by_id/:id', getById);

router.post('/update', updateUser);

router.get('/get_all_in_class/:course_code', getAllUsersInClass)

module.exports = router;
