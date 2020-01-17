const mongoose = require('mongoose');
let Joi = require('@hapi/joi');

const feedbackSchema = mongoose.Schema({
        by_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true,
            minlength: 3,
            maxlength: 100
        },
        for_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true,
            minlength: 3,
            maxlength: 100
        },
        feedback: {
            type: String,
            maxlength: 1000
        },
        complete: {
            type: Number,
            required:true
        }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

function validateFeedback(user) {
    const schema = Joi.object({
        feedback: Joi.string().min(20).max(1000).required(),
        for_user: Joi.string()
    });

    return schema.validate(user);

}

module.exports.Feedback = Feedback;
module.exports.validateFeedback = validateFeedback;
