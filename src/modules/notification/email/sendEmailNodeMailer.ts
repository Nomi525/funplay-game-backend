import * as nodemailer from 'nodemailer';

export async function sendEmail(email: string, html?: any) {
  // Generate test SMTP service account from ethereal.email
  console.log('--->');
  console.log('--->email', email);
  console.log('--->html', html);

  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'ec0d3fea14e9f2',
      pass: 'f151192bd660f7',
    },
  }); // send mail with defined transport object
  console.log({ transporter });

  const mailOptions = {
    from: 'sandbox.smtp.mailtrap.io',
    to: `${email}`,
    subject: 'testing AllocationStatusForResignedEmployees',
    html: `${html}`,
  };
  console.log({ mailOptions });

  const info = transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return error;
    }
    console.log('Message sent successfully!'); // only needed when using pooled connections
  });
  console.log({ info });
  return info;
}
