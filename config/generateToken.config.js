const crypto = require("crypto");
const token = crypto.randomBytes(12).toString('hex');

console.log(token);