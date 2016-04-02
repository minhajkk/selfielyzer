/**
 * Created by minhaj
 */

'use strict';

//============================================================================================ Service
selfielyzer.factory('SelfielyzerService',function($http, $q) {

  var SelfielyzerService = {};


  /**
   *
   * @param data
   */
  SelfielyzerService.login = function (data) {

  };

  SelfielyzerService.getPicture = function(options) {
    var q = $q.defer();

    navigator.camera.getPicture(function(result) {
      // Do any magic you need
      q.resolve(result);
    }, function(err) {
      q.reject(err);
    }, options);

    return q.promise;
  };

  return SelfielyzerService;

});
