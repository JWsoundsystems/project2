module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        firebase_unique_id: DataTypes.STRING

    });

    User.associate = function (models) {

        User.hasMany(models.Track, {});
    }
    return User;
};