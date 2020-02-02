var db = require("../models");

module.exports = function (app) {
  // Get all examples
  // app.get("/api/examples", function (req, res) {
  //   db.Example.findAll({}).then(function (dbExamples) {
  //     res.json(dbExamples);
  //   });
  // });
  // Get all tracks
  app.get("/api/tracks", function (req, res) {
    db.Track.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  // app.post("/api/examples", function (req, res) {
  //   db.Example.create(req.body).then(function (dbExample) {
  //     res.json(dbExample);
  //   });
  // });

  // Create a new track
  app.post("/api/tracks", function (req, res) {
    db.Track.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  // app.delete("/api/examples/:id", function (req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
  //     res.json(dbExample);
  //   });
  // });

  // Delete an track by id
  app.delete("/api/tracks/:id", function (req, res) {
    db.Track.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });




  // these are the routes for the file upload to s3:
  const aws = require('aws-sdk');

  aws.config.region = 'us-west-1';

  //  Load the S3 information from the environment variables.

  const local = require('../keys')
  var S3_BUCKET;
  if (process.env.S3_BUCKET) { S3_BUCKET = process.env.S3_BUCKET } else { S3_BUCKET = 'ucbx-proj2-tracks' };



  /*
   * Respond to GET requests to /sign-s3.
   * Upon request, return JSON containing the temporarily-signed S3 request and
   * the anticipated URL of the image.
   */
  app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3({
      accessKeyId: local.k,
      secretAccessKey: local.s
    });
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
  });

  /*
   * Respond to POST requests to /submit_form.
   * This function needs to be completed to handle the information in
   * a way that suits your application.
   */
  app.post('/save-details', (req, res) => {
    // TODO: Read POSTed form data and do something useful
  });

};
