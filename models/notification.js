const db = require('../config/database');

const Notification = function(notification) {
    this.course_code = notification.course_code;
    this.title = notification.title;
    this.description = notification.description;
}

Notification.getUserEmails = (course_code, result) => {
    const sql_query = `SELECT EMAIL FROM USERS WHERE _id IN (SELECT user_id FROM enrolled_in WHERE course_code='${course_code}')`;
    db.query(sql_query, [], (err, res) => {
        if(err) {
            return result(err, null);
        }
        return result(null, res);
    })
}

// Notification.getClassNotifications = () => {
//
// }

module.exports = Notification;
