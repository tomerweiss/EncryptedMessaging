const express = require('express');
const Cache = require('../models/Cache');
const User = require('../models/User');
const AuthService = require('../models/AuthService');

const router = express.Router();

router.post('/v1/register', async (req, res) => {
    const { email, password } = req.body;
    const user = new User(email, password, true);
    const newTenant = Cache.insertNewTenant(user)
    text = `${email}:${password}:${newTenant}`;
    token = AuthService.encode(text);
    res.send({ token });
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password' })
    }

    const { tenantid, user } = await Cache.findOne({ email }) // find the user

    if (!user) {
        return res.status(422).send({ error: 'Invalid password or email' })
    }

    try {
        if (user.password === password) {
            text = `${email}:${password}:${tenantid}`;
            token = AuthService.encode(text);
            res.send({ token });
        }
        else {
            return res.status(422).send({ error: 'Invalid password or email' })
        }
    }
    catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' })
    }
})

module.exports = router;