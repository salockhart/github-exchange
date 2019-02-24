const { promisify } = require('util');
const redis = require('redis');
const client = redis.createClient(process.env['REDIS_URL']);

const hget = promisify(client.hget).bind(client);
const hset = promisify(client.hset).bind(client);
const hkeys = promisify(client.hkeys).bind(client);
const hdel = promisify(client.hdel).bind(client);

client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = {
    create: (user_id, client_id, client_secret) => {
        return hget(user_id, client_id)
            .then(exists => {
                if (exists) {
                    throw new Error('client id already exists for user');
                }
            })
            .then(() => hset(user_id, client_id, client_secret))
            .then(() => ({
                user_id,
                client_id
            }));
    },

    getAll: (user_id) => {
        return hkeys(user_id);
    },

    get: (user_id, client_id) => {
        return hget(user_id, client_id);
    },

    update: (user_id, client_id, client_secret) => {
        return hget(user_id, client_id)
            .then(exists => {
                if (!exists) {
                    throw new Error('client id does not exist for user');
                }
            })
            .then(() => hset(user_id, client_id, client_secret))
            .then(() => ({
                user_id,
                client_id
            }));
    },

    delete: (user_id, client_id) => {
        return hget(user_id, client_id)
            .then(exists => {
                if (!exists) {
                    throw new Error('client id does not exist for user');
                }
            })
            .then(() => hdel(user_id, client_id))
            .then(() => ({
                user_id,
                client_id
            }));
    },
}