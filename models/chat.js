const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Chat = function(chat) {
    this._id = uuidv4();
    this.message = chat.message;
    this.sent_by = chat.sent_by;
    this.group_code = chat.group_code;
}

Chat.save = (chat, result) => {
    const sql_query = `INSERT INTO CHATS VALUES ('${chat._id}', '${chat.message}', '${chat.sent_by}', NOW(), '${chat.group_code}')`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, {...chat});
    });
}

Chat.getAllInClass = (course_code, result) => {
    const sql_query = `SELECT * FROM CHATS WHERE GROUP_CODE='${course_code}' ORDER BY SENT_ON`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    });
}

Chat.delete = (_id, result) => {
    const sql_query = `DELETE FROM CHATS WHERE _id='${_id}'`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, {_id});
    });
}



module.exports = Chat;
