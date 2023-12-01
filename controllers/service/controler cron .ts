import { hash, hashSync } from 'bcryptjs';
import { Request, Response } from 'express';
let referralCodeGenerator = require('referral-code-generator');
var otpGenerator = require('otp-generator');
const QRCode = require('qrcode');
const multer = require('multer');
var cron = require('node-cron')



import { v4 as uuidv4 } from "uuid";

import bcryptjs = require("bcryptjs");
bcryptjs.genSalt(10, function (err, salt) {
    bcryptjs.hash("B4c0/\/", salt, function (err, hash) {
        // Store hash in your password DB.
    });
});
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
import { Console, error } from 'console';
import { TokenExpiredError } from 'jsonwebtoken';
import { create } from 'domain';
class job {
  //cron jobs spin 24 hours change time 
async cron(){
    var sql = `SELECT a.username, a.userId,a.firstname
               FROM Users a
               WHERE a.id = 1`; 
    var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });
    console.log("resulthjdhdjk",result)

    

}


// hr ik mint badh cron job check kruge jis da active 1 hai mtlb jisnai apna phneno.cahnge kita haia active 1 hai crin job 24 hours badh 
// usda active 2 kr duge ki phone number hai jhda o chage ho chuka hai 
// and jisda active zero hai mtlb  jdo user reg kreyar  c active  0 mtlb usda phone no. thik hai usda no. nhi update kreya apna 
async scheduleUpdateAfter24Hours(){
  const twentyFourHoursLater = new Date();
  twentyFourHoursLater.setDate(twentyFourHoursLater.getDate() - 1);
  try {
    // Query the database for users whose 'updatedAt' is due for an update
    const usersToUpdate = await db.users.findAll({
      where: {
        updatedAt: {
          [db.Sequelize.Op.lte]: twentyFourHoursLater,
        },
        active: 1, // Only update users with 'active' set to 1
      },
    });
    // Update 'updatedAt' and set 'active' to 2 for each user
    for (const user of usersToUpdate) {
      await user.update({
        updatedAt: new Date(),
        active: 2,
      });
      console.log(`User's 'updatedAt' and 'active' status updated for user: ${user.id}`);
    }
  } catch (error) {
    console.error('Error updating users:', error);
  }
}}
  export default new job();
