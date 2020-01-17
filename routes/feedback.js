let express = require('express');
const asyncMiddleware = require('../middleware/async');
let auth = require('../middleware/auth');
let router = express.Router();
const {Feedback, validateFeedback} = require('../models/feedback');
const { User } = require('../models/user');
const outputMessage = require('../general/output-message');


router.post('/', auth, asyncMiddleware( async (req,res) => {

    const result = await User.findOne({_id: req.body.for_user});
    if(!result) return res.status(400).send(outputMessage({},'No such user',400));

    const {error} = validateFeedback(req.body);
    if(error) return res.status(400).send(outputMessage({},error.details[0].message,400));

    if(req.body.for_user == req.user._id) return res.status(400).send(outputMessage({},'Cannot give feedback to yourself',400));

    const result2 = await Feedback.find({for_user: req.body.for_user, by_user: req.user._id, complete:1});
    
    if(result2.length) return res.status(400).send(outputMessage({},'Review already given to this user',400));

    const feedback = await Feedback
                        .findOneAndUpdate(
                            {for_user: req.body.for_user, by_user: req.user._id},
                            {$set: {feedback: req.body.feedback, complete: 1}},
                            {new: true});

    return res.send(feedback,"success",200);
    

}));

router.get('/', auth, asyncMiddleware( async (req,res) => {

    const user_feedback = await Feedback
                                    .find({ for_user: req.user._id, complete: 1})
                                    .select('-_id for_user feedback');

    if(!user_feedback.length) return res.send(outputMessage({},'No users left for reviewing',200));

    return res.send(user_feedback,"sucesss",200);
    
}));

router.get('/users', auth, asyncMiddleware( async (req,res) => {

    const user = await Feedback
                            .find({ by_user: req.user._id, complete: 0})
                            .populate('for_user','name _id')
                            .select('-_id for_user');

                        
    const user_filter = user.map(v => v.for_user);

    return res.send(outputMessage(user_filter,"success",200));
    
}));

function getNewPassword(){
    let animal = ['ape', 'bat', 'cat', 'dog', 'elephant', 'frog', 'giraffe', 'horse', 'insect',
                  'jackal', 'kangaroo', 'lizard', 'mongoose'];

    let pass_1 = animal[Math.floor(Math.random() * animal.length)];
    let pass_2 = Math.floor(Math.random()*(999-100+1)+100);

    return `${pass_1}${pass_2}`;
}

module.exports = router;