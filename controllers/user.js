const db = require('../config/database');
const User = require('../models/user');

exports.getAllUsers = (req, res) => {
    User.getAll((err, data) => {
        res.json(data);
    });
}

exports.getById = (req, res) => {
    const id = req.params.id;
    User.getById(id, (err, data) => {
        if(err) throw err;
        res.json(data);
    });
}

exports.updateUser = (req,res) => {
    const {_id, name, usn, phone, email, role} = req.body;
    const newUser = {_id, name, usn, phone, email, role};
    User.update(newUser, (err, result) => {
        if(err) {
            return res.json({"error": err});
        }
        return res.json({result});
    })

}

exports.getAllUsersInClass = (req, res) => {
    const course_code = req.params.course_code;
    User.getAllUsersInClass(course_code, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    })
}
