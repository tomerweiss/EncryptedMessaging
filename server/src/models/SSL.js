const openssl = require('openssl-nodejs');
const forge = require('node-forge');
const crypto = require('crypto');
const pki = forge.pki;

class SSL{
    public = '';
    private = '';
    

    generateNewCertificate(){
        
        var keys = pki.rsa.generateKeyPair(2048);
        var cert = pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.validity.notBefore = new Date(1995, 10, 10)
        cert.validity.notAfter = new Date(2030, 10, 10);
        cert.sign(keys.privateKey);

        var pem = [pki.certificateToPem(cert), keys.privateKey];
        return pem;
    }

    getPublicKey(pem){
        const cert = pki.certificateFromPem(pem);
        return cert.publicKey;  
    }

    encryptMsg(key, msg){
        return key.encrypt(msg);
    }

    decryptMsg(key, msg){
        return key.decrypt(msg);
    }
    
}

module.exports = new SSL();