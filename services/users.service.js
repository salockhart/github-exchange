const uuid = require('uuid/v1');

module.exports = {
    create: () => {
        return uuid();
    }
}