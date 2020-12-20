const express = require('express');

const {sendChat, getAllChatsInClass, deleteChat} = require('../controllers/discussion');

const router = express.Router();

router.post('/post/:course_code', sendChat);

router.get('/class/:course_code', getAllChatsInClass);

router.delete('/delete/:_id', deleteChat);

module.exports = router;
