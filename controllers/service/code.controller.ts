import { hash, hashSync } from 'bcryptjs';
import { Request, Response } from 'express';
let referralCodeGenerator = require('referral-code-generator');
var otpGenerator = require('otp-generator');
const QRCode = require('qrcode');
const multer = require('multer');
// call  to soket io funtion 
import { io } from '../..';




// Your AccountSID and Auth Token from console.twilio.com
const accountSid = 'AC64b75a0abe63d68f9238631e0451811e';
const authToken = 'your_auth_token';
const client = require('twilio')(accountSid, authToken);
var rand = Math.floor(Math.random() * 100) + 1;
//
import { Server as SocketIoServer } from 'socket.io';






//bcrupt password
const bcrypt = require('bcrypt')
// const io = new SocketIoServer(server);

//cash free 
import { CFConfig, CFPaymentGateway, CFEnvironment } from "cashfree-pg-sdk-nodejs";
// Define your client ID and secret
const client_Id = 'your_client_id';
const secret = 'your_secret';
const { CFHeader } = require('cashfree-sdk');
import { CFCustomerDetails } from 'cashfree-sdk'; // Adjust the import path as needed
import { ApiResponse } from 'cashfree-sdk'; // Adjust the import path as needed
import { CFOrderRequest } from 'cashfree-sdk'; // Adjust the import path as needed
import{prodCfConfig} from 'cashfree-sdk';




import { v4 as uuidv4 } from "uuid";

import bcryptjs = require("bcryptjs");
bcryptjs.genSalt(10, function (err, salt) {
    bcryptjs.hash("B4c0/\/", salt, function (err, hash) {
        // Store hash in your password DB.
    });
});

// var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
// var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
// require the Twilio module and create a REST client
// const client = require('twilio')(accountSid, authToken);

// var bcryptjs= require('bcryptjs');

import db from "../../models"
const MyQuery = db.sequelize;
const { QueryTypes } = require('sequelize');
const { SECRET_KEY } = require('../../appconfig')
const jwt = require('jsonwebtoken')
import commonController from '../common/common.controller';
import { body, Result } from 'express-validator';
import { exists } from 'fs';
import { Encrypt } from '../common/encryptpassword';
import { error } from 'console';
import { TokenExpiredError } from 'jsonwebtoken';
import { EsimProfileList } from 'twilio/lib/rest/supersim/v1/esimProfile';
import { get } from 'request';
import exp = require('constants');
import { convertTypeAcquisitionFromJson } from 'typescript';
import router from '../../routes/user.routes';
import { on } from 'events';
import { is } from 'sequelize/types/lib/operators';
class CodeController {





    ///Section User Start
    async addNewUser(payload: any, res: Response) {
        const { firstname,lastname,city,state,email,password} = payload;
        //Check If Email Exists
        var checkEmail = await db.Users.findOne({
            where: {
                email
            }
        })
        if (checkEmail) {
            commonController.errorMessage("Email Already Exists", res)
        } else {
            var hash = await Encrypt.cryptPassword(password.toString());
            // console.log("HASH PASSWIORD",hash)
            // return;
            var result = await db.Users.create({
                firstname,lastname,city,state,email,password:hash,
            })
            //Generate Code
            var otp = commonController.generateOtp();
            console.log(otp);
            await db.UserOtps.create({
                userId: result.id,
                otpType: 1,
                otpValue: otp,
                active: true
            })
            // await commonController.sendEmail(emailId, 'Vefication Email', `Welcome Trice Pay <br/><br/>Dear ${fullName},<br/> Welcome to Trice Pay , <br/><br/> your verfication cod is ${otp}, <br/></br> Thanks, <br/><br/>Team Trice Pay`)

            // generate token
         const token = jwt.sign({
                email,
               }, process.env.TOKEN_SECRET);
         commonController.successMessage(token, "Code send on Email", res)
        }
    }
    //verify user
        async verify(payload: any, res: Response) {
            try {
                const { email,otpValue} = payload;
                var sun = await db.Users.findOne({
                    where:{
                        email
                    }
                })
                   console.log(sun.id,"ss")
                var checkOtp = await db.UserOtps.findOne({
                    where: {
                        userId:sun.id,
                        active: true
    
                    }
                })
                console.log(checkOtp,"ss")
                if (checkOtp) {
                    if (checkOtp.otpValue == otpValue) {
                        await checkOtp.update({ active: false });
                        commonController.successMessage({}, "Otp Verified", res)
    
                    } else {
                        commonController.errorMessage("Invalid OTP", res)
                    }
                }
            } catch (e) {
                commonController.errorMessage("occuerd error",res)
            }
        }

    // login user
    async  loginUser(payload, res) {
      const { email, password } = payload;
      try {
        const user = await db.Users.findOne({
          where: {
            email
          }
        });
        if (user) {
          const passwordMatch = await bcrypt.compare(password.toString(), user.password);
          if (passwordMatch) {
            const token = jwt.sign(
              {
                email,
                name: user.fullName,
                emailVerified: user.isEmailVerified,
              },
              process.env.TOKEN_SECRET
            );
             commonController.successMessage(token, 'User login', res);
          } else {
             commonController.errorMessage('Invalid Details', res);
          }
        } else {
           commonController.errorMessage('Email not found', res);
        }
      } catch (error) {
         commonController.errorMessage('An error occurred', res);
      }
    }
    
    
    // verify user
    async verifyUser(payload: any, res: Response) {
        try {
            const { id, otp } = payload;
            var checkOtp = await db.UserOtps.findOne({
                where: {
                    userId: id,
                    active: true
                }
            })
            if (checkOtp) {
                if (checkOtp.otpValue == otp) {

                    await checkOtp.update({ active: false });
                    commonController.successMessage({}, "Otp Verified", res)
                } else {
                    commonController.errorMessage("Invalid OTP", res)
                }
            }
        } catch (e) {
            commonController.errorMessage("occuerd error",res)
        }
    }

    //forgot Password
    async forgotPassword(payload: any, res: Response) {
        const { emailId } = payload;
        //Check If Email Exists
        var checkEmailId = await db.Users.findOne({
            where: {
                emailId

            }
        })
        if (checkEmailId) {
            //Generate Code
            var otp = commonController.generateOtp();
            console.log(otp);
            await db.UserOtps.create({
                otpValue: otp,
            }) 
            console.log(otp);
            await commonController.sendEmail(emailId, 'Your Email OTP To Reset Password', '<h1>Hi User  </h1><br> <p> Your email one time password (OTP) to reset password is ' + otp);
            commonController.successMessage(emailId, "link send  sucessfully", res)
        } else {
            console.log("not found");
        }
    }

     // updatePassword
    async updatePassword(payload: any, res: Response) {
        try {
            const { emailId, otp, password } = payload;
            // console.log(payload)
            var checkOtp = await db.UserOtps.findOne({
                where: {

                    otpValue: otp

                }
            })
            console.log(checkOtp.otpValue, otp);
            if (checkOtp) {
                if (checkOtp.otpValue == otp) {
                    commonController.successMessage({}, "Otp Verified", res)
                }
                else {
                    commonController.errorMessage("Invalid OTP", res)

                }
            }
        } catch (e) {
            commonController.errorMessage("error occered",res)
        }
    }
    // new password

    async newPassword(payload: any, res: Response) {
        const { emailId, password } = payload;
        //Check If Email Exists

        var checkdata = await db.Users.findOne({
            where: {
                emailId,

        }
        })
        console.log(emailId);
        if (checkdata) {
            var hash = await Encrypt.cryptPassword(password.toString());
            var result = await checkdata.update({
                password: hash,
            })
            commonController.successMessage(emailId, "password update  sucessfully", res)
        } else {
            commonController.errorMessage("password not update", res)
            console.log("no");
        }
    }

    // get user by id
    async getByUserId(payload: any, res: Response) {
        const { emailId } = payload;
        //Check If Email Exists
        var checkdata = await db.Users.findOne({
            where: {
                emailId

            }
        })
        if (checkdata) {
            const token = jwt.sign({
                id: checkdata.id,
                emailId,
                name: checkdata.fullName,
                emailVerfied: checkdata.isEmailVerfied,
                is2FaEnabled: checkdata.is2FaEnabled,
                isPhoneVerfied: checkdata.isPhoneVerfied
            }, process.env.TOKEN_SECRET);
            console.log(token);
            commonController.successMessage(checkdata, "data get  sucessfully", res)
            console.log(checkdata);
        } else {
            commonController.errorMessage("data not get", res)
            console.log("no");
        }
    }

