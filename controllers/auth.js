const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
require('dotenv').config();

exports.signup = (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        usn: req.body.USN,
        password: req.body.password,
        phone: req.body.phone,
        role: req.body.role,
    });

    User.save(user, (err, data) => {
        if(err) return res.json(err);
        res.json(data);
    })

}

exports.signin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.authenticate(email, password, (err, data) => {
        if(err) {
            res.status(400).json(err);
            return;
        }
        const token = jwt.sign({_id: data._id}, 'abcd');

        res.cookie('token', token, {expire: new Date() + 1});

        res.status(200).json({token: token, user: {_id: data._id, name: data.Name}});
        return;
    });
}

exports.signout = (req, res) => {
    res.clearCookie();
    res.json({
        message: "Signed out successfully",
    })
}

exports.isSignedIn = expressJwt({
    secret: 'abcd',
    userProperty: 'auth',
    algorithms: ['sha1', 'RS256', 'HS256'],
});

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id === req.auth._id
    if(!checker) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}

exports.isTeacher = (req, res, next) => {
    if(req.profile.role === 1) {
        return res.status(403).json({
            error: "You are not a teacher, Access Denied"
        })
    }
    next();
}
