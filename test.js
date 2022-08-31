const crypto = require('crypto');

const secret = 'abcdefg';
const hash = crypto.randomUUID()

console.log(hash);