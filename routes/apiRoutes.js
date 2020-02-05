var db = require("../models");

module.exports = function (app) {

  // Get all tracks
  app.get("/api/tracks", function (req, res) {
    db.Track.findAll({
      order: [
        ['id', 'DESC']
      ]
    }).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new track
  app.post("/api/tracks", function (req, res) {
    db.Track.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });


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


  var S3_BUCKET = process.env.S3_BUCKET;
  S3_KEY = process.env.AWS_ACCESS_KEY_ID;
  ; S3_SKEY = process.env.AWS_SECRET_ACCESS_KEY_ID





  //  Respond to GET requests to /sign-s3.
  //  Upon request, return JSON containing the temporarily-signed S3 request and
  //  the anticipated URL of the image.

  app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3({
      accessKeyId: S3_KEY,
      secretAccessKey: S3_SKEY
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


  app.get('/track/api/getTrack', (req, res) => {
    const s3 = new aws.S3({
      accessKeyId: S3_KEY,
      secretAccessKey: S3_SKEY,
      region: 'us-west-1'
    });

    s3.getObject({ Bucket: S3_BUCKET, Key: req.query['file-name'] }, function (error, data) {
      if (error) {
        console.log('error', error);
        res.end();
      }


      var attachment = data.Body.toString('base64');
      console.log(attachment);

      const returnData = {
        base64: attachment
      }

      res.json(returnData);
      res.end();
    })
  })





  // /*
  //  * Respond to POST requests to /submit_form.
  //  * This function needs to be completed to handle the information in
  //  * a way that suits your application.
  //  */
  // app.post('/save-details', (req, res) => {
  //   // TODO: Read POSTed form data and do something useful
  // });

};
