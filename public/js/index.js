// Get references to page elements

// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
var $trackTitle = $("#track-title");
var $trackDescription = $("#track-description");
var $trackLength = $("#track-length");
var $trackGenre = $("#track-genre");
var $trackInstrument = $("#track-instrument");
var $trackBpm = $("#track-bpm");
var $trackKeySignature = $("#track-key-signature");
var $trackTimeSignature = $("#track-time-signature");
var $trackSoundFile = $("#track-sound-file");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function (example) {
    // var data;
    console.log('we are in saveExample now, gonna start the ajax call')
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/tracks",
      data: JSON.stringify(example),
      success: function (resp) {
        console.log('we are in success')
        console.log('resp', resp)
        return resp.id

      }
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/tracks",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/tracks/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (track) {
      var $a = $("<a>")
        .text(track.title)
        .attr("href", "/track/" + track.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": track.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
  event.preventDefault();

  var track = {
    title: $trackTitle.val().trim(),
    description: $trackDescription.val().trim(),
    instrument: $trackInstrument.val().trim().toLowerCase(),
    length: parseInt($trackLength.val().trim()),
    genre: $trackGenre.val().trim().toLowerCase(),
    bpm: parseInt($trackBpm.val().trim()),
    key_signature: $trackKeySignature.val().trim(),
    time_signature: $trackTimeSignature.val().trim(),
    // sound_file: $trackSoundFile.val().trim()
  };

  if (!(track.title && track.description && track.instrument && track.length && track.genre && track.bpm && track.key_signature && track.time_signature)) {
    alert("You must fill out all the fields!");
    return;
  }
  /*
            Function to carry out the actual PUT request to S3 using the signed request from the app.
          */
  function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('FILE WAS UPLOADED!')
        }
        else {
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

  /*
    Function to get the temporary signed request from the app.
    If request successful, continue to upload the file using this signed
    request.
  */
  function getSignedRequest(file, aws_file_name) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${aws_file_name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          uploadFile(file, response.signedRequest, response.url);
        }
        else {
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  /*
   Function called when file input updated. If there is a file selected, then
   start upload procedure by asking for a signed request from the app.
  */
  function initUpload(file, aws_file_name) {
    // const files = document.getElementById('file-input').files;
    // const file = files[0];
    if (file == null) {
      return alert('No file selected.');
    }
    getSignedRequest(file, aws_file_name);
  }
  API.saveExample(track)
    .then(function (data) {
      // refreshExamples(); 
      console.log('return from then of saveExample', data.id, $("#audioFileChooser").prop('files')[0]);
      var fileToUpload = $("#audioFileChooser").prop('files')[0];
      initUpload(fileToUpload, data.id + "." + fileToUpload.name.split(".").pop());

    });

  $trackTitle.val("");
  $trackDescription.val("");
  $trackInstrument.val("");
  $trackLength.val("");
  $trackGenre.val("");
  $trackBpm.val("");
  $trackKeySignature.val("");
  $trackTimeSignature.val("");
  $trackSoundFile.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
