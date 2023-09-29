const crypto = require('crypto');

function newHash(data) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(data);
    return sha1.digest('hex');
}

module.exports = newHash;

