const nodemailer = require('nodemailer');
const config = require('config');

async function sendEmail(user_email, user_name, user_pass) {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      //let testAccount = await nodemailer.createTestAccount();
    
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "mail.neosofttech.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'parth.dave@neosofttech.com',//testAccount.user, // generated ethereal user
          pass: config.get('pass')//testAccount.pass // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
      });

      transporter.verify(function(error, success) {
        if (error) {
          console.log('Hi',error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Neosoft Feedback Application" <parth.dave@neosofttech.com>', // sender address
        to: user_email, // list of receivers
        subject: "Feedback Password", // Subject line
        html: `<p>Hi ${user_name},<br><br>
               The password for your feedback account is <b>${user_pass}</b>.
               Do not share this password with anyone.<br><br>
               Regards,
               Team Feedback
               Neosoft Technologies` // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}



module.exports = sendEmail;
    