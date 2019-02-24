const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

module.exports = {
    sign: (payload) => new Promise((resolve, reject) => {
        jwt.sign(payload, secret, (err, token) => {
            if (err) {
                return reject(err);
            }

            resolve(token);
        })
    }),

    verify: (token) => new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, payload) => {
            if (err) {
                return reject(err);
            }

            resolve(payload);
        })
    })
}