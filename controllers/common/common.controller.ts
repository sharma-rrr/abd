import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
const sgMail = require('@sendgrid/mail');
// const { SECRET_KEY, MAP_SECRET_KEY } = require('../appconfig');
sgMail.setApiKey('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')
class CommonController {
    sendEmail = async (to: any, subject: any, message: any) => {
        const msg = {
            to: to,
            from: 'noreply@tric-pay.com',
            subject: subject,
            text: message,
            html: message,
        };
        await sgMail.send(msg);
    }
   
    generateOtp(){
        return Math.floor(100000 + Math.random() * 900000);
    }
    cryptPassword ( password) {
       bcrypt.genSalt(10, function(err, salt) {
        if (err) 
          return err;
    
        bcrypt.hash(password, salt, function(err, hash) {
          return  hash;
        });
      });
    };
    
    comparePassword = function(plainPass, hashword) {
       bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
           return err == null ?
               isPasswordMatch:
               err;
       });
    };
    
    successMessage(data: any, msg: string, res: Response) {
        try{
        return res.status(200).send({
            message: msg,
            data
        });}catch(e){
            console.log(e);
        }
    }
    
    errorMessage(msg: string, res: Response) {
       try{
        return res.status(400).send({
            error: {
                message: msg
            }
        });}catch(e){
            console.log(e);
        }
    }
    // debit card generate number
     debitcard() {
        (Math.random() + ' ').substring(2,10) + (Math.random() + ' ').substring(2,10)
     } 

          
    // Function to generate a random 3-digit CVV
           generateRandomCVV(): number {
            return Math.floor(100 + Math.random() * 900);
          }



     // Function to generate a random expiry date (MMYY format)
     generateRandomExpiryDate(): string {
        const year = new Date().getFullYear() + Math.floor(Math.random() * 10);
        const month = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
        return `${month}${year.toString().slice(2)}`;
      }
  



      

   

    //  Function to format the expiry date as "MM/YY"
     format(expiryDate) {
        // Assuming expiryDate is a string in "MMYY" format
        const month = expiryDate.slice(0, 2);
        const year = expiryDate.slice(2);
        return `${month}/${year}`;
    }

    
  
}
export default new CommonController();