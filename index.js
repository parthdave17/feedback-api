let express = require('express');
let mongoose = require('mongoose');
let user = require('./routes/user');
const config = require('config');
let feedback = require('./routes/feedback');
const error = require('./middleware/error');
const allotUserFeedback = require('./general/cron-feedback');
const winston = require('winston');
let app = express();
const cron = require("node-cron");

process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
});

process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
});

app.use(express.json());
app.use('/api/user', user);
app.use('/api/feedback', feedback);
app.use(error);

winston.add(new winston.transports.File({filename : 'logfile.log' }));

mongoose
    .connect(config.get('db'), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to mongo database feedback')
    
        //allotUserFeedback();
    
    });

//console.log(config.get('jwt'));

cron.schedule("* * * * Friday", function() {
    allotUserFeedback();
});

app.listen('3000',() => console.log('Listening on port 3000...'));