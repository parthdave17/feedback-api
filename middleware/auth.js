const jwt = require('jsonwebtoken');
const config = require('config');
const outputMessage = require('../general/output-message');

function auth(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) res.status(401).send(outputMessage({},'Access denied',401));
    
    //console.log(config.get('jwt'),'qeqwr');

    try{
        const decoded = jwt.verify(token, config.get('jwt'));
        req.user = decoded;

        next();
    }
    catch(ex){
        return res.status(400).send(outputMessage({},'Invalid token',400));
    }    
}

module.exports = auth;