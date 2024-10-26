import nodemailer, { TransportOptions } from 'nodemailer';

interface EmailOptions {
   email: string;
   subject: string;
   message: string;
}

export const sendEmail = async (options: EmailOptions) => {
   //1) Create a transporter
   const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
         user: process.env.EMAIL_USERNAME,
         pass: process.env.EMAIL_PASSWORD,
      },
      //Active in gmail "less secure app" option
   } as TransportOptions);

   const mailOptions = {
      from: 'Admin Natours <admin@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:
   };

   //3) Actually send the mail
   await transporter.sendMail(mailOptions);
};
