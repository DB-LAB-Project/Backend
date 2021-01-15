const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');


const User = function(user) {
    this._id = uuidv4();
    this.name = user.name;
    this.usn = user.usn;
    this.phone = user.phone;
    this.email = user.email;
    this.password = crypto.createHmac('sha256', this._id)
                        .update(user.password)
                        .digest('hex');
    this.role = Number.parseInt(user.role);
    this.guardian_phone = user.guardian_phone;

}

User.save = function(newUser, result) {
    const sql_query = 'INSERT INTO USERS SET ?';
    db.query(sql_query, newUser, (err, res) => {
        if(err) {
            console.error(err);
            result(err, null);
            return;
        }
        console.log('User Created: ', {...newUser});
        result(null, {_id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role});
    });
}

User.authenticate = function(email, password, result) {
    const sql_query = 'SELECT * FROM USERS WHERE EMAIL=?';
    db.query(sql_query, email, (err, res) => {
        if(err) {
            console.error(err);
            result(err, null);
            return
        }
        else if(res.length === 0) {
            const error = {
                error: "Email does not exist in the database"
            };
            result(error, null);
            console.log(error);
            return;
        }
        else {
            const key = res[0]._id;
            const encry_password = crypto.createHmac('sha256', key)
                                    .update(password)
                                    .digest('hex');
            if(encry_password === res[0].Password) {
                console.log(res[0]);
                User.sign_in(email, (err, res1) => {
                    if(err) {
                        console.log(err);
                    }
                });
                result(null, res[0]);
            }
            else {
                const error = {
                    error: "Email or password do not match",
                };
                result(error, null);
                return;
            }
        }
    });
}

User.getAll = function(result) {
    const sql_query = 'SELECT * FROM USERS';
    db.query(sql_query, (err, res) => {
        if(err) {
            result(err.message, null);
        }
        result(null, res);
    });
}

User.getById = function(id, result) {
    const sql_query = 'SELECT * FROM USERS WHERE _id=?';
    db.query(sql_query, id, (err, res) => {
        if(err) {
            result(err,null);
            return;
        }
        result(null, res);
    });
}

User.getByEmail = (email, result) => {
    const sql_query = `SELECT * FROM USERS WHERE EMAIL='${email}'`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    })
}

User.update = function(user, result) {
    const {_id, name, usn, email, phone, role} = user;
    const sql_query = 'UPDATE USERS SET Name=?,USN=?,Phone=?,Email=?,Role=? WHERE _id=?';
    db.query(sql_query, [name,usn,phone,email,role,_id], (err, res) => {
        if(err) {
            console.log(err);
            return result(err,null);
        }
        return result(null, {_id, name, usn, email, phone, role});
    })
}

User.delete = (_id, result) => {
    const sql_query = 'DELETE FROM USERS WHERE _id=?';
    db.query(sql_query, _id, (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    });
}

User.getAllUsersInClass = (courseCode, result) => {
    const sql_query = `SELECT _id,name,usn,phone,email,role FROM USERS WHERE _id IN (SELECT user_id FROM ENROLLED_IN WHERE course_code='${courseCode}')`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    })
}

User.sign_in = (email, result) => {
    const sql_query = `UPDATE USERS SET last_login=NOW() WHERE Email='${email}'`;
    db.query(sql_query, [], (err => console.log(err)));
}

User.signout = (_id, result) => {
    const sql_query = `UPDATE USERS SET last_logout=NOW() WHERE _id='${_id}'`;
    db.query(sql_query, [], (err) => console.log(err));
}

module.exports = User;
