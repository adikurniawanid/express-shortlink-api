const bcrypt = require('bcrypt');

module.exports = async (password, hash) => bcrypt.compare(password, hash);