    // update profile
    async updateProfile(payload: any, res: Response) {
        const { emailId, fullName, newemailId } = payload;
        //Check If Email Exists
        var checkdata = await db.Users.findOne({
            where: {
                emailId
            }
        })
        if (checkdata) {
            var result = await checkdata.update({
                fullName,
                emailId: newemailId

            })
            commonController.successMessage(checkdata, "data updated sucessfully", res)
            console.log(checkdata.emailId);
        } else {
            commonController.errorMessage("data not update", res)
            console.log("not found");
        }
    }

    // change Password
    async changePassword(payload: any, res: Response) {
        const { id, password ,newPassword} = payload;
        var hash = await Encrypt.cryptPassword(password.toString());
        //Check If Email Exists
        var checkdata = await db.Users.findOne({
            where: {
            id

            }
        })
        if (checkdata) {
            console.log(checkdata);
          const check =await Encrypt.comparePassword(password.toString(), checkdata.password.toString())
          console.log(check);
            if (await Encrypt.comparePassword(password.toString(), checkdata.password.toString())) {
                var result = await checkdata.update({
                    password : newPassword
    
                })
               console.log(hash);
                 console.log("ok ");
                 commonController.successMessage(id, "Password changed successfully", res)  
            } else {
                commonController.errorMessage("INvalid Details", res)
            }
        }
        else {
            commonController.errorMessage("Email password not match", res)
            console.log("no");
        }
} 


        // find all users
        async getAll(payload: any, res: Response) {
            const{id}=payload;
        try{
            var sqlQuery = `SELECT u.firstName, u.id AS userId, u.lastName, u.email, p.mname, p.fname
            , p.userId AS parentUserid, o.userId AS otpUserId, o.otpValue, o.active FROM users u LEFT JOIN 
            parents p ON u.id = p.userId LEFT JOIN userotps o ON u.id = o.userId WHERE u.email ='${id}' `;
                                                                        //            u.id=${id}       
        var result = await MyQuery.query(sqlQuery, { type: QueryTypes.SELECT });;
        console.log("............tt",result)
        commonController.successMessage(result,"data get successfullty ",res)
        }catch(e){
            commonController.errorMessage("Error:user not get info-",res)
        }
    }
  

    // get active=2   SELECT * FROM `users` WHERE active=2;
    async getactive(payload: any, res: Response) {
      const{active}=payload;
      console.log("pay...........",res)
     try{
     const sun=await db.users.findAll({
      where:{
        active:2
      }
   })
   console.log("sun......",sun)
   commonController.successMessage(sun,"active",res)
    }catch(e){
      commonController.errorMessage("Error:user not get info-",res)
  }
}


        // async test(payload: any, res: Response) {
        //     const {cc,phone}=payload;
        //     console.log(payload,"pa") 
        //     client.messages.create({
        //         body: 'Hello from Node',
        //         to: '+916284507322',
        //         from: '+12345678901'
        //      }).then(message => console.log(message))
        //        // here you can implement your fallback code
        //        .catch(error => console.log(error))
           
        // }


       // delete user
       async deleteUser(payload: any, res: Response) {
        const { emailId } = payload;
        //Check If Email Exists
        var checkdata= await db.Users.findOne({
            where: {
                emailId

            }
        })
        if (checkdata) {
             var result =checkdata.destroy({
                where: {
                   emailId:emailId
                }
             }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                }
             }, function(err){
                 console.log(err); 
             });
            commonController.successMessage(checkdata, "data delete  sucessfully", res)
            console.log("data delete  sucessfully");
        } else {
            commonController.errorMessage("data not delete", res)
            console.log("not found");
        }
    }

  
    //qr code 
   async qrCode(payload: any, res: Response) {
  const generateQR = async (text) => {
    try {
      const dataUrl = await QRCode.toDataURL(text);
      console.log(dataUrl);
      commonController.successMessage(dataUrl, "QR code generated successfully", res);
    } catch (e) {
      commonController.errorMessage("Failed to generate QR code", res);
      console.log(e);
    }
  };
  await generateQR("http://google.com");
}
 

//post image
async postImage(req: any, res: any) {
  try{
    var response = `$(req.file.path)`;
    console.log(response,"hhhhhhhhhhhhh");
    if (response.match(/\.(png|jpg|jpeg)$/)) {
        await db.avatars.create(
            {
                avatar: "http://localhost:4000/" + response,
            
            },
            res
        );
    }
        commonController.successMessage(req.file.path, "image upload succesfully", res);
      } catch (e) {
        commonController.errorMessage("image not upload oops!", res);
        console.log(e);
      }
    }
    // add user 
    async  addUser(payload: any, res: Response) {
        try {
            const { firstname, lastname, email, password } = payload;
            console.log("Payload:", payload);
            const existingUser = await db.Users.findOne({
                where: {
                    email
                }
            });
            console.log("Existing User:", existingUser);
            if (existingUser) {
                commonController.successMessage(existingUser, "Email already exists", res);
            } else {
                // const encryptedPassword = await Encrypt.cryptPassword(password); its correct bcrupt 
                // Hash the password using bcrypt
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt);
                const newUser = await db.Users.create({
                    firstname,
                    lastname,
                    email,
                    active: false,
                    password: hashedPassword
                });
                console.log("New User:", newUser);
                // Generate OTP
                const otp = commonController.generateOtp();
                console.log("Generated OTP:", otp);
    
                // Create OTP entry for the newly created user
                const otpEntry = await db.UserOtps.create({
                    userId: newUser.id, // Use newUser.id
                    otpType: 1,
                    otpValue: otp,
                    active: true
                });
                console.log("OTP Entry:", otpEntry);
                commonController.successMessage(newUser, "User created", res);
            }
        } catch (error) {
            console.error("Error:", error);
            commonController.errorMessage("User not added", res);
        }
    }
    

    
    async otp(payload:any,res:Response){
        try{
        const{email}=payload
        console.log("pay.............",payload)
        const sun=await db.Users.findOne({
           where:{
            email
           } 
        })
        console.log("sun..........",sun)
          if(!sun){
       var moon= await db.UserOtps.findOne({
        where:{
            userId:sun.id
              }
        
         })
         console.log("moon",moon)
        }
     else{
//Generate Code
var otp = commonController.generateOtp();
console.log(otp);
var orange=await db.UserOtps.create({
    userId: sun.id,
    otpType: 1,
    otpValue: otp,
    active: true
})
commonController.successMessage(orange,"otp  generate ",res)
}
}
catch(e){
commonController.errorMessage("user otp not create ",res)
}
    }



    // parent add 
    async parentAdd(payload: any, res: Response) {
        const { fname, mname, email } = payload;
        console.log("pay", payload);
        try {
          // Check if the user exists
          const user = await db.Users.findOne({
            where: {
              email: email,
            },
          });
          if (user) {
            // Check if the parent exists
            const parent = await db.parents.findOne({
              where: {
                userId: user.id,
              },
            });
            if (parent) {
              // Update parent details
              await parent.update({
                fname: fname,
                mname: mname,
              });
      
              commonController.successMessage(parent, "Parent details updated successfully", res);
            } else {
              // Create a new parent
              const newParent = await db.parents.create({
                fname: fname,
                mname: mname,
                userId: user.id,
              });
              commonController.successMessage(newParent, "Parent created successfully", res);
            }
          } else {
            // Handle the case where the user does not exist
            commonController.errorMessage("User not found", res);
          }
        } catch (error) {
          console.error(error);
          commonController.errorMessage("An error occurred", res);
        }
      }

      // get users
    async get(payload:any,res:Response){
        try{
            var sqlQuery = `SELECT u.firstName, u.id AS userId, u.lastName, u.email, p.mname, p.fname,p.userId 
            AS parentUserid, o.userId AS otpUserId, o.otpValue,
             o.active FROM users u LEFT JOIN parents p ON u.id = p.userId LEFT JOIN userotps o ON
              u.id = o.userId`;
        var result = await MyQuery.query(sqlQuery,{ type: QueryTypes.SELECT });;
        console.log("............tt",result)
        commonController.successMessage(result,"get all data",res)
        }catch(e){
              commonController.errorMessage("get all users",res)
              }
        }

        // add  uers bank detail 
      async add(payload: any, res: Response){
            const { accontno, phonenumber,mname,fname } = payload;
            console.log("pay.....",payload);
            console.log("pay.........",payload) 
            try {
              const existingUser = await db.users.findOne({
                where: {
                  phonenumber,
                },
              });
              console.log("exxxxx",existingUser)
                if (existingUser) {
                commonController.errorMessage( 'User already exists', res);
              }
               else {
                // random funtion = debitcard,cvv,expirydate
                var debitcard = (Math.random() + ' ').substring(2   ,10) + (Math.random() + ' ').substring(2,10)
                console.log(debitcard,"debitcard")
                const cv=await commonController.generateRandomCVV();
                console.log("cv...",cv)
                const expiryDate = await commonController.generateRandomExpiryDate()
                console.log(expiryDate,"fff")
                const formattedExpiry = expiryDate.slice(0, 2) + '/' + expiryDate.slice(2);
                console.log(formattedExpiry,"format..................")
                //create users
                const newUser = await db.users.create({
                 accontno,
                  phonenumber,
                  debitcardno:debitcard,
                  cvc:cv,
                  expiry:formattedExpiry,
                  active:false,
                  mname,fname
                });
                commonController.successMessage(newUser, 'Added bank details successfully', res);
              }
              }catch (e) {
              commonController.errorMessage('Error occurred', res);
            }}

            //add
            async addd(payload: any, res: Response) {
              const { accontno, phonenumber } = payload;
              console.log("pay.........", payload);
              try {
                const existingUser = await db.users.findOne({
                  where: {
                    phonenumber,
                  },
                });
                console.log("exxxxx", existingUser);    
                if (existingUser) {
                  // User already exists, handle the error or send a message.
                  commonController.errorMessage('User already exists', res);
                } else {
                  let debitcard
                  // Generate unique debit card details
                  while (true) {
                    debitcard = (Math.random() + ' ').substring(2, 10) + (Math.random() + ' ').substring(2, 10);
                    // Check if this debit card info is unique in the database
                    const isUnique = await db.users.findOne({
                      where: {
                        debitcardno: debitcard,
                      },
                    });
                    if (!isUnique) {
                      break;
                    }
                  }
                  const cv = await commonController.generateRandomCVV();
                  const expiryDate = await commonController.generateRandomExpiryDate();
                 const formattedExpiry = expiryDate.slice(0, 2) + '/' + expiryDate.slice(2);
                  const newUser = await db.users.create({
                    accontno,
                    phonenumber,
                    debitcardno: debitcard,
                    cvc: cv,
                    expiry: formattedExpiry,
                  });
                  commonController.successMessage(newUser, 'user add sucessfuly', res);
                }
              } catch (e) {
                commonController.errorMessage('Error occurred', res);
              }
            }

          
            
 

            
            // update phoneNumber
            async updatephone(payload:any,res:Response){
              const{newphonenumber,phonenumber}=payload 
              console.log("pay.............",payload)
              try{
               const sun=await db.users.findOne({
                where:{
                  phonenumber
                }
             })
               if(sun){
                await sun.update({
                  phonenumber:newphonenumber,active:1
                })
                commonController.successMessage(sun,"phone number is update ",res)
               }
               else{
                commonController.errorMessage("phone number is not update ",res)
               }
              }catch(e){
                commonController.errorMessage("error occure",res)

              }
            }
            

            // delet users  
         async delt(payload: any, res: Response) {
         const { id } = payload;
         try {
        const moon = await db.users.findOne({
          where: {
        id: id,
      },
        });
      if (moon) {
      await moon.destroy();
      console.log(`User with ID ${id} has been deleted.`);
       commonController.successMessage(moon,"user delet succsfully",res);
       } else {
     commonController.errorMessage("user not found",res)
    }
      } catch (error) {
    console.error('Error deleting user:', error);
   commonController.errorMessage("user not delet",res);
     }
    }


    //get all
    async getall(payload: any, res: Response) {
      try {
        const sun = await db.users.findAll({

        });
        console.log(sun, "Retrieved data from the database");
        if (sun) { 
          io.emit('hhjhj', sun); // Emit 'sun' data to clients listening to 'hhjhj' event
          console.log("Emitted data to clients");
          commonController.successMessage(sun, "Get all data", res);
        } else {
          commonController.errorMessage("Error occurred", res);
        }
      } catch (error) {
        console.error("Detailed error:", error);
        commonController.errorMessage("Error occurred", res);
      }
      
    }
    


// array 
    async array(payload: any, res: Response) {
      try {

          // Example: Doubling each number in an array using map function
          const numbers = [1, 2, 3, 4, 5];
          const doubledNumbers = numbers.map((num) => {
              return num * 2;
          });
          commonController.successMessage(doubledNumbers,"get data",res)
          // Output the doubledNumbers outside the map function
          console.log(doubledNumbers); // This will show the doubled array in the console
          // Now you can use doubledNumbers further or send it in the response
      } catch (error) {
          console.log(error);
          commonController.errorMessage("An error occurred", res);
      }
  }
  
     
    
}

export default new CodeController();
// export default new hello();
