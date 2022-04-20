'use strict';

angular
  .module('calendarApp', [
    'ngRoute',
    'ngSanitize',,
    'angularMoment',
    'calendarLayout',
    'modal'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'main/main.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
