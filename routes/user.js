let express = require('express');
let bcrypt = require('bcrypt');
const asyncMiddleware = require('../middleware/async');
const outputMessage = require('../general/output-message');
let router = express.Router();
const {User, validateUser, validateUserLogin} = require('../models/user');
const sendEmail = require('../general/email');


router.post('/register', asyncMiddleware( async (req,res, next) => {

    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(outputMessage({},error.details[0].message,400));

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send(outputMessage({},'User already present',400));

    let pass = getNewPassword();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
    });

    await sendEmail(req.body.email, req.body.name, pass);

    await user.save();

    return res.send(user,"success",200);
}));

router.post('/login',asyncMiddleware( async (req,res) => {
    const {error} = validateUserLogin(req.body);
    if(error) return res.status(400).send(outputMessage({},error.details[0].message,400));

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send(outputMessage({},'Invalid username or password',400));

    const result = await bcrypt.compare(req.body.password, user.password);
    if(!result) return res.status(400).send(outputMessage({},'Invalid username or password',400));

    const token = user.generateAuthToken();

    return res.header('x-auth-token',token).send(outputMessage({'token':token},'Logged In',200));
}));

function getNewPassword(){
    let animal = ['ape', 'bat', 'cat', 'dog', 'elephant', 'frog', 'giraffe', 'horse', 'insect',
                  'jackal', 'kangaroo', 'lizard', 'mongoose'];

    let pass_1 = animal[Math.floor(Math.random() * animal.length)];
    let pass_2 = Math.floor(Math.random()*(999-100+1)+100);

    return `${pass_1}${pass_2}`;
}

module.exports = router;