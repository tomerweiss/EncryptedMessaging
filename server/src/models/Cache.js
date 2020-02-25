const SSL = require('./SSL');
class Cache {


    constructor() {
        this.cache = {};
        this.tenantid = 0;
        this.messages = {};
    }



    getMessages(userid){
        return this.messages[userid] || [];
    }

    isValid(user, password, tenantid) {
        if (this.cache[tenantid]) {
            const valid = this.cache[tenantid].some(function (name) {
                return name.email === user && name.password === password;
            })
            return valid;
        }
        return false;
    }

    isAdmin(email, tenantid){
        var user = this.cache[tenantid].filter(function (user) {
            return user.email === email;
        })
        return user[0].admin || 0;
    }

    insertNewTenant(user) {
        const t = this.tenantid;
        this.cache[t] = this.cache[t] || []; // if exists or empty
        this.cache[t].push(user);
        this.tenantid++;
        return t;
    }

    insertNewUser(user, tenantid) {
        var exist = this.cache[tenantid].filter(function (u) {
            return u.email === user.email;
        })
        if (!exist[0]){
            this.cache[tenantid].push(user);
            return true;
        }
        return false;
    }

    insertNewMessage(receiverid, message){
        this.messages[receiverid] = this.messages[receiverid] || []; // if exists or empty
        this.messages[receiverid].push(message);
    }

    getUsersByTenant(id) {
        return this.cache[id];
    }
    getTenantIdByEmail(email) {
        const length =  Object.keys(this.cache).length;
        var tenantid;
        for (var i = 0; i < length; i++){
            var found = this.cache[i].find(function (u){
                return u.email ===email
            })
            found
            ? tenantid = i
            : tenantid = null
        }
        return tenantid;
    }

    getMyself(email, tenantid) {
        var user = this.cache[tenantid].filter(function (u) {
            return u.email === email;
        })
        return user[0];
    }

    getPublicKeyOfUser(userid, tenantid){
        var user =  this.cache[tenantid].filter(function(u){
            return u.id === userid;
        })

        const pem = user[0].certificate;
        return SSL.getPublicKey(pem);
    }

    getPrivateKeyOfUser(userid, tenantid){
        var user =  this.cache[tenantid].filter(function(u){
            return u.id === userid;
        })

        return user[0].privatekey;
    }

    deleteUser(userToDel, tenantid) {
        var newUserArr = this.cache[tenantid].filter(function (user) {
            return user.id != userToDel;
        })
        this.cache[tenantid] = newUserArr;
    }
}

module.exports = new Cache();