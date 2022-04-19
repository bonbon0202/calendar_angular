'use strict';

angular
  .module('calendarLayout')
  .component('calendarLayout', {
    templateUrl: 'calendar-layout/calendar-layout.template.html',
  })
  .controller('CalendarController', ['$scope', '$rootScope', 'moment', '$http',
    function CalendarController($scope, $rootScope, moment, $http) {
      $scope.dayNames = ["일", "월", "화", "수", "목", "금", "토"];
      // TODO : 이름 변경하기. (month -> )
      $scope.month = moment();

      $scope.badgeEngToKor = {
        'start': '시',
        'end': '끝'
      };

      $scope.openPostingModal = function(posting) {
        $rootScope.sendPostingToModal(posting)
      };

      $scope.$watch('month', function () {
        $http
        .get('data/postings'+$scope.month.month()+'.json')
        .then(function(response) {
          $scope.postings = response.data;
          $scope.$watch('month', function() {
            ($scope.$$phase || $scope.$root.$$phase) 
            ? _buildMonth($scope, $scope.start, $scope.month, $scope.postings) 
            : $scope.$apply(_buildMonth($scope, $scope.start, $scope.month, $scope.postings));
          });
        })
      });

      $scope.$watch('month', function getStartDate() {
        $scope.start = $scope.month.clone().date(1).day(0);
      });

      $scope.updateMonth = function (type) {
        $scope.month = type === "previous" 
        ? moment($scope.month).subtract(1, "month")
        : moment($scope.month).add(1, "month");
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
      name: date.format("dd").substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), "day"),
      date: date,
      postings: getIncludedPostingsAtDay(date, newPostingsArr),
    });

    date = date.clone();
    date.add(1, "d");
  }

  return days;
};

function getIncludedPostingsAtDay(date, postings) {
  var newPostings = JSON.parse(JSON.stringify(postings));

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
