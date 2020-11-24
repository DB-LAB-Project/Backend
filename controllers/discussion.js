const Chat = require('../models/chat');

exports.sendChat = (req, res) => {
    const chat = new Chat({
        message: req.body.message,
        sent_by: req.body._id,
        group_code: req.params.course_code,
    });

    Chat.save(chat, (err, result) => {
        if(err) {
            return res.json(err);
        }
        return res.json(result);
    })
}
