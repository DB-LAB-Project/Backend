const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Chat = function(chat) {
    this._id = uuidv4();
    this.message = chat.message;
    this.sent_by = chat.sent_by;
    this.group_code = chat.group_code;
}

Chat.save = (chat, result) => {
    const sql_query = 'INSERT INTO CHATS SET ?';
    db.query(sql_query, chat, (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, {...chat});
    });
}

Chat.getAllInClass = (course_code, result) => {
    const sql_query = `SELECT MESSAGE FROM CHATS WHERE COURSE_CODE='${course_code}'`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    });
}



module.exports = Chat;
