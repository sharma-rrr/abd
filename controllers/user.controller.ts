import { Request, Response } from 'express';
import codeController from './service/code.controller';
import commonController from './common/common.controller';
import { sign, verify } from 'crypto';
import request from 'request';
// import userController from "../controllers/user.controller";
class UserController {
    async register(req: Request, res: Response) {
        try {
            const {firstname,lastname,city,state,email,password } = req.body;
                await codeController.addNewUser({
                    firstname,lastname,city,state,email,password
                }, res)
        } catch (e) {
            console.log(e)
            commonController.errorMessage("user not register", res)
        }
    }


    async get(req: Request, res: Response) {
        try {
                await codeController.get({
                }, res)
        } catch (e) {
            console.log(e)
            commonController.errorMessage("user not register", res)
        }
    }
    

    

    
    async verify(req: Request, res: Response) {
        try {
            const {email,otpValue} = req.body;
            console.log(req.body)
                await codeController.verify({
                    email,otpValue
                }, res)
        } catch (e) {
            console.log(e)
            commonController.errorMessage("user not register", res)
        }
    }


    //  user login
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            await codeController.loginUser({
                email, password

            }, res)
        } catch (e) {
            commonController.errorMessage("user not login", res)

        }
    }

    //verify user
    async verifyCode(req: Request, res: Response) {
        try {
            var userId=req?.user?.id;
            const {  otp } = req.body;
            await codeController.verifyUser({
               userId, otp

            }, res)
        } catch (e) {
            commonController.errorMessage("not verify", res)

        }
    }
    
    //forgot Password
    
    async forgotPassword(req: Request, res: Response) {
        try {
            const { emailId } = req.body;
            await codeController.forgotPassword({
                emailId

            }, res)
        } catch (e) {
            commonController.errorMessage("emailId not found", res)

        }
    }

    //updatePassword
    async updatePassword(req: Request, res: Response) {
        try {
            const {  emailId,otp, password, confirmPassword } = req.body;
            if (password != confirmPassword) {
                commonController.errorMessage("Password Not Matched", res);  
            }
            else {
                await codeController.updatePassword({
                     emailId,otp,password
                }, res)
            }
        } catch (e) {
            console.log(e)
            commonController.errorMessage("user not update", res)
        }
    }


// newpassword 
async newPassword(req: Request, res: Response) {
    try {
        const { emailId, password, confirmPassword } = req.body;
        if (password != confirmPassword) {
            commonController.errorMessage("Password Not Matched", res);
        }
      else {
 await codeController.newPassword({
     emailId, password
            }, res)
        }
} catch (e) {
        console.log(e)
        commonController.errorMessage("not update", res)
    }
} 

  // Get User By Id
  async getByUserId(req: Request, res: Response) {
    try {
        const { emailId } = req.body;
        await codeController.getByUserId({
            emailId
        }, res)
    } catch (e) {
        commonController.errorMessage("user not get", res)
        console.log(e);

    }
}


  // update profile
  async updateProfile(req: Request, res: Response) {
    try {
        const { emailId,fullName ,newemailId} = req.body;
        await codeController.updateProfile({
            emailId,
            fullName,
            newemailId

        }, res)
    } catch (e) {
        commonController.errorMessage("user not get", res)
        console.log(e);

    }
}

// change Password
async changePassword(req: Request, res: Response) {
    try {
        const { id, password ,newPassword} = req.body;
        await codeController.changePassword({
            id, password,newPassword

        }, res)
    } catch (e) {
        commonController.errorMessage("user not login", res)

    }
}

// get all users
async getAll(req: Request, res: Response) {
    const{id}=req.body
    try {
        await codeController.getAll({
            id
        }, res)
    } catch (e) {
        commonController.errorMessage("user not get", res)
        console.log(e);

    }
}

// async test(req: Request, res: Response) {
    
//     try {
//          const{cc,phone}=req.body;
//         await codeController.test({
//            cc,phone

//         }, res)
//     } catch (e) {
//         commonController.errorMessage("user not get", res)
//         console.log(e);

//     }
// }
      // delete USER
      async deleteUser(req: Request, res: Response) {
        try {
            const { emailId } = req.body;
            await codeController.deleteUser({
                emailId
            }, res)
        } catch (e) {
            commonController.errorMessage("user not found", res)
            console.log(e);
    
        }
    }



    //qr code
    async qrCode(req: Request, res: Response) {
        try {
            await codeController.qrCode({

            }, res)
        } catch (e) {
            commonController.errorMessage("qr code is not found", res)
            console.log(e);
    
        }
    }

    //IMAGE UPLOAD
    async postImage(req: Request, res: Response) {
        try {
            await codeController.postImage({
            }, res)
        } catch (e) {
            commonController.errorMessage("qr code is not found", res)
            console.log(e);
    
        }
    }
    // add users 
     async adduser(req:Request,res:Response){
        try{
            const{firstname,lastname,email,password}=req.body
            await codeController.addUser({
                firstname,lastname,email,password
            },res)

        }catch(e){
            commonController.errorMessage("user not add",res)

        }
     }
  
     // add  users bank detail
       async addbank(req: Request, res: Response) {
         try {
           const { accontno, phonenumber,mname,fname} = req.body;
           await codeController.add({
            accontno, phonenumber,mname,fname
         }, res);
         } catch (e) {
           commonController.errorMessage("User not added", res);
         }
       }


    // update Phonenumber 
       async updatephone(req: Request, res: Response) {
        try {
          const { newphonenumber,phonenumber} = req.body;
          console.log("re......",req.body)
          await codeController.updatephone({
            newphonenumber,phonenumber,
        }, res);
        } catch (e) {
          commonController.errorMessage("User not added", res);
        }
      }

      
      // get active 
    async getactive(req: Request, res: Response) {
        try {
          console.log("re......",req.body)
          await codeController.getactive({
        }, res);
        } catch (e) {
          commonController.errorMessage("User not added", res);
        }
      }
    
   
     
     async otp(req:Request,res:Response){
        try{
            const{email}=req.body
            await codeController.otp({
            email,
            },res)

        }catch(e){
            commonController.errorMessage("user not add",res)

        }
     }
     

     async parent(req:Request,res:Response){
        try{
            const{mname,email,fname}=req.body
            await codeController.parentAdd({
            mname,fname,email
            },res)
        }catch(e){
            commonController.errorMessage("user not add",res)

        }
     }

     
     
    
     async delet(req:Request,res:Response){
        const{id}=req.body
        try{
            await codeController.delt({
                id
            },res)
        }catch{
       commonController.errorMessage("delet users",res)
        }
     }

     
    // get all users
     async getall (req:Request,res:Response,){
    try{
        
        await codeController.getall({
        
        },res)
    }catch(errror){
        commonController.errorMessage("error occred",res)
    }
     
}


async aa(req:Request,res:Response){
    try{
        await codeController.array({
        },res)
    }catch(error){
        commonController.errorMessage("error",res)
    }

}


}




export default new UserController();