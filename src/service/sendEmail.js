import nodemailer from 'nodemailer'

async function sendEmail(dest,subject,message,attachments = []) {
    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: process.env.nodeMailerEmail,
          pass: process.env.nodeMailerPassword, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"Ahmed Khaled"${process.env.nodeMailerEmail}`, // sender address
        to: dest, // list of receivers
        subject, // Subject line
        html: message,
        attachments // html body
      });
      console.log(info);
}
export default sendEmail