const winston = require('winston');
const outputMessage = require('../general/output-message');

module.exports = function(err, req, res, next){

    winston.error(err.message, err);
    res.status(500).send(outputMessage({}, 'Something failed', 500));
}