// Importing required modules
const express = require('express');

// Importing custom functions from controllers
const {signup, signin, signout, isSignedIn} = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.get('/signout', isSignedIn, signout);

router.get('/protected', (req, res) => {
    res.send('Route is protected');
});

module.exports = router;
