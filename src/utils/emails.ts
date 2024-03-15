import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

interface IEmail {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const { EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD, MODE_TEST } = process.env;

var transporter = nodemailer.createTransport({
  service: EMAIL_HOST,
  port: 2525,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

export async function sendEmail({ to, subject, text, html }: IEmail) {
  try {
    const info = await transporter.sendMail({
      from: 'your_email@example.com', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}
