require('dotenv').config();
const path = require('path');
const mail = require('../config/mail');
const EmailTemplate = require('email-templates').EmailTemplate;
const mailQueue = require('../config/queue').mailQueue;
const templatesDir = path.resolve(__dirname, '../components/email-templates');

mailQueue.process((mailInfo, done) => {
  try {
    template = new EmailTemplate(path.join(templatesDir, mailInfo.data.template));
    template.render(mailInfo.data.context, (error, result) => {
      return mail.sendMail({
        from: mailInfo.data.from,
        to: mailInfo.data.to,
        subject: result.subject,
        html: result.html
      })
      .then(success => done())
      .catch(err => {
        console.log(err);
        return done(err)
      });
    });
  } catch (err) {
    console.log(err);
  }
});

// setInterval(mailQueue.clean.bind(60 * 1000), 50 * 1000);
setInterval(() => {
  mailQueue.clean(60 * 1000);
}, 50 * 1000);

process.once('SIGTERM', () => {
  mailQueue
    .close()
    .then(process.exit.bind(0))
    .catch(e => e);
});

