(function () {  //$http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token; http給token
    var app = angular.module('myService', ['ngQueue']);
    //var ApiUrl = 'http://192.168.0.100/api/'
    var ApiUrl = 'http://localhost:54632/api/'
    app.service('languageService', [function () {
        var vm = this;

        vm.getLanguageName = function (lan) {
            var codeString = '';
            switch (lan) {
                case 'vn':
                    codeString = 'vnname'
                    break;
                case 'tw':
                    codeString = 'name'
                    break;
                default:
                    codeString = 'name';
                    break;
            }
            return codeString;
        };
    }]);

    app.service('localStorageService', ['$http', '$rootScope', function ($http, $rootScope, $q) {
        var vm = this;

        vm.getProperty = function (propertyName) {
            var result = [];
            result = localStorage.getItem(propertyName);
            result = result || "[]";
            return angular.fromJson(result);
        };
        vm.setProperty = function (propertyName, value) {
            localStorage.setItem(propertyName, angular.toJson(value));
        };
    }]);
    app.service('foodService', ['$http', '$rootScope', function ($http, $rootScope) {
        $http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'FoodApi/'
        var typeUrl = ApiUrl + 'Type/'
        var typeDeleteUrl = ApiUrl + 'Type/Delete'
        //#region   取得資料
        vm.getList = function (token) {
            //$rootScope.Token = token;
            //$http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.gettypeList = function () {
            return $http.get(typeUrl).success(function (response) {
                return response;
            });
        };
        //#region   傳資料
        var data = {};
        vm.menuPost = function (data) {
            //傳過來id若是null表示為新增,反之則為修改
            if (data.id == null) {
                swal("完成!", "以成功儲存 " + data.name + "", "success");
                return $http({
                    method: 'POST',
                    url: url,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer  ' + $rootScope.Token
                    }
                }).success(function () {
                    //$rootScope.data.menuList = response;
                    var data = {};
                    swal(
                        {
                            title: "成功！",
                            text: "商品新增成功。",
                            type: "success"
                        }
                        , function () {
                            location.reload();
                        }
                    );
                });
            }
            else {
                return $http({
                    method: 'PUT',
                    url: url,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer  ' + $rootScope.Token
                    }
                }).success(function () {
                    //$rootScope.data.menuList = response;
                    var data = {};
                    swal(
                        {
                            title: "成功！",
                            text: "商品修改成功。",
                            type: "success"
                        }
                        , function () {
                            location.reload();
                        }
                    );
                });
            }
        };
        vm.typePost = function (data) {
            if (data.Name == null) {
                swal({
                    title: "分類名稱未填",
                    text: "",
                    type: "error",

                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "確認",
                    closeOnConfirm: false
                })
            } else {
                if (data.Type == null) {
                    swal("完成!", "以成功儲存 " + data.Typename + "", "success");
                    return $http({
                        method: 'POST',
                        url: typeUrl,
                        data: data,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer  ' + $rootScope.Token
                        }
                    }).success(function () {
                        swal(
                            {
                                title: "成功！",
                                text: "分類新增成功。",
                                type: "success"
                            }
                            , function () {
                                location.reload();
                            }
                        );
                    });
                }
                else {
                    return $http({
                        method: 'PUT',
                        url: typeUrl,
                        data: data,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer  ' + $rootScope.Token
                        }
                    }).success(function () {
                        swal(
                            {
                                title: "成功！",
                                text: "分類修改成功。",
                                type: "success"
                            }
                            , function () {
                                location.reload();
                            }
                        );
                    });
                }
            }

            //var Json = [];

        };

        //#endregion

        //region 刪除資料
        vm.typeDelete = function (data) {
            $http({
                method: 'POST',
                url: ApiUrl + 'Type/Delete?id=' + data.Type,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).then(function (response) {
            },
                function (response) {
                });
        };

        vm.menuDelete = function (data) {
            $http({
                url: ApiUrl + 'FoodApi/Delete?DelId=' + data.id,
                method: "Delete",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            })
                .then(function (response) {
                    // success
                },
                    function (response) { // optional
                        // failed
                    });
        };
    }]);
    app.service('posService', ['$http', '$rootScope', function ($http, $rootScope) {
        //$http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'posApi/'
        vm.postOffline = function (data) {
            return $http({
                method: 'POST',
                url: ApiUrl + 'posApi2/',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            });
        }
        vm.postPos = function (data) {
            return $http({
                method: 'POST',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            });
        }
        vm.getPos2Status = function (token) {

            return $http.get(ApiUrl + 'posApi2/').success(function (response) {
                return response;
            });
        };
        vm.getPosStatus = function () {
            return $http.get(url).success(function (response) {
                return response;
            });
        };
    }]);
    app.service('ReportService', ['$http', function ($http) {
        var vm = this;
        var url = ApiUrl + 'Report/'
        vm.getdata = function (data) {
            url = ApiUrl + 'Report/';
            url = url + data;
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.getchartdata = function (data) {
            url = ApiUrl + 'Report?what='
            url = url + data;
            return $http.get(url).success(function (response) {
                return response;
            });
        };

        vm.getLinkLawdata = function (data) {
            url = ApiUrl + 'LinkLaw?link=1'
            //url = url + data;
            return $http.get(url).success(function (response) {
                return response;
            });
        };

        vm.getHotdata = function (data) {
            url = ApiUrl + 'LinkLaw?Hot=1'
            //url = url + data;
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.getMonthReportdata = function (data) {
            url = ApiUrl + 'Report?month=1'
            //url = url + data;
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.getMonthChartdata = function (data) {
            url = ApiUrl + 'Report?monthchart=1'
            //url = url + data;
            return $http.get(url).success(function (response) {
                return response;
            });
        };

    }]);
    app.service('PurChaseService', ['$http', '$rootScope', function ($http, $rootScope) {
        $http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'Purchase/'
        vm.postPurchase = function (data) {
            if (data.p_id == null) {
                swal("完成!", "以成功儲存 " + data.Name + "", "success");

                $http({
                    method: 'POST',
                    url: url,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer  ' + $rootScope.Token
                    }
                }).success(function () {
                    var data = {};
                    swal(
                        {
                            title: "成功！",
                            text: "商品新增成功。",
                            type: "success"
                        }
                        , function () {
                            location.reload();
                        }
                    );
                });
            }
            else {
                $http({
                    method: 'PUT',
                    url: url,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer  ' + $rootScope.Token
                    }
                }).success(function () {
                    //$rootScope.data.menuList = response;
                    var data = {};
                    swal(
                        {
                            title: "成功！",
                            text: "商品修改成功。",
                            type: "success"
                        }
                        , function () {
                            location.reload();
                        }
                    );
                });
            }
        }
        //vm.postPurchase = function (data) {
        //    return $http.post(url, data).success(function () {
        //    });
        //}
        vm.getPurList = function () {
            return $http.get(url).success(function (response) {
                return response;
            });
        };

    }]);
    app.service('RawService', ['$http', '$rootScope', function ($http, $rootScope) {
        $http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'raw/'
        vm.RawDelete = function (NameId) {
            $http({
                url: ApiUrl + 'Raw/Delete?NameId=' + NameId,
                method: "Delete",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).then(function (response) {
                location.reload();
            },
                function (response) {
                });
        };
        vm.postRaw = function (data) {
            if (data.NameId == null) {
                swal("完成!", "以成功儲存 " + data.Name + "", "success");
                return $http({
                    url: url,
                    method: "POST",
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer  ' + $rootScope.Token
                    }
                }).success(function () {
                    //$rootScope.data.menuList = response;
                    var data = {};
                    swal(
                        {
                            title: "成功！",
                            text: "商品新增成功。",
                            type: "success"
                        }
                        , function () {
                            location.reload();
                        }
                    );
                });
            }
            else {
                return $http({
                    url: url,
                    method: "PUT",
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer  ' + $rootScope.Token
                    }
                }).success(function () {
                    var data = {};
                    swal(
                        {
                            title: "成功！",
                            text: "商品修改成功。",
                            type: "success"
                        }
                        , function () {
                            location.reload();
                        }
                    );
                });
            }
        }
        vm.editRaw = function (data) {

            $http({
                method: 'PUT',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).success(function () {
                //$rootScope.data.menuList = response;
                var data = {};
                swal(
                    {
                        title: "成功！",
                        text: "商品修改成功。",
                        type: "success"
                    }
                    , function () {
                        location.reload();
                    }
                );
            });
        }
        vm.getRawList = function () {
            return $http.get(ApiUrl + "foodapi").success(function (response) {

                return response;
            });
        };
        vm.addPqrt = function (data) {
            return $http({
                url: url,
                method: "PUT",
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).success(function (response) {
                return response;
            });
        };
        vm.minusPqrt = function (data) {
            return $http({
                url: url,
                method: "PUT",
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).success(function (response) {
                return response;
            });
        };
    }]);
    app.service('PersonService', ['$http', '$rootScope', function ($http, $rootScope) {
        $http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'Person/'
        var fireurl = ApiUrl + 'Person?AAAA=1'
        vm.getPersonList = function () {
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.getfirePersonList = function () {

            return $http.get(fireurl).success(function (response) {
                return response;
            });
        };
        vm.getPersonList = function () {
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.postPerson = function (data) {
            return $http({
                url: url,
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).success(function () {
            });
        }
        vm.MemberDelete = function (Uuid) {
            $http({
                url: ApiUrl + 'Person/Delete?Uuid=' + Uuid,
                method: "Delete",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            })
                .then(function (response) {
                    location.reload();
                },
                    function (response) {
                    });
        };
    }]);
    app.service('ShiftService', ['$http', '$rootScope', function ($http, $rootScope) {
        $http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'ShiftApi/'
        vm.getShiftList = function () {
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.postShift = function (data) {
            return $http({
                url: url,
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).success(function () {
            });
        }
    }]);
    app.service('TimeCountService', ['$http', '$rootScope', function ($http, $rootScope) {
        $http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'TimeCount/'
        vm.getCountList = function () {
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.postCount = function (data) {
            return $http({
                url: url,
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).success(function () {
            });
        }
        vm.getOneCountList = function (start, end, uuid) {
            return $http({
                url: ApiUrl + 'TimeCount?start=' + start + '&end=' + end + '&uuid=' + uuid,
                method: "Get"
            });
        }
        vm.getTotal = function (start, end, uuid) {
            return $http({
                url: ApiUrl + 'aaaaaa?start=' + start + '&end=' + end + '&uuid=' + uuid,
                method: "Get"
            });
        }
    }]);
    app.service('PrintService', ['$http', '$rootScope', function ($http, $rootScope) {
        //$http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'Print/';
        vm.getPrint = function () {
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.postPrint = function (data) {
            return $http({
                method: 'POST',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).success(function (response) {
                console.log("Success " + JSON.stringify(response));
                console.log(response.status);
            }).error(function (response) {
                console.log("Error " + JSON.stringify(response));
                console.log(response.status);
            });
        }
    }]);
    app.service('SignalRService', ['$http', '$rootScope', function ($http, $rootScope) {
        //$http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'SignalR/';

        vm.postSignalR = function (data) {
            return $http({
                method: 'POST',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            });
        }
    }]);

    app.service('TokenService', ['$http', '$rootScope', function ($http, $rootScope) {
        var vm = this;
        var url = ApiUrl + 'Token/'

        vm.TokenGotCha = function (data) {// Set the Content-Type 
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            return $http.post(url, data).success(function () {
            });
        }
    }]);
    app.service('ExpendService', ['$http', '$rootScope', function ($http, $rootScope) {
        $http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'Expend/'
        vm.Atotal = function () {
            angular.forEach(vm.ExpendList.A, function (value, key) {
                vm.Acount += vm.ExpendList.A.Count;
                vm.Atot += vm.ExpendList.A.Totle;
            });
        };
        vm.getExpend = function () {
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.postExpend = function (data) {
            return $http({
                url: url,
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).success(function () {
            });
        }
        vm.getYinYaBiao = function (start, end) {
            return $http({
                url: ApiUrl + 'Expend?start=' + start + '&end=' + end,
                method: "Get"
            });
        }
    }]);
    app.service('RoleSetService', ['$http', '$rootScope', function ($http, $rootScope) {
        //$http.defaults.headers.common.Authorization = 'Bearer  ' + $rootScope.Token;
        var vm = this;
        var url = ApiUrl + 'RoleSet/';
        vm.getRoleSet = function () {
            return $http.get(url).success(function (response) {
                return response;
            });
        };
        vm.postPrint = function (data) {
            return $http({
                method: 'POST',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + $rootScope.Token
                }
            }).success(function (response) {
                console.log("Success " + JSON.stringify(response));
                console.log(response.status);
            }).error(function (response) {
                console.log("Error " + JSON.stringify(response));
                console.log(response.status);
            });
        }
    }]);
    app.service('DataService', ['$http', '$rootScope', function ($http, $rootScope) {
        var vm = this;
        var url = ApiUrl + 'data/'
        vm.getTokenRootScope = function (token) {
            $rootScope.Token = token;
            return $http.get(url).success(function (response) {
                return response;
            });
        };
    }]);
}
)();