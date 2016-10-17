/**
 * Created by gyaneshwar on 12/10/16.
 */

(function () {
    var app = angular.module('weather-forecast', []);
    app.factory('geoLocationService', ['$q', '$window', function ($q, $window) {
        'use strict';
        function getCurrentPosition() {
            var deferred = $q.defer();
            if (!$window.navigator.geolocation) {
                deferred.reject('Geolocation not supported.');

            } else {
                $window.navigator.geolocation.getCurrentPosition(
                    function (position) { //user gave the access to location
                        deferred.resolve(position);
                    },
                    function (err) { //when user deny to give access to location
                        deferred.reject(err);
                    });
            }
            return deferred.promise;
        }

        return {
            getCurrentPosition: getCurrentPosition
        };
    }]);

    app.controller('WeatherForecastController', ['$http', 'geoLocationService', function ($http, geoLocationService) {
        var weatherD = this;
        weatherD.details = {};
        weatherD.isLocationAavilable = false;
        weatherD.location = {};
        weatherD.cityDetails = {
            postCode :'',
            countryCode:'GB'
        };
        geoLocationService.getCurrentPosition().then(function (position) { //got the position
                weatherD.isLocationAavilable = true;
                weatherD.location = position;
                var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + weatherD.location.coords.latitude + "&lon=" + weatherD.location.coords.longitude + "&&APPID=1d17b1af6b4ac35d6000daaf9dcbd492&units=metric";
                $http.get(url).success(function (data) {
                    weatherD.details = data;
                });
            }
        );

        weatherD.getTheWeatherDetails = function(){
            var postCode = weatherD.cityDetails.postCode; //get these values from ng model
            var countryCode = weatherD.cityDetails.countryCode;
            var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + postCode + "," +countryCode+ "&&APPID=1d17b1af6b4ac35d6000daaf9dcbd492&units=metric";
            $http.get(url).success(function(data) {
                weatherD.isLocationAavilable = true;
                weatherD.details = data;
            });
        }

    }]);
})();

