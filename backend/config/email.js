const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

let transporter = null;

if (emailUser && emailPass) {
  transporter = nodemailer.createTransport({
    service: 'gmail', // Default service (can be changed to SMTP hosts)
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
  console.log('Nodemailer SMTP Transporter Initialized.');
} else {
  console.warn('\n============================================================');
  console.warn('WARNING: EMAIL_USER and EMAIL_PASS are missing in backend/.env');
  console.warn('Emails will be simulated and logged to the backend console.');
  console.warn('To send real emails, please set EMAIL_USER & EMAIL_PASS (Gmail App Password).');
  console.warn('============================================================\n');
}

const sendMail = async (to, subject, text, html) => {
  if (transporter) {
    await transporter.sendMail({
      from: `"Swiggy Clone" <${emailUser}>`,
      to,
      subject,
      text,
      html
    });
  } else {
    console.log(`\n================ SIMULATED EMAIL ================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text}`);
    console.log(`=================================================\n`);
  }
};

module.exports = {
  sendMail
};
