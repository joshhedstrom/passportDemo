const User = function(sequelize, DataTypes) {
    return sequelize.define('user', {
        localemail: DataTypes.STRING,
        localpassword: DataTypes.STRING,
        facebookid: DataTypes.STRING,
        facebooktoken: DataTypes.STRING,
        facebookemail: DataTypes.STRING,
        facebookname: DataTypes.STRING,
        googleid: DataTypes.STRING,
        googletoken: DataTypes.STRING,
        googleemail: DataTypes.STRING,
        googlename: DataTypes.STRING
    });
}



module.exports = User;

// getterMethods: {
//     someValue: function() {
//         return this.someValue;
//     }
// },
// setterMethods: {
//     someValue: function(value) {
//         this.someValue = value;
//     }