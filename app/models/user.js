// file app/models/user.js
// define the model for User 


// load the things we need

var bcrypt   = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    localemail        : DataTypes.STRING,
    localpassword     : DataTypes.STRING,
    facebookid        : DataTypes.STRING,
    facebooktoken     : DataTypes.STRING,
    facebookemail     : DataTypes.STRING,
    facebookname      : DataTypes.STRING,
    googleid          : DataTypes.STRING,
    googletoken       : DataTypes.STRING,
    googleemail       : DataTypes.STRING,
    googlename        : DataTypes.STRING
  }, 
  {
    classMethods: {
      generateHash : function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },            
    },
      instanceMethods: {            
      validPassword : function(password) {
        return bcrypt.compareSync(password, this.localpassword);
      }
    }
  });
}