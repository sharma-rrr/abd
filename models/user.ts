'use strict';
import {
  Model
}  from 'sequelize';
interface UserOtpAttributes{
 phonenumber:string;
 fname:string;
 mname:string;
 accontno:number
 cvc:number
 expiry:string;
 debitcardno:string;
 active:number;

 
}
module.exports = (sequelize:any, DataTypes:any) => {
  class  user extends Model<UserOtpAttributes>
  implements UserOtpAttributes {
    phonenumber!:string;
    fname!:string;
    mname!:string;
    accontno!:number
    cvc!: number;
    expiry!: string;
    debitcardno!:string;
    active!:number
   
    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    phonenumber: {type:DataTypes.STRING},
    mname: {type:DataTypes.STRING},
    fname: {type:DataTypes.STRING},
    accontno:{type:DataTypes.INTEGER},
    cvc:{type:DataTypes.INTEGER},
    expiry:{type:DataTypes.STRING},
    debitcardno:{type:DataTypes.STRING},
    active:{type:DataTypes.INTEGER}

 
 
  }, {
    sequelize,
    modelName: 'users',
  });
  return  user;
};
