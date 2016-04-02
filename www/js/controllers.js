"use strict";
/**
 * Created by minhaj
 */

//============================================================================================ Home Controller
selfielyzer.controller('HomeCtrl', function($scope, $stateParams,SelfielyzerService, $state, $http, $cordovaCamera){

  function makeblob (dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }


  $scope.takePhoto = function () {

    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
      cameraDirection: 1
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      $scope.expression = "";

      $scope.imgURI = "data:image/jpeg;base64," + imageData;

      $http({
        url: "https://api.projectoxford.ai/emotion/v1.0/recognize",
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "Ocp-Apim-Subscription-Key": ""
        },
        data: makeblob("data:image/jpeg;base64," + imageData)
      })
      .then(function(response) {
          var max = Object.keys(response.data[0].scores).reduce(function(m, k){
            return response.data[0].scores[k] > m ? response.data[0].scores[k] : m
          }, -Infinity);

          var maxObj = [];

          angular.forEach(response.data[0].scores, function(value, key) {
            if(value == max) {
              this.push(key);
            }
          }, maxObj);

          console.log("results->> " + maxObj[0]);
          $scope.expression = maxObj[0];
      },
      function(response) { // optional
        console.log("failed");
        console.log(response.data);
      });

  }, function (err) {
      // An error occured. Show a message to the user
      console.log("err -> " + err);
    });
  };

});
