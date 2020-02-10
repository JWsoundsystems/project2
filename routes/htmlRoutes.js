var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/index/:id", function (req, res) {
    console.log(req.params.id, 'id')
    db.Track.findAll({
      where: {
        '$User.firebase_unique_id$': req.params.id
      },
      order: [
        ['id', 'DESC']
      ],
      include: [
        { model: db.User, as: db.User.Users }
      ]
    }).then(function (data) {

      res.render("index", {
        tracks: data
      });
    });
  });

  app.get("/all", function (req, res) {
    db.Track.findAll({
      order: [
        ['id', 'DESC']
      ]
    }).then(function (data) {

      res.render("index", {
        tracks: data
      });
    });
  });

  app.get("/login", function (req, res) {
    keys = {
      firebase_api_key: process.env.FIREBASE_API_KEY
    }
    res.render("login", keys)
  });

  app.get("/signup", function (req, res) {

    res.render("signup")
  });

  // Load index page
  app.get("/index", function (req, res) {
    db.Track.findAll({}).then(function (data) {

      res.render("index", {
        msg: "untitled music app",
        tracks: data
      });
    });
  });
  app.get("/newtrack", function (req, res) {
    res.render("newtrack");
  });

  // Load example page and pass in an example by id
  app.get("/track/:id", function (req, res) {
    db.Track.findOne({ where: { id: req.params.id } }).then(function (data) {
      track = {
        id: data.id,
        title: data.title,
        description: data.description,
        instrument: data.instrument,
        length: data.length,
        genre: data.genre,
        bpm: data.bpm,
        key_signature: data.key_signature,
        time_signature: data.time_signature,
        sound_file: data.sound_file
      }
      // res.json(track);
      res.render("track", track);
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
