const uuidv1 = require('uuid/v1');

class Message{
    id = ''
    senderid = '';
    encMsg = '';
    decMsg = '';

    constructor(senderid, encMsg){
        this.id = uuidv1();
        this.senderid = senderid;
        this.encMsg = encMsg;
        this.decMsg = '';
    }
}

module.exports = Message;