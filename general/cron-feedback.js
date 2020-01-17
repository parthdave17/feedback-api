let express = require('express');
let router = express.Router();
const {Feedback, validateFeedback} = require('../models/feedback');
const {User} = require('../models/user');

async function allotUserFeedback(){
    const users = await User
                        .find()
                        .select('_id');


    const user_arr = users.map((val) => val._id);

    

    await Feedback.remove({});

    users.forEach(single_user => {

        const shuffled = user_arr
                            .filter((val) => val != single_user.id)
                            .sort(() => 0.5 - Math.random());

        let feedback_users = shuffled.slice(0, 3);

        //console.log(shuffled);

        feedback_users.forEach(async (single_feedback) => {

            let feedback = new Feedback({
                by_user: single_user._id,
                for_user: single_feedback,
                feedback: '',
                complete: 0
            });
            try{
                await feedback.save();
            }
            catch(ex){
                console.log(ex);
            }
            

        });
        
    });

    
}

module.exports = allotUserFeedback;
