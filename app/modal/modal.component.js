'use strict';

angular
  .module('modal')
  .component('modal', {
    templateUrl: 'modal/modal.template.html',
  })
  .controller('ModalController', ['$scope', 
    function modalController($scope) {
      $scope.isOpenedModal = false;

      $scope.closeModal = function() {
        $scope.isOpenedModal = false;
      };

      $scope.getPeriod = function(start, end) {
        var formText = "yyyy.MM.DD HH:MM";
        return moment(start).format(formText) + ' ~ ' + moment(end).format(formText);
      };

      $scope.getDiffTime = function() {
        if($scope.posting) {
          return calculateDiffFromToday($scope.posting.end_time);
        }
      };

      $scope.$on("postingData",function(e, data){
        $scope.isOpenedModal = true;
        $scope.posting = data;
      });        
    }
]);

function calculateDiffFromToday(date) {
  var today = moment();

  var diffDate = moment(date).diff(today, "d");
  if (diffDate > 0) return `${diffDate}일 전`;
  if (diffDate < 0) return `${Math.abs(diffDate)}일 지남`;

  var diffHour = moment(date).diff(today, "hour");
  if (diffHour > 0) return `${diffHour}시간 전`;
  if (diffHour < 0) return `${Math.abs(diffHour)}시간 지남`;

  var diffMinute = moment(date).diff(today, "minute");
  if (diffMinute > 5) return `${diffMinute}분 전`;
  if (diffMinute > 0) return `${diffMinute}분 이내 전`;
  if (diffMinute < 0) return `${Math.abs(diffMinute)}분 지남`;

  return "현재 마감시간입니다.";
};


