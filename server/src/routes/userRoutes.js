const express = require('express');
const Cache = require('../models/Cache');
const User = require('../models/User');
const Message = require('../models/Message');
const AuthService = require('../models/AuthService');
const SSL = require('../models/SSL');

const router = express.Router();

const split = function (req, res, next) {
    const { authorization } = req.headers;
    const data = AuthService.decode(authorization)
    var [email, password, tenantid] = data.split(':');

    tenantid === '!'
    ? tenantid = findTenantIdByEmail(email)
    : tenantid = tenantid
    req.logged = {
        email,
        password,
        tenantid
    }

    next();
}


const authorized = function (req, res, next) {
    const { email, password, tenantid } = req.logged;
    if (!Cache.isValid(email, password, tenantid)) {
        return res.status(401).send('Not authorized');
    }
    next();
};

const findTenantIdByEmail = function(email){
    return Cache.getTenantIdByEmail(email);
}

const admin = function (req, res, next) {
    const { email, tenantid } = req.logged;
    if (!Cache.isAdmin(email, tenantid)){
        return res.status(401).send('Not admin');
    }
    next();
};

// Create new user in an existing tenant
router.post(`/v1/:tenantid/users`, split, authorized, admin,  async (req, res) => {
    const { email, password } = req.body;
    const tenantid = req.params.tenantid;
    const user = new User(email, password, false);
    Cache.insertNewUser(user, tenantid)
    ? res.send({id: user.id, UserPem: user.certificate })
    : res.status(400).send('User already exist')
})

// List all users in a tenant
// SHOULD RETURN IDS and Certificates for normal users and private key to admins
router.get(`/v1/:tenantid/users`, split, authorized, async (req, res) => {
    const { email, tenantid } = req.logged;
    const isAdmin = Cache.isAdmin(email, tenantid);
    const users = Cache.getUsersByTenant(tenantid);
    const usersNew = users.map(function(u){
        if (isAdmin) {
            return {id: u.id, certificate: u.certificate, privateKey: u.privatekey, tenantid};
        } else {
            return {id: u.id, certificate: u.certificate, privateKey: 'SECRET', tenantid};
        }
    })
    res.send(usersNew);
})

// List all messages of a user
router.get(`/v1/:tenantid/users/me/messages`, split, authorized, async (req, res) => {
    const { email, tenantid } = req.logged;
    const user = Cache.getMyself(email, tenantid);
    const messages = Cache.getMessages(user.id);
    res.send(messages);
})

// Get myself
// Returns certificate with private key
router.get(`/v1/:tenantid/users/me`, split, authorized, async (req, res) => {
    const { email, tenantid } = req.logged;
    var userMe = Cache.getMyself(email, tenantid)
    res.send({User: userMe});
})

// Deletes a user in a tenant
router.delete(`/v1/:tenantid/users/:userid`, split, authorized, admin, async (req, res) => {
    var userid = req.params.userid;
    var tenantid = req.params.tenantid;
    Cache.deleteUser(userid, tenantid);
    res.send();
})

// Encrypt a msg for a user
router.post(`/v1/:tenantid/users/:userid/encrypt`, split, authorized, async (req, res) => {

    const {message} = req.body;
    var tenantid = req.params.tenantid;
    const { email } = req.logged;
    const senderid = Cache.getMyself(email, tenantid).id;
    var receiverid = req.params.userid;
    const key = Cache.getPublicKeyOfUser(receiverid, tenantid);
    encMsg = SSL.encryptMsg(key, message)
    const newMessage = new Message(senderid, encMsg);
    Cache.insertNewMessage(receiverid, newMessage);
    res.send(encMsg);
})

// Decrypt a msg for a me
router.post(`/v1/:tenantid/users/me/decrypt`, split, authorized, async (req, res) => {
    const {msg} = req.body;
    const { email, tenantid } = req.logged;
    var userMe = Cache.getMyself(email, tenantid)
    const key = Cache.getPrivateKeyOfUser(userMe.id, tenantid);
    decMsg = SSL.decryptMsg(key, msg);
    res.send(decMsg);
})

module.exports = router;