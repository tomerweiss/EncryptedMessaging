
module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    // authorization = 'Bearer serghsdhsefsdf'

    if (!authorization) {
        return res.status(401).send({error: 'You must be logged in.'})
    }
}