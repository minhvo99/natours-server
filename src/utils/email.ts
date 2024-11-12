import nodemailer, { TransportOptions } from 'nodemailer';
import { IUser } from 'src/constans/User';
import pug from 'pug';
import { convert } from 'html-to-text';
import path from 'path';
import fs from 'fs';

interface EmailOptions {
   from: string;
   to: string;
   subject: string;
   html: any;
   text: string;
}

class Email {
   to: string;
   firstName: string;
   url: string;
   from: string;

   constructor(user: IUser, url: string) {
      this.to = user.email;
      this.firstName = user.name.split(' ')[0];
      this.url = url;
      this.from = `Admin Natours ${process.env.EMAIL_FROM}`;
   }

   newTransport() {
      // if (process.env.NODE_ENV === 'production') {
      //    // Sendgrid
      //    return 1;
      // }
      return nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
         },
      } as TransportOptions);
   }

   async send(template: string, subject: string) {
      /// 1) Render HTML based on a template, eg Pug
      // const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      //    firstName: this.firstName,
      //    url: this.url,
      //    subject,
      // });

      const templateURL = path.join(__dirname, `../views/email/${template}.html`);

      const html = fs.readFileSync(templateURL, 'utf-8');

      html.replace('{{ firstName }}', this.firstName);
      html.replace('{{ url }}', this.url);
      html.replace('{{ subject }}', subject);

      /// 2) Defien email option
      const mailOptions: EmailOptions = {
         from: this.from,
         to: this.to,
         subject,
         html,
         text: convert(html),
      };

      /// 3) Create a tranport and send email

      await this.newTransport().sendMail(mailOptions);
   }

   async sendWelcome() {
      await this.send('welcome', 'Welcome');
   }

   async senPassWordReset() {
      await this.send('passwordReset', 'Password reset token');
   }
}

export default Email;
