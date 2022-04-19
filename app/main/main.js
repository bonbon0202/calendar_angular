'use strict';

angular
  .module('calendarApp')
  .controller('homeController', 
    function($rootScope){
      $rootScope.sendPostingToModal = function (posting) {
          $rootScope.$broadcast('postingData', posting)
      }
});