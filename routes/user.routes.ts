import { verify } from 'crypto';
import express from 'express';

 import userController from "../controllers/user.controller";
import { UserInstance } from 'twilio/lib/rest/conversations/v1/user';

 const multer = require("multer");
 var storage = multer.diskStorage({
  destination: function (req: any, file:any, cb: any){
    cb(null, "profile");
  },
  filename: function(req:any, file: any, cb: any) {
    cb(null, file.originalname + ".png");
  },
 });
 var upload = multer({
  storage:storage
 })

const router=express.Router();
//add bank detail
router.post("/bank",userController.addbank)
router.post("/update",userController.updatephone)    
router.post("/getdata",userController.getactive)       
router.post("/delet",userController.delet);
router.post("/getallusers",userController.getall);
router.post("/ss",userController.aa)













router.post("/adduser",userController.adduser)
router.post("/otp",userController.otp)
router.post("/parent",userController.parent)
router.post("/verify",userController.verify);
 router.post("/register",userController.register);
router.post("/get",userController.get)
router.post("/getAll",userController.getAll);


router.post("/login",userController.login);
router.post("/forgot-Password",userController.forgotPassword);
router.post("/updatePassword",userController.updatePassword);
router.put("/newPassword",userController.newPassword);
router.put("/updateProfile",userController.updateProfile);
router.put("/changePassword",userController.changePassword);
//router.post("/getAll",userController.getAll);
router.get("/delete",userController.deleteUser);
router.post("/qrcode",userController.qrCode);
router.post("/postimage",upload.single("profile"),userController.postImage);

//  router.post("/getwallet",userController.addWallet);
//  router.post("/test",userController.test);
 
    

export default router;

