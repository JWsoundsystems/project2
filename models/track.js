module.exports = function (sequelize, DataTypes) {
  var Track = sequelize.define("Track", {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    instrument: DataTypes.STRING,
    length: DataTypes.INTEGER,
    genre: DataTypes.TEXT,
    bpm: DataTypes.INTEGER,
    key_signature: DataTypes.TEXT,
    time_signature: DataTypes.TEXT,
    sound_file: DataTypes.TEXT,

  });
  return Track;
};
