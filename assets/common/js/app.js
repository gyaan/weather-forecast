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
                        console.log(position);
                        deferred.resolve(position);
                    },
                    function (err) { //when user deny to give access to location
                        console.log(err);
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
        weatherD.cityDetails = {};
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

    /*var weatherForecastDetails = {
     "coord": {"lon": 77.6, "lat": 12.98},
     "weather": [{"id": 802, "main": "Clouds", "description": "scattered clouds", "icon": "03n"}],
     "base": "stations",
     "main": {
     "temp": 25.09,
     "pressure": 926.52,
     "humidity": 49,
     "temp_min": 25.09,
     "temp_max": 25.09,
     "sea_level": 1022.66,
     "grnd_level": 926.52
     },
     "wind": {"speed": 3.91, "deg": 34.5016},
     "clouds": {"all": 44},
     "dt": 1476461105,
     "sys": {"message": 0.0068, "country": "IN", "sunrise": 1476405591, "sunset": 1476448244},
     "id": 1277333,
     "name": "Bangalore",
     "cod": 200
     }
     */
})();

