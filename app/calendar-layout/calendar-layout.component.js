'use strict';

angular
  .module('calendarLayout')
  .component('calendarLayout', {
    templateUrl: 'calendar-layout/calendar-layout.template.html',
  });

angular
  .module('calendarLayout')
  .controller('MonthlyController', ['$scope', 'moment', '$http',
    function monthlyController($scope, moment, $http) {
      $scope.dayNames = ["일", "월", "화", "수", "목", "금", "토"];
      // 이름 변경하기. (month -> )
      $scope.month = moment();

      $scope.badgeEngToKor = {
        'start': '시',
        'end': '끝'
      };

      $http
        .get('data/postings'+$scope.month.month()+'.json')
        .then(function(response) {
          $scope.postings = response.data;
          // console.log($scope.postings);

          $scope.$watch('month', function() {
            ($scope.$$phase || $scope.$root.$$phase) 
            ? _buildMonth($scope, $scope.start, $scope.month, $scope.postings) 
            : $scope.$apply(_buildMonth($scope, $scope.start, $scope.month, $scope.postings));
          });
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
  ]);

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
  var days = [];
  
  for (var i = 0; i < 7; i++) {
    days.push({
      name: date.format("dd").substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), "day"),
      date: date,
      startPostings: getIncludedPostingsAtDay(date, 'start', postings),
      endPostings: getIncludedPostingsAtDay(date, 'end', postings),
      postings: getIncludedPostingsAtDay(date, 'start', postings).concat(getIncludedPostingsAtDay(date, 'end', postings)),
    });

    date = date.clone();
    date.add(1, "d");
  }

  console.log(days);
  return days;
};

function getIncludedPostingsAtDay(date, type, postings) {
  var result = postings.filter(function(posting) {
    return moment(posting[type === "start" ? "start_time" : "end_time"])
    .format("yyyyMMDD") === date.format("yyyyMMDD");
  });

  result.forEach(function(posting) {
    posting.badge = type;
  });

  return result.sort((a, b) => a.name < b.name ? -1 : a.name < b.name ? 1 : 0);
};
