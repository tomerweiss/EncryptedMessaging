const openssl = require('openssl-nodejs');
const uuidv1 = require('uuid/v1');
const SSL = require('./SSL');
class User{
    id = '';
    email = '';
    password = '';
    certificate = '';
    privatekey = '';
    admin = false;

    constructor(email, password, isAdmin){
        this.email = email;
        this.password = password;
        this.admin = isAdmin;
        this.id = uuidv1();
        var pem = SSL.generateNewCertificate();
        this.certificate = pem[0].replace('\r\n','');
        this.privatekey = pem[1];
    }
}

module.exports = User;