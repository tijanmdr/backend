const crypto = require("crypto");
const token = crypto.randomBytes(20).toString('hex');

console.log(token);