
class AuthService {
    decode(data) {
        let buff = Buffer.from(data, 'base64');
        let text = buff.toString('ascii');
        return text;
    }

    encode(data){
        let buff = Buffer.from(data)
        let text = buff.toString('base64');
        return text;
    }
}

module.exports = new AuthService();