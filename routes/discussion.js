const express = require('express');

const {sendChat} = require('../controllers/discussion');

const router = express.Router();

router.post('/post/:course_code', sendChat);

module.exports = router;
