const mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
const config = require('config');
let Joi = require('@hapi/joi');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 100,
        unique:true
    },
    password: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 100
    } 
});

userSchema.methods.generateAuthToken = function(){
    //console.log(config.get('jwt'));
    return jwt.sign({ _id: this._id }, config.get('jwt'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {

    const regexExp = /^\S[A-Za-z ]+$/;

    const schema = Joi.object({
        name: Joi.string().min(3).max(100).regex(regexExp,{name:"numbers not allowed validation"}).required(),
        email: Joi.string().min(3).max(100).email().regex(/^[A-Za-z_][A-Za-z0-9@._]*$/,{name:"email validation"}).required(),
    });

    return schema.validate(user);

}

function validateUserLogin(user) {

    const schema = Joi.object({
        email: Joi.string().min(3).max(100).email().regex(/^[A-Za-z_][A-Za-z0-9@._]*$/,{name:"email validation"}).required(),
        password: Joi.string().required()
    });

    return schema.validate(user);

}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validateUserLogin = validateUserLogin;