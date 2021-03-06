'use strict';

var DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

var BADGE_ENG_TO_KOR = {
  'start': '시',
  'end': '끝'
}

angular
  .module('calendar')
  .component('calendar', {
    templateUrl: 'calendar/calendar.template.html',
  })
  .controller('CalendarController', ['$scope', '$rootScope', 'moment', '$http',
    function CalendarController($scope, $rootScope, moment, $http) {
      $scope.dayNames = DAY_NAMES;
      $scope.focusedMonth = moment();
      $scope.badgeEngToKor = BADGE_ENG_TO_KOR;

      $scope.checkIsToday = function(date) {
        var result = date.format("YYYY.MM.DD") === moment().format("YYYY.MM.DD");
        return result ? "today-content" : "";
      }

      $scope.openPostingModal = function(posting) {
        $rootScope.sendPostingToModal(posting)
      };

      $scope.$watch('focusedMonth', function () {
        $http
        .get('data/postings'+$scope.focusedMonth.month()+'.json')
        .then(function(response) {
          $scope.postings = response.data;
          $scope.$watch('month', function() {
            ($scope.$$phase || $scope.$root.$$phase) 
            ? _buildMonth($scope, $scope.start, $scope.focusedMonth, $scope.postings) 
            : $scope.$apply(_buildMonth($scope, $scope.start, $scope.focusedMonth, $scope.postings));
          });
        })
      });

      $scope.$watch('focusedMonth', function getStartDate() {
        $scope.start = $scope.focusedMonth.clone().date(1).day(0);
      });

      $scope.updateMonth = function (type) {
        $scope.focusedMonth = type === "previous" 
        ? moment($scope.focusedMonth).subtract(1, "month")
        : moment($scope.focusedMonth).add(1, "month");
      };
    }
  ])

function _buildMonth($scope, start, month, postings){
  $scope.weeks = [];
  var done = false, date = start.clone(), monthIndex = date.month(), count = 0;

  while (!done) {
    $scope.weeks.push({ days: _buildWeek(date.clone(), month, postings) });
    date.add(1, "w"); 
    done = count++ > 2 && monthIndex !== date.month(); 
    monthIndex = date.month();
  } 
};

function _buildWeek(date, month, postings) {
  let days = [];
  let newPostingsArr = postings.slice();
  
  for (var i = 0; i < 7; i++) {
    days.push({
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), "day"),
      date: date,
      postings: _getIncludedPostingsAtDay(date, newPostingsArr),
    });

    date = date.clone();
    date.add(1, "d");
  }

  return days;
};

function _getIncludedPostingsAtDay(date, postings) {
  var newPostings = _.cloneDeep(postings);

  var result = newPostings.filter(function(posting) {
    if(moment(posting.start_time).format("yyyyMMDD") === date.format("yyyyMMDD")) {
      posting.badge = "start";
      return posting;
    }

    if(moment(posting.end_time).format("yyyyMMDD") === date.format("yyyyMMDD")) {
      posting.badge = "end";
      return posting;
    } 
  });

  result.sort(function(a, b) {
    if (a.badge < b.badge) return 1;
    else if (a.badge > b.badge) return -1;
    else if (a.name > b.name) return 1;
    else if (a.name < b.name) return -1;
  });

  return result;
};
