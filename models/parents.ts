'use strict';
import {
  Model
}  from 'sequelize';
interface UserOtpAttributes{
 userId:number;
 fname:string;
 mname:string;

 
}
module.exports = (sequelize:any, DataTypes:any) => {
  class  parent extends Model<UserOtpAttributes>
  implements UserOtpAttributes {
    userId!:number;
    fname!:string;
    mname!:string;
   
    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  parent.init({
    userId: {type:DataTypes.INTEGER},
    mname: {type:DataTypes.STRING},
    fname: {type:DataTypes.STRING},
 
 
  }, {
    sequelize,
    modelName: 'parents',
  });
  return  parent;
};
