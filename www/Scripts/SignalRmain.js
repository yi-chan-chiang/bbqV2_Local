(function () {
    var app = angular.module('myApp', []);
    app.service('localStorageService', [function () {
        var vm = this;

        vm.getProperty = function (propertyName) {
            var result = [];
            result = localStorage.getItem(propertyName);
            result = result || "[]";
            return angular.fromJson(result);
        };

        //vm.setProperty = function (propertyName, value) {
        //    localStorage.setItem(propertyName, angular.toJson(value));
        //};
    }]);

    app.controller('CheckController', ['localStorageService', '$filter', '$rootScope', '$scope', '$timeout', function (localStorageService, $filter, $rootScope, $scope, $timeout) {
            var vm = this;
            $rootScope.data = {};
            $rootScope.data.showList = localStorageService.getProperty("showList") || [];
            $rootScope.data.orderList = { data: [], spicy: 0, pay: 1, phone: 0 };
            vm.orderList = $rootScope.data.orderList;
            vm.showList = $rootScope.data.showList;
            $scope.numberCount = function (list) {
                var total = 0;
                angular.forEach(list, function (value, key) {
                    total += value.count;
                });
                return total;
            };
            $scope.totalCount = function (list) {
                var total = 0;
                angular.forEach(list, function (value, key) {
                    total += value.price * value.count;
                });
                return total;
            };
    }]);
})();