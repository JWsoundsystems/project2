module.exports = function (sequelize, DataTypes) {
  var Track = sequelize.define("Track", {
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    description: DataTypes.TEXT,
    instrument: DataTypes.STRING,
    length: DataTypes.INTEGER,
    genre: DataTypes.TEXT,
    bpm: DataTypes.INTEGER,
    key_signature: DataTypes.TEXT,
    time_signature: DataTypes.TEXT,
    sound_file: DataTypes.TEXT,

  });

  Track.associate = function (models) {
    Track.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  }
  return Track;
};
