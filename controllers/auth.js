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

    User.getByEmail(user.email, (err, result) => {
        if(err) {
            return res.json(err);
        }
        if(result.length !== 0) {
            return res.json({
                error: "Email Already exists!! Use another email"
            });
        }
    })

    User.save(user, (err, data) => {
        if(err) return res.json({error: err});
        res.json(data);
    })

}

exports.signin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.authenticate(email, password, (error, data) => {
        if(error) {
            res.status(400).json({error});
            return;
        }
        const token = jwt.sign({_id: data._id}, 'abcd');

        res.cookie('token', token, {expire: new Date() + 1});

        res.status(200).json({token: token, user: {_id: data._id, name: data.Name, email: data.Email, role: data.Role}});
        return;
    });
}

exports.signout = (req, res) => {
    const _id = req.params._id;
    console.log(_id);
    User.signout(_id, err => console.log(err));
    res.clearCookie();
    res.json({
        message: "Signed out successfully",
    });
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
