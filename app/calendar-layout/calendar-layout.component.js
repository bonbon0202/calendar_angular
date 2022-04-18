'use strict';

angular
  .module('calendarLayout')
  .component('calendarLayout', {
    templateUrl: 'calendar-layout/calendar-layout.template.html',
  });

angular
  .module('calendarLayout')
  .controller('MonthlyController', ['$scope', 'moment', 
    function monthlyController($scope, moment) {
      $scope.dayNames = ["일", "월", "화", "수", "목", "금", "토"];
      $scope.month = moment();

      $scope.$watch('month', function getStartDate() {
        $scope.start = $scope.month.clone().date(1).day(0);
      })

      $scope.$watch('month', function() {
        ($scope.$$phase || $scope.$root.$$phase) 
        ? _buildMonth($scope, $scope.start, $scope.month) 
        : $scope.$apply(_buildMonth($scope, $scope.start, $scope.month));
      });

      $scope.updateMonth = function (type) {
        $scope.month = type === "previous" 
        ? moment($scope.month).subtract(1, "month")
        : moment($scope.month).add(1, "month");

      }
    }
  ]);

function _buildMonth($scope, start, month){
  $scope.weeks = [];
  var done = false, date = start.clone(), monthIndex = date.month(), count = 0;

  while (!done) {
    $scope.weeks.push({ days: _buildWeek(date.clone(), month) });
    date.add(1, "w"); 
    done = count++ > 2 && monthIndex !== date.month(); 
    monthIndex = date.month();
  } 
}

function _buildWeek(date, month) {
  var days = [];

  for (var i = 0; i < 7; i++) {
    days.push({
      name: date.format("dd").substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), "day"),
      date: date
    });

    date = date.clone();
    date.add(1, "d");
  }

  return days;
}
