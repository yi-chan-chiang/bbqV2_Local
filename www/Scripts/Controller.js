(function () {
    var app = angular.module('myController', ['ngIdle.idle']);
    app.config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
        IdleProvider.idle(3600);
        IdleProvider.timeout(3600);
        KeepaliveProvider.interval(100);
    }]);

    app.run(['Idle', '$rootScope', function (Idle, $rootScope) {
        $rootScope.$on('IdleTimeout', function () {
            console.log("IdleTimeout");
            angular.element(document.getElementById('Container')).scope().setTab(999);
            angular.element(document.getElementById('Container')).scope().Login();
        })

    }]);

    app.controller('MainController', ['Idle', 'localStorageService', 'DataService', '$filter', '$timeout', '$rootScope', 'languageService', 'foodService', '$scope', 'ReportService', 'uuid', 'TokenService', '$window', function (Idle, localStorageService, DataService, $filter, $timeout, $rootScope, languageService, foodService, $scope, ReportService, uuid, TokenService, $window) {
        var vm = this;
        $rootScope.data = {};
        //功能模組化 start
        vm.AAP = localStorageService.getProperty("AAP")
        vm.BBP = localStorageService.getProperty("BBP")
        vm.CCP = localStorageService.getProperty("CCP")
        vm.DDP = localStorageService.getProperty("DDP")
        vm.EEP = localStorageService.getProperty("EEP")
        vm.AP = localStorageService.getProperty("AAP")
        vm.BP = localStorageService.getProperty("BBP")
        vm.CP = localStorageService.getProperty("CCP")
        vm.DP = localStorageService.getProperty("DDP")
        vm.EP = localStorageService.getProperty("EEP")
        //功能模組化 end !
        vm.idontKnow = function () {
            console.log(87);
        }
        vm.RawChange = function () {
            swal({
                title: '猜數字',
                text: '請在1~999之間猜一個數字(錯誤超過三次將會郵件通知老闆)',
                type: 'input',
                inputPlaceholder: '請輸入答案',
                showCancelButton: true,
                confirmButtonText: '作答',
                cencelButton: '取消',
                closeOnConfirm: false,
                closeOnCancel: false,
            }, function (answer) {
                if (!answer) {
                    swal({
                        title: '取消',
                        text: '這麼簡單的題目，你也不回答嗎？！',
                        type: 'warning'
                    });
                } else {
                    if (answer === "boss") {
                        swal({
                            title: '嗨，老闆！',
                            text: '你真是棒！',
                            type: 'success'
                        }, function () {

                            $("#settab11").click();

                        });
                    } else {
                        swal({
                            title: '答錯囉！',
                            text: '再想想看，很簡單的！',
                            type: 'error'
                        });
                    }
                }
            });

        }
        $rootScope.data.decoded = localStorageService.getProperty("Token") || {};
        if ($rootScope.data.decoded == "") { $rootScope.data.decoded = {}; }
        console.log(Object.keys($rootScope.data.decoded).length);
        if (Object.keys($rootScope.data.decoded).length > 0) {
            foodService.getList($rootScope.data.Token).then(function (response) {
                $rootScope.data.menuList = response.data;
                localStorageService.setProperty("menuList", $rootScope.data.menuList);
                Idle.watch();
                localStorageService.setProperty("Token", $rootScope.data.decoded);
                $timeout(function () {
                    $scope.setTab(1);
                }, 100);
            }).catch(function (response) {
                console.log('nope', response.status);
                $rootScope.data.menuList = localStorageService.getProperty('menuList');
                swal("bonbon", "bonbon", "error");
            });
        }
        else {
            $scope.Login = function () {
                $scope.setTab(999);
                swal({
                    title: '登入',
                    html: true,
                    text: "帳號: <input type='text' id='acc'style='border-radius: 5px';><br>密碼: <input type='password' id='pas' style='border-radius: 5px'>",
                    confirmButtonText: '登入',
                    closeOnConfirm: false,
                }, function () {
                    vm.User = $('#acc').val();
                    vm.Pass = $('#pas').val();
                    vm.LoginData = 'UserName=' + vm.User + '&PassWord=' + vm.Pass;
                    console.log(vm.LoginData);
                    TokenService.TokenGotCha(vm.LoginData).then(function (TokenRes) {
                        console.log('Token', TokenRes.data);
                        vm.TokResults = TokenRes.data.Result;
                        if (TokenRes.data.Result === true) {
                            $rootScope.data.Result = TokenRes.data.Result;
                            $rootScope.data.Token = TokenRes.data.token;
                            $rootScope.data.decoded = jwt_decode(TokenRes.data.token);
                            //decode {Exp: "2017-10-05 12:42:17", Role: "Admin", User: "name", RoleDetail: "Admin"}
                            swal({
                                title: '登入成功',
                                text: '你登入成功了',
                                type: 'success'
                            }, function () {
                                DataService.getTokenRootScope($rootScope.data.Token).then(function (res7749) {
                                    foodService.getList($rootScope.data.Token).then(function (response) {
                                        console.log('hi');
                                        $rootScope.data.menuList = response.data;
                                        localStorageService.setProperty("menuList", $rootScope.data.menuList);
                                        Idle.watch();
                                        localStorageService.setProperty("Token", $rootScope.data.decoded);
                                    }).catch(function (response) {
                                        console.log('nope', response.status);
                                        $rootScope.data.menuList = localStorageService.getProperty('menuList');
                                    });
                                });
                                $timeout(function () {
                                    $scope.setTab(1);
                                }, 100);
                            });
                        }
                    }).catch(function () {
                        swal({
                            title: '登入失敗',
                            text: '請重新登入',
                            type: 'error'
                        }, function () {
                            console.log(87);
                            $timeout(function () {
                                $scope.Login();
                            }, 1000);
                        });
                    });
                });
            };
            $timeout(function () { $scope.Login(); }, 10);
        }
        //IdleProvider.idle(5);
        //IdleProvider.timeout(5);
        //KeepaliveProvider.interval(10);
        //console.log("online", navigator.onLine);
        $rootScope.data.checkList = localStorageService.getProperty("checkList") || [];
        $rootScope.data.offline = localStorageService.getProperty("offlineCheckList");
        $rootScope.data.CustomDiscount = localStorageService.getProperty("CustomDiscount") || 90;
        $rootScope.data.orderList = { data: [], spicy: 0, pay: 0, phone: 0, discount: 0, spicyPackage: 0, spicyPackage2: 0 };
        $rootScope.data.checkId = localStorageService.getProperty("checkId") || 0;
        $rootScope.data.offlineCount = localStorageService.getProperty("offlineCount") || 0;
        //console.log('mainCid', $rootScope.data.checkId);
        $rootScope.data.language = localStorageService.getProperty("language") || 'tw';
        $rootScope.swal = swal;
        $rootScope.data.pay = 0;
        //vm.hash = uuid.v4();
        //console.log('uuid',vm.hash);
        vm.isLogin = true;
        vm.isOrder = false;
        vm.isCheck = false;
        vm.isOption = false;
        vm.isPurchase = false;
        vm.isPerson = false;
        vm.isChart = false;
        vm.isExpend = false;
        vm.isChenXian = false;
        vm.addType = false;
        vm.isRaw = false;

        $scope.setTab = function (index) {

            switch (index) {
                case 1:
                    vm.isOrder = true;
                    vm.isCheck = false;
                    vm.isOption = false;
                    vm.isPurchase = false;
                    vm.isPerson = false;
                    vm.isChart = false;
                    vm.isExpend = false;
                    vm.isLogin = false;
                    vm.isChenXian = false;
                    vm.addType = false;
                    vm.isRaw = false;

                    break;
                case 2:
                    vm.isOrder = false;
                    vm.isCheck = true;
                    vm.isOption = false;
                    vm.isPurchase = false;
                    vm.isPerson = false;
                    vm.isChart = false;
                    vm.isExpend = false;
                    vm.isLogin = false;
                    vm.isChenXian = false;
                    vm.addType = false;
                    vm.isRaw = false;
                    break;
                case 3:
                    vm.isOrder = false;
                    vm.isCheck = false;
                    vm.isOption = true;
                    vm.isPurchase = false;
                    vm.isPerson = false;
                    vm.isChart = false;
                    vm.isExpend = false;
                    vm.isLogin = false;
                    vm.isChenXian = false;
                    vm.addType = false;
                    vm.isRaw = false;
                    break;
                case 4:
                    vm.isOrder = false;
                    vm.isCheck = false;
                    vm.isOption = false;
                    vm.isPurchase = true;
                    vm.isPerson = false;
                    vm.isChart = false
                    vm.isExpend = false;
                    vm.isLogin = false;
                    vm.isChenXian = false;
                    vm.addType = false;
                    vm.isRaw = false;
                    break;
                case 5:
                    vm.isOrder = false;
                    vm.isCheck = false;
                    vm.isOption = false;
                    vm.isPurchase = false;
                    vm.isPerson = true;
                    vm.isChart = false;
                    vm.isExpend = false;
                    vm.isLogin = false;
                    vm.isChenXian = false;
                    vm.isRaw = false;
                    break;
                case 6:
                    vm.isOrder = false;
                    vm.isCheck = false;
                    vm.isOption = false;
                    vm.isPurchase = false;
                    vm.isPerson = false;
                    vm.isChart = true;
                    vm.isExpend = false;
                    vm.isLogin = false;
                    vm.isChenXian = false;
                    vm.addType = false;
                    vm.isRaw = false;
                    break;
                case 7:
                    vm.isOrder = false;
                    vm.isCheck = false;
                    vm.isOption = false;
                    vm.isPurchase = false;
                    vm.isPerson = false;
                    vm.isChart = false;
                    vm.isExpend = true;
                    vm.isLogin = false;
                    vm.isChenXian = false;
                    vm.addType = false;
                    vm.isRaw = false;
                    break;
                case 8:
                    vm.isOrder = false;
                    vm.isCheck = false;
                    vm.isOption = false;
                    vm.isPurchase = false;
                    vm.isPerson = false;
                    vm.isChart = false;
                    vm.isExpend = false;
                    vm.isLogin = false;
                    vm.isChenXian = true;
                    vm.addType = false;
                    vm.isRaw = false;
                    break;
                case 9:
                    vm.isOrder = false;
                    vm.isCheck = false;
                    vm.isOption = false;
                    vm.isPurchase = false;
                    vm.isPerson = false;
                    vm.isChart = false;
                    vm.isExpend = false;
                    vm.isLogin = false;
                    vm.isChenXian = false;
                    vm.addType = true;
                    vm.isRaw = false;
                    break;
                case 10:
                    vm.isOrder = false;
                    vm.isCheck = false;
                    vm.isOption = false;
                    vm.isPurchase = false;
                    vm.isPerson = false;
                    vm.isChart = false;
                    vm.isExpend = false;
                    vm.isLogin = false;
                    vm.isChenXian = false;
                    vm.addType = false;
                    vm.chose = true;
                    vm.isRaw = false;
                    break;
                case 11:
                    vm.isOrder = false;
                    vm.isCheck = false;
                    vm.isOption = false;
                    vm.isPurchase = false;
                    vm.isPerson = false;
                    vm.isChart = false;
                    vm.isExpend = false;
                    vm.isLogin = false;
                    vm.isChenXian = false;
                    vm.addType = false;
                    vm.isRaw = true;
                    vm.chose = false;
                    break;
                case 999:
                    vm.isOrder = false;
                    vm.isCheck = false;
                    vm.isOption = false;
                    vm.isPurchase = false;
                    vm.isPerson = false;
                    vm.isChart = false;
                    vm.isExpend = false;
                    vm.isChenXian = false;
                    vm.isLogin = true;
            }
        };
        $rootScope.data.setTab = vm.setTab;
        vm.discount = 0;
        $scope.logout = function () {
            console.log(87);
            localStorageService.setProperty("Token", "");
            location.reload();
        };
        $scope.totalCount = function (list) {
            var total = 0;
            //console.log('List', list);
            angular.forEach(list, function (value, key) {
                total += value.price * value.count;
            });
            return total;
        };
        vm.numberCount = function (list) {
            var total = 0;
            angular.forEach(list, function (value, key) {
                total += value.count;
            });
            return total;
        };
        vm.changeLanguage = function (lan) {
            localStorageService.setProperty("language", lan);
            $rootScope.data.language = localStorageService.getProperty("language") || 'tw';
        };
        vm.getLanguageName = function () {
            return languageService.getLanguageName($rootScope.data.language);
        };
        vm.enter = function () {
            swal({
                title: "確定嗎??",
                text: "要確認所選功能是否為自己所需",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "對, 就是他了!",
                closeOnConfirm: false
            },
                function async() {
                    if (vm.AP == true) {

                        vm.AAP = true;
                        localStorageService.setProperty("AAP", vm.AAP);

                    }
                    else {
                        vm.AAP = false;
                        localStorageService.setProperty("AAP", false);
                    }
                    if (vm.BP == true) {
                        vm.BBP = true;
                        localStorageService.setProperty("BBP", vm.BBP);
                    }
                    else {
                        vm.BBP = false;
                        localStorageService.setProperty("BBP", false);
                    }
                    if (vm.CP == true) {
                        vm.CCP = true;
                        localStorageService.setProperty("CCP", vm.CCP);
                    }
                    else {
                        vm.CCP = false;
                        localStorageService.setProperty("CCP", false);
                    }
                    if (vm.DP == true) {
                        vm.DDP = true;
                        localStorageService.setProperty("DDP", vm.DDP);
                    }
                    else {
                        vm.DDP = false;
                        localStorageService.setProperty("DDP", false);
                    }
                    if (vm.EP == true) {
                        vm.EEP = true;
                        localStorageService.setProperty("EEP", vm.EEP);
                    }
                    else {
                        vm.EEP = false;
                        localStorageService.setProperty("EEP", false);
                    }

                    swal("成功!", "系統已經成功切換為所選功能", "success"), function () {

                    };
                    location.reload()
                });
        };
    }]);
    app.controller('OrderController', ['localStorageService', '$filter', '$rootScope', '$timeout', 'foodService', 'posService', '$scope', 'PrintService', 'SignalRService', 'uuid', 'ReportService', function (localStorageService, $filter, $rootScope, $timeout, foodService, posService, $scope, PrintService, SignalRService, uuid, ReportService) {
        var vm = this;
        foodService.gettypeList().success(function (data) {
            $rootScope.data.typeList = data;
        });
        //console.log($rootScope.data.decoded);
        vm.Token = $rootScope.data.Token;
        foodService.getList(vm.Token).then(function (response) {
            //console.log('hi');
            $rootScope.data.menuList = response.data;
            localStorageService.setProperty("menuList", $rootScope.data.menuList);
            vm.menuLocal = localStorageService.getProperty("menuList");
            $rootScope.data.status = response.status;
        }).catch(function (response) {
            console.log('nope', response.status);
            $rootScope.data.menuList = localStorageService.getProperty('menuList');
            $rootScope.data.status = response.status;
        });

        ReportService.getdata(0).then(function (response) {
            $rootScope.data.reportList = response;
        });
        ReportService.getchartdata("w").then(function (response) {
            $rootScope.data.chartList1 = response;
        });
        vm.offline = $rootScope.data.offline;
        vm.offlineCount = $rootScope.data.offlineCount;
        posService.getPos2Status(vm.Token).then(function (response) {
            vm.pos2Status = response.status;
            if (vm.pos2Status == 200 && vm.offline.length > 0 && navigator.onLine == true) {
                posService.postOffline(JSON.stringify(vm.offline)).then(function (response) {
                    if (response.status) { 
                        vm.offline = [];
                        vm.offlineCount = 0;
                        localStorageService.setProperty("offlineCheckList", vm.offline);
                        localStorageService.setProperty("offlineCount", vm.offlineCount);
                        $rootScope.data.offline = vm.offline;
                        $rootScope.data.offlineCount = vm.offlineCount;
                    }
                });
            }

        });
        vm.menuList = $rootScope.data.menuList;
        vm.checkList = $rootScope.data.checkList;
        vm.checkId = $rootScope.data.checkId;
        vm.orderList = $rootScope.data.orderList;
        //折扣宣告為未折扣
        vm.Percent = 100;
        vm.plus = function (item) {
            var copy = angular.copy(item);
            var target = {};
            angular.forEach(vm.orderList.data, function (value, key) {
                if (value.id == item.id) {
                    target = value;
                }
            });
            if (target.id > 0) {
                target.count++;
            }
            else {
                copy.count = 1;
                vm.orderList.data.push(copy);
            }
            vm.DisCount1(vm.Percent);
            console.log(vm.Percent);
        };
        vm.minus = function (item) {
            var copy = angular.copy(item);
            var target = {};
            angular.forEach(vm.orderList.data, function (value, key) {
                if (value.id == item.id) {
                    target = value;
                }
            });
            if (target.id > 0) {
                target.count--;
                if (target.count == 0) {
                    vm.orderList.data.splice(vm.orderList.data.indexOf(target), 1);
                }
            }
            vm.DisCount1(vm.Percent);
            console.log(vm.Percent);
        };
        vm.count = function (item) {
            var size = 0
            angular.forEach(vm.orderList.data, function (value, key) {
                if (value.id == item.id) {
                    size = value.count;
                }
            });
            return size;
        };
        vm.submit = function () {
            if (vm.orderList.data.length > 0) {
                $rootScope.swal({
                    title: "已輸入完成?",
                    text: "菜單將會轉到結帳區",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "點菜完成",
                    closeOnConfirm: false
                }, function () {
                    vm.submitSuccess();
                    swal("完成!", "菜單已經轉到結帳區", "success");
                });
            } else {
                swal("錯誤!", "尚未選擇商品", "error");
            }
        };

        vm.submitSuccess = function () {
            $timeout(function () {
                var copy = angular.copy(vm.orderList);
                if (copy.id) {
                    angular.forEach(vm.checkList, function (value, key) {
                        if (value.id === copy.id)
                            vm.orderList[key] = copy;
                    });
                    copy.uuid = uuid.v4();
                    copy.createTime = new Date();
                    copy.total = $scope.totalCount(copy.data) - copy.pay;
                    PrintService.postPrint(copy);
                    SignalRService.postSignalR($rootScope.data.checkList);
                    console.log(copy);
                    $rootScope.data.orderList = copy;
                    localStorageService.setProperty("checkList", vm.checkList);
                } else {
                    var id = $rootScope.data.checkId;
                    if (vm.checkList.length) {
                        id = vm.checkList[vm.checkList.length - 1]["id"];
                    }
                    id++;
                    if (id > 150) {
                        id = 1;
                    }
                    copy.id = id;
                    $rootScope.data.checkId = id;
                    localStorageService.setProperty("checkId", $rootScope.data.checkId);
                    copy.uuid = uuid.v4();
                    copy.createTime = new Date();
                    copy.total = $scope.totalCount(copy.data) - copy.pay;
                    console.log('copy', copy);
                    vm.checkList.push(copy);
                    localStorageService.setProperty("checkList", vm.checkList);
                    PrintService.postPrint(copy);
                    SignalRService.postSignalR($rootScope.data.checkList);
                }
                //console.log("test",vm.orderList);
                var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
                $body.animate({ scrollTop: 0 }, 300);
                $('html, body').scrollTop(0);
                vm.orderList = { data: [], spicy: 0, pay: 0, phone: 0, discount: 0, spicyPackage: 0, spicyPackage2: 0 };
                vm.Percent = 100;
                //$scope.SpicyPackage();
                $rootScope.data.orderList = vm.orderList;
            }, 1);
        };
        vm.clear = function () {
            var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
            $body.animate({ scrollTop: 0 }, 300);
            $('html, body').scrollTop(0);
            vm.orderList = { data: [], spicy: 0, pay: 0, phone: 0, discount: 0, spicyPackage: 0, spicyPackage2: 0 };
            vm.Percent = 100;
            //$scope.SpicyPackage();
            $rootScope.data.orderList = vm.orderList;
        };
        //自訂折扣
        vm.CustomDiscount = $rootScope.data.CustomDiscount;
        //折扣轉中文顯示
        vm.DissTurnZhTW = function (CusDiss) {
            vm.Zh2 = CusDiss % 10;
            vm.Zh1 = (CusDiss - vm.Zh2) / 10;
            vm.DissZh = vm.DissTurnZhTW2(vm.Zh1) + vm.DissTurnZhTW2(vm.Zh2);
            //console.log(vm.DissZh + "折");
            return vm.DissZh;
        };
        vm.DissTurnZhTW2 = function (param) {
            switch (param) {
                case 1:
                    return "一";
                case 2:
                    return "二";
                case 3:
                    return "三";
                case 4:
                    return "四";
                case 5:
                    return "五";
                case 6:
                    return "六";
                case 7:
                    return "七";
                case 8:
                    return "八";
                case 9:
                    return "九";
                case 0:
                    return "　";
            }
        };
        vm.DisCount1 = function (Percent) {
            vm.Percent = Percent;
            vm.DissCount1 = $scope.totalCount(vm.orderList.data) * Percent / 100;
            vm.disCount = vm.DissCount1 % 5;
            if (vm.disCount == 0) {
                vm.ForFive = 0;
            }
            else {
                vm.ForFive = 5 - vm.disCount;
            }
            vm.returnDissCount1 = vm.DissCount1 + vm.ForFive;
            vm.orderList.pay = $scope.totalCount(vm.orderList.data) - vm.returnDissCount1;
            $rootScope.data.pay = vm.orderList.pay;
            $rootScope.data.discount = vm.orderList.discount;
        };
        vm.Origin = function () {
            vm.orderList.pay = 0;
            $rootScope.data.pay = vm.orderList.pay;
            vm.orderList.discount = 0;
            $rootScope.data.discount = vm.orderList.discount;
        };
        vm.KouWuYen = function () {
            vm.orderList.pay += 5;
            $rootScope.data.pay = vm.orderList.pay;
        };
        vm.ForFree = function () {
            vm.orderList.pay = $scope.totalCount(vm.orderList.data);
            //$rootScope.data.pay = vm.orderList.pay;
        };
        vm.newId = function (id) {
            if (!id) {
                if ($rootScope.data.checkId + 1 > 150) {
                    return 1;
                }
                else
                    return $rootScope.data.checkId + 1;
            }
        };
        //折扣結束 辣包開始
        vm.SpicySelect = function () {
            if (vm.orderList.spicyPackage == 0) {
                vm.orderList.spicyPackage = 1;
                console.log("1", vm.orderList);
                $(".btn-spicyPackage").addClass("red");
            } else {
                vm.orderList.spicyPackage = 0;
                console.log("0", vm.orderList);
                $(".btn-spicyPackage").removeClass("red");
            }
        };
        vm.SpicySelect2 = function () {
            if (vm.orderList.spicyPackage2 == 0) {
                vm.orderList.spicyPackage2 = 1;
                console.log("1", vm.orderList);
            } else if (vm.orderList.spicyPackage2 == 1) {
                vm.orderList.spicyPackage2 = 2;
                console.log("2", vm.orderList);
            } else {
                vm.orderList.spicyPackage2 = 0;
                console.log("0", vm.orderList);
            }
        };
        //辣包結束
    }]);
    app.controller('CheckController', ['localStorageService', '$filter', '$rootScope', '$timeout', 'posService', '$scope', 'SignalRService', 'uuid', function (localStorageService, $filter, $rootScope, $timeout, posService, $scope, SignalRService, uuid) {
        var vm = this;
        vm.orderList = $rootScope.data.orderList;
        vm.checkList = $rootScope.data.checkList;
        vm.edit = function (list) {
            $rootScope.data.orderList = list;
            $scope.setTab(1);
        };
        vm.oneKeyAllDie = function () {
            swal({
                title: "全部交單？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "完成",
                closeOnConfirm: false
            }, function () {
                vm.AllDie();
            }
            );
        }

        vm.AllDie = function () {
            posService.getPos2Status().then(function (response) {
                vm.pos2Status = response.status;
                if (vm.checkList.length > 1) {
                    if (vm.pos2Status == 200 && navigator.onLine == true) {
                        console.log('pos2', vm.pos2Status);
                        posService.postOffline(JSON.stringify(vm.checkList));
                        console.log('Json.Stringify', JSON.stringify(vm.checkList));
                        console.log('alldie', vm.checkList);
                        $timeout(function () {
                            vm.checkList = [];
                            localStorageService.setProperty("checkList", vm.checkList);
                            SignalRService.postSignalR("");
                            swal(
                                {
                                    title: "完成！",
                                    text: "交單成功！",
                                    type: "success"
                                }
                                , function () {


                                    location.reload();
                                }
                            );
                        }, 1);


                    }
                    else {
                        swal("失敗!", "交單失敗，請聯絡iBower團隊", "error");
                    }
                } else if (vm.checkList.length < 1) {
                    swal("沒有未交單！", "error");
                } else {
                    swal("沒有超過一張以上的單", "error");
                }
            });

        }
        vm.submit = function (item) {
            $rootScope.swal({
                title: "已交貨?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "完成",
                closeOnConfirm: false
            }, function () {
                vm.submitSuccess(item);
                swal("完成!", "已交貨：結帳單 " + item.id + "", "success");
            });
        }
        vm.keepOfflineData = function (value) {
            vm.offlineCheck = localStorageService.getProperty("offlineCheckList");
            console.log("offC1", vm.offlineCheck);
            vm.offlineCheck.push(value);
            vm.offlineCount += 1;
            console.log("Json", value);
            console.log("offC2", vm.offlineCheck);
            console.log("offCount", vm.offlineCount);
            localStorageService.setProperty("offlineCheckList", vm.offlineCheck);
            localStorageService.setProperty("offlineCount", vm.offlineCount);
        };
        vm.submitSuccess = function (item) {
            $timeout(function () {
                posService.getPosStatus().then(function (response) {
                    vm.posStatus = response.status;
                    console.log('pos', vm.posStatus);
                    angular.forEach(vm.checkList, function (value, key) {
                        if (value.id == item.id) {
                            if (vm.posStatus == 200 && navigator.onLine == true) {
                                vm.checkList.splice(key, 1);
                                localStorageService.setProperty("checkList", vm.checkList);
                                posService.postPos(value).then(function (response) {
                                    if (response.status != 200) {
                                        vm.keepOfflineData(value);
                                    }
                                }).catch(function (response) {
                                    vm.keepOfflineData(value);
                                });
                            }
                            else {
                                vm.checkList.splice(key, 1);
                                localStorageService.setProperty("checkList", vm.checkList);
                                vm.keepOfflineData(value);
                            }
                            SignalRService.postSignalR($rootScope.data.checkList);
                        }
                    });
                }).catch(function (response) {
                    angular.forEach(vm.checkList, function (value, key) {
                        if (value.id == item.id) {
                            vm.checkList.splice(key, 1);
                            localStorageService.setProperty("checkList", vm.checkList);
                            vm.keepOfflineData(value);
                        }
                    });
                });
                localStorageService.setProperty("checkList", vm.checkList);
            }, 1);
        };
        vm.reId = function () {
            $rootScope.swal({
                title: "單號強制重算?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "確定",
                closeOnConfirm: false
            }, function () {
                vm.reIdSuccess();
                swal("完成!", "單號已從頭開始計算", "success");
            });
        };
        vm.reIdSuccess = function () {
            $timeout(function () {
                $rootScope.data.checkId = 0;
                localStorageService.setProperty("checkId", $rootScope.data.checkId);
            }, 1);
        };
    }]);
    app.controller('PurchaseController', ['$filter', '$rootScope', '$scope', 'PurChaseService', 'RawService', 'localStorageService', 'uuid', function ($filter, $rootScope, $scope, PurChaseService, RawService, localStorageService, uuid) {
        var vm = this;
        PurChaseService.getPurList().then(function (response1) {
            RawService.getRawList().then(function (response2) {
                vm.PurStatus = response1.status;
                vm.RawStatus = response2.status;
                if (navigator.onLine) {
                    if (vm.PurStatus == 200 && vm.RawStatus == 200) {
                        vm.update = function (a) {
                            vm.item = a;
                            vm.purItems = a.data;
                            vm.item.createTime = a.createtime;
                            vm.item.data = {};
                            console.log('data', vm.item);
                            $('.pur').fadeIn();
                        };
                        vm.seeupdate = function (item) {
                            if (vm.item.data.name && vm.item.data.price && vm.item.data.pqrt) {
                                vm.itemPlus(vm.item.data);
                                vm.item.data = item;
                                angular.forEach(vm.purItems, function (value, key) {
                                    if (value.id == vm.item.data.id) {
                                        vm.purItems.splice(key, 1);
                                    }
                                })
                            }
                            else {
                                console.log('keys', Object.keys(vm.item.data).length);
                                if (Object.keys(vm.item.data).length <= 2) {
                                    vm.item.data = item;
                                    angular.forEach(vm.purItems, function (value, key) {
                                        if (value.id == vm.item.data.id) {
                                            vm.purItems.splice(key, 1);
                                        }
                                    })
                                }
                                else { swal("有資料未填寫！", "請確認品項，金額，數量都有填寫", "error"); }
                            }
                        };
                        vm.showDetail = function (a) {
                            $("." + a).fadeToggle();
                        };
                        vm.Detailnum = 0;
                        vm.PurList = response1.data;
                        console.log(vm.PurList);
                        vm.RawList = response2.data;

                        vm.PageSize = 10;
                        vm.PurCurPage = 0;
                        vm.RawCurPage = 0;
                        vm.item = {};
                        vm.item.createTime = new Date($.datepicker.formatDate('yy-mm-dd', new Date()));
                        $("#Eday").datepicker({
                            showOtherMonths: true,
                            dateFormat: "yy-mm-dd",
                            maxDate: new Date(),
                            onSelect: function (Eday) {
                                vm.item.createTime = Eday;
                            }
                        });
                        vm.rawDefault = function (Raw) {
                            Raw.rawNum = 0;
                        }
                        vm.rawAdd = function (raw, num) {
                            raw.rawNum += num;

                        };
                        vm.rawEdit = function (a) {
                            //a.rawNum = num;
                            RawService.editRaw(a);
                            vm.rawNum = 0;
                        };
                        vm.rawClear = function () {
                            vm.rawNum = 0;
                        }

                        vm.showRawDetail = function (a) {
                            $(".Raw" + a).fadeToggle();

                        };
                        vm.use = {};
                        vm.datacount = 0;
                        for (var i = 0; i < vm.PurList.length; i++) {
                            vm.datacount = vm.datacount + vm.PurList[i].data.length;
                        }
                        vm.purItems = [];
                        vm.useItems = [];
                        vm.PurMaxPage = Math.ceil(vm.datacount / vm.PageSize) - 1
                        vm.RawMaxPage = Math.ceil(vm.RawList.length / vm.PageSize) - 1
                        vm.FindUnit = function (name) {
                            angular.forEach(vm.RawList, function (value, key) {
                                if (value.Name === name)
                                    vm.Unit = value.Unit;
                            });
                        }
                        vm.FindName = function (id) {
                            angular.forEach(vm.RawList, function (value, key) {
                                if (value.NameId === id)
                                    return value.Name;
                            });
                        }
                        vm.itemPlus = function (data) {
                            console.log('data', vm.purItems);
                            if (data) {
                                if (data.name && data.price && data.pqrt) {
                                    if (data.mark) {
                                        vm.purItems.push(data);
                                        console.log('123', vm.purItems);
                                    }
                                    else {
                                        data.mark = 'nope';
                                        vm.purItems.push(data);
                                        console.log('123', vm.purItems);
                                    }
                                    vm.item.data = {};
                                }
                                else {
                                    swal("有資料未填寫！", "請確認品項，金額，數量都有填寫", "error");
                                    return false;
                                }
                            }
                            else {
                                swal("有資料未填寫！", "請確認品項，金額，數量都有填寫", "error");
                                return false;
                            }
                        }
                        vm.PurPost = function (data) {
                            if (vm.item.firm && vm.item.phone) {  //判定廠商及電話有無資料再往下
                                if (vm.item.data) {                         //判斷有無資料
                                    if (vm.item.data.name || vm.item.data.price || vm.item.data.pqrt) {            //判定內容有沒有東西
                                        console.log('GoPurItems');
                                        vm.itemPlus(vm.item.data);
                                        vm.item.createTime = new Date();
                                        if (vm.item.mark) { }      //判定廠商備註 給nope
                                        else { vm.item.mark = 'nope'; }
                                        vm.item.data = vm.purItems;
                                        console.log('purchase', vm.item);
                                        if (vm.item.p_id)   //判定為修改或新增
                                        {
                                            vm.item.uuid = vm.item.p_id;
                                            PurChaseService.postPurchase(vm.item);
                                            swal("進貨完成", "進貨完成", "success");
                                        }
                                        else {
                                            vm.item.uuid = uuid.v4();
                                            PurChaseService.postPurchase(vm.item);
                                            swal("進貨完成", "進貨完成", "success");
                                        }
                                        vm.purItems = [];
                                        vm.item = {};
                                    }
                                    else {
                                        if (vm.purItems.length > 0) {  //判定有沒有進貨細項
                                            vm.item.createTime = new Date();
                                            if (vm.item.mark) { }      //判定廠商備註 給nope
                                            else { vm.item.mark = 'nope'; }
                                            vm.item.data = vm.purItems;
                                            console.log('purchase', vm.item);
                                            if (vm.item.p_id)   //判定為修改或新增
                                            {
                                                vm.item.uuid = vm.item.p_id;
                                                PurChaseService.postPurchase(vm.item);
                                                swal("進貨完成", "進貨完成", "success");
                                                //console.log(2);
                                            }
                                            else {
                                                vm.item.uuid = uuid.v4();
                                                PurChaseService.postPurchase(vm.item);
                                                swal("進貨完成", "進貨完成", "success");
                                            }
                                            vm.purItems = [];
                                            vm.item = {};
                                        }
                                        else {
                                            swal("有資料未填寫！", "請確認細項有填寫", "error");
                                        }
                                    }
                                }
                                else { swal("有資料未填寫！", "請確認細項有填寫", "error"); }
                            }
                            else { swal("有資料未填寫！", "請確認廠商，電話都有填寫", "error"); }
                        };
                        vm.PurUpdate = function (item) {
                            $('.pur').fadeIn();
                            var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
                            $body.animate({ scrollTop: 0 }, 300);
                            $('html, body').scrollTop(0);
                            vm.item = item;
                        };
                        vm.PurShow = function () {
                            vm.item.data = {};
                            $('.pur').fadeToggle();
                        };
                        vm.UseShow = function () {
                            $('.use').fadeToggle();
                        };
                        $scope.RType = $rootScope.data.typeList;
                        //    [
                        //    {
                        //        id: '1',
                        //        Name: '肉'
                        //    },
                        //    {
                        //        id: '2',
                        //        Name: '菜'
                        //    },
                        //    {
                        //        id: '3',
                        //        Name: '加工'
                        //    },
                        //    {
                        //        id: '4',
                        //        Name: '消耗'
                        //    }
                        //];

                        vm.RawUpdate = function (Raw) {
                            $('.raw').fadeIn();
                            var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
                            $body.animate({ scrollTop: 0 }, 300);
                            $('html, body').scrollTop(0);
                            vm.Raw = Raw;
                        };
                        vm.RawPost = function () {
                            var copy = angular.copy(vm.Raw);
                            if (vm.Raw.Name && vm.Raw.RType && vm.Raw.Unit) {
                                RawService.postRaw(vm.Raw);
                                console.log("Raw", vm.Raw);
                            }
                            else { swal("輸入不完整", "輸入失敗", "error"); }
                        };
                        vm.usePlus = function (use) {
                            if (vm.use) {
                                if (vm.use.name && vm.use.pqrt) {
                                    vm.use.unit = vm.Unit;
                                    vm.useItems.push(vm.use);
                                    vm.use = {};
                                    vm.checkPost = 1;
                                    console.log('itemData', vm.useItems);
                                    console.log('useItem', vm.use);
                                }
                                else {
                                    swal("有資料未填寫！", "請確認品項、數量都有填寫", "error");
                                    vm.checkPost = 0;
                                }
                            }
                            else {
                                swal("有資料未填寫！", "請確認品項、數量都有填寫", "error");
                                vm.checkPost = 0;
                            }
                        }
                        vm.UsePost = function (use) {
                            console.log('vm.use', vm.use);
                            console.log('vm.use.data', vm.use.data);
                            console.log('key', Object.keys(vm.use).length);
                            if (Object.keys(vm.use).length > 0) {
                                console.log(1);
                                if (vm.use.name || vm.use.pqrt) {
                                    console.log(2);
                                    vm.usePlus();
                                    if (vm.checkPost == 1) {
                                        angular.forEach(vm.useItems, function (value, key) {
                                            value.pqrt *= -1;
                                        });
                                        vm.use.uuid = uuid.v4();
                                        vm.use.createTime = new Date();
                                        vm.use.data = vm.useItems;
                                        RawService.minusPqrt(vm.use).then(
                                            swal(
                                                {
                                                    title: "完成",
                                                    text: "新增成功。",
                                                    type: "success"
                                                }, function () {
                                                    location.reload();
                                                }));
                                    }
                                }
                                else {
                                    angular.forEach(vm.useItems, function (value, key) {
                                        value.pqrt *= -1;
                                    });
                                    vm.use.uuid = uuid.v4();
                                    vm.use.createTime = new Date();
                                    vm.use.data = vm.useItems;
                                    RawService.minusPqrt(vm.use).then(
                                        swal(
                                            {
                                                title: "完成",
                                                text: "新增成功。",
                                                type: "success"
                                            }, function () {
                                                location.reload();
                                            }));
                                }
                            }
                            else { swal("有資料未填寫！", "請確認消耗有填寫", "error"); }
                        };
                        vm.RawDelete = function (Raw) {
                            swal({
                                title: "刪除確認?",
                                text: "",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: "確認",
                                closeOnConfirm: false
                            }, function () {
                                RawService.RawDelete(Raw.NameId);
                            }
                            );
                        }
                        vm.RawShow = function () {
                            $('.raw').fadeToggle();
                        };
                    }
                    else {
                        console.log("PurStatus", vm.PurStatus);
                        swal("伺服器失去回應", "請聯繫iBower團隊", "success");
                        $scope.setTab(1);
                    }
                }
                else {
                    console.log("PurStatus2", vm.PurStatus);
                    swal("失去連線", "請檢查您的網路", "error");
                    $scope.setTab(1);
                }
            })
        }).catch(function (response1) {
            console.log("PurStatus3", vm.PurStatus);
            swal("失去連線", "請檢查您的網路", "error");
            $scope.setTab(1);
        });
    }]);
    app.controller('PersonController', ['$filter', '$rootScope', '$scope', 'ShiftService', 'PersonService', '$timeout', 'uuid', 'TimeCountService', function ($filter, $rootScope, $scope, ShiftService, PersonService, $timeout, uuid, TimeCountService) {
        var vm = this;
        //vm.dayPayStart = new Date($.datepicker.formatDate('yy-mm-dd', new Date()));
        //vm.dayPayStart.setDate(1);
        //vm.dayPayEnd = new Date($.datepicker.formatDate('yy-mm-dd', new Date()));
        //vm.dayPayEnd.setMonth(vm.dayPayEnd.getMonth() + 1);
        //vm.dayPayEnd.setDate(1);
        //vm.dayPayEnd.setDate(vm.dayPayEnd.getDate() - 1);
        PersonService.getPersonList().then(function (response1) {
            TimeCountService.getCountList().then(function (response2) {
                PersonService.getfirePersonList().then(function (response0) {
                    vm.fire = response0.data;

                });
                vm.mem = {};
                vm.mem.IsDelete = 0;
                vm.memList = response1.data;
                console.log("person", vm.memList);
                vm.dayPay = {};
                vm.monthPay = {};
                vm.dayPayList = [];
                vm.dayPost = {};
                vm.dayPayUuid = {};
                vm.MemShow = function () {
                    $('.mem').fadeToggle();
                };
                vm.MoneyShow = function () {
                    $('.money').fadeToggle();
                };
                vm.SalarySystem = function (data) {
                    if (data === true) { return "月薪" }
                    else { return "時薪" }
                };
                vm.MemPost = function () {
                    if (vm.mem.IsDelete) { swal("編輯失敗", "員工已離職", "error"); }
                    else {
                        if (vm.mem.Name || vm.mem.Phone || vm.mem.Id || vm.mem.Salary || vm.mem.Addr || vm.mem.StartTime || vm.mem.Parent || vm.mem.ParentPhone) {
                            vm.mem.Job = "員工";
                            vm.mem.Auth = 1;
                            if (vm.mem.Mark) { }
                            else { vm.mem.Mark = Nope; }
                            vm.mem.CreateTime = new Date();
                            //console.log('mem', vm.mem);
                            if (vm.mem.Uuid) { }
                            else {
                                vm.mem.Uuid = uuid.v4();
                            }
                            console.log('mem', vm.mem);
                            PersonService.postPerson(vm.mem);
                            swal("編輯成功", "", "success");
                            vm.mem = {};
                        }
                        else { swal("有資料未填寫！", "請確認都有填寫", "error"); }
                    }
                }
                vm.memUpdate = function (mem) {
                    //console.log(item);
                    $('.mem').fadeIn();
                    var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
                    $body.animate({ scrollTop: 0 }, 300);
                    $('html, body').scrollTop(0);
                    vm.mem = mem;
                    vm.mem.StartDate = new Date(mem.StartDate);
                };
                vm.memDelete = function (mem) {
                    swal({
                        title: "刪除確認?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: "確認",
                        closeOnConfirm: false
                    }, function () {
                        PersonService.MemberDelete(mem.Uuid);
                    }
                    );
                }
                vm.dayPayPost = function (List, Dpay) {
                    if (List.length != 0) {
                        if (Object.keys(vm.dayPay).length < 2) {
                            vm.dayPost.Uuid = uuid.v4();
                            vm.dayPost.CreateTime = new Date();
                            vm.dayPost.data = List;
                            TimeCountService.postCount(vm.dayPost);
                            console.log("daypay", vm.dayPost);
                            vm.dayPost = {};
                            vm.dayPayList = [];
                            swal({
                                title: "新增成功",
                                text: "你新增成功了",
                                type: "success",
                            }, function () {
                                location.reload();
                            }
                            );
                        }
                        else {
                            swal("請按+之後再按送出", "!!!!!!!!!", "warning")
                        }
                    }
                    else {
                        if (Dpay.Uuid && Dpay.Date && Dpay.Hours) {
                            vm.dayPayPlus(Dpay)
                            vm.dayPost.Uuid = uuid.v4();
                            vm.dayPost.CreateTime = new Date();
                            vm.dayPost.data = List;
                            TimeCountService.postCount(vm.dayPost);
                            console.log("daypay", vm.dayPost);
                            vm.dayPost = {};
                            vm.dayPayList = [];
                            swal({
                                title: "新增成功",
                                text: "",
                                type: "success",
                            }, function () {
                                location.reload();
                            }
                            );

                        }
                        else {
                            swal("尚未填寫資料!", "!!!!!!!!!", "warning")
                        }
                    }
                }

                vm.dayPayPlus = function (dayPay) {
                    if (dayPay) {

                        if (dayPay.Uuid && dayPay.Date && dayPay.Hours) {
                            vm.FindName(dayPay.Uuid);
                            if (dayPay.Mark) { }      //判定時數備註 給nope
                            else { dayPay.Mark = 'nope'; }
                            if (dayPay.Bonus) { }      //判定員工獎金 給nope
                            else { dayPay.Bonus = 0; }
                            dayPay.Name = $scope.dayPayName;
                            dayPay.CreateTime = new Date();
                            //vm.dayPay.Name = '123';
                            console.log('payday', dayPay);
                            vm.dayPayList.push(dayPay);
                            console.log("PayList", vm.dayPayList);
                            vm.dayPay = {};
                        }
                        else {
                            swal("有資料未填寫！", "", "error")
                        }
                        //console.log(vm.FindName(dayPay.Uuid)+new Date());
                    }
                    else {
                        swal("有資料未填寫！", "", "error")
                    }
                    //console.log('vm.dayPayList', vm.dayPayList);
                }
                vm.FindName = function (uuid) {
                    angular.forEach(vm.memList, function (value, key) {
                        if (value.Uuid === uuid) {
                            console.log('value.Name', value.Name + new Date());
                            $scope.dayPayName = value.Name;
                        }
                    });
                }
                $("#start").datepicker({
                    showOtherMonths: true,
                    dateFormat: "yy-mm-dd",
                    maxDate: new Date(),
                    onSelect: function (start) {
                        vm.dayPayStart = start;
                        $("#end").datepicker('option', 'minDate', start)

                    }

                });
                $("#end").datepicker({
                    maxDate: new Date(),
                    showOtherMonths: true,
                    dateFormat: "yy-mm-dd",
                    //minDate: new Date(),
                    onSelect: function (end) {
                        vm.dayPayEnd = end;
                    }

                });
                $("#dayPay").datepicker({
                    maxDate: new Date(),
                    showOtherMonths: true,
                    dateFormat: "yy-mm-dd",
                    onSelect: function (date) {
                        vm.dayPay.Date = date;
                    }

                });
                $("#createdate").datepicker({
                    maxDate: new Date(),
                    showOtherMonths: true,
                    dateFormat: "yy-mm-dd",
                    onSelect: function (date) {
                        vm.mem.StartDate = date;
                    }

                });



                vm.DayPaySelect = function () {
                    TimeCountService.getOneCountList(vm.dayPayStart, vm.dayPayEnd, vm.dayPayUuid).then(function (response3) {
                        vm.monthPay = response3.data;
                        console.log(vm.monthPay);
                        vm.Hours = 0; vm.Bonus = 0; vm.Tot = 0;
                        vm.helloworld = 1;
                        angular.forEach(vm.monthPay, function (value, key) {
                            vm.Hours += value.Hours;
                            vm.Bonus += value.Bonus;
                            vm.Tot += value.Tot;
                        });
                    })
                    TimeCountService.getTotal(vm.dayPayStart, vm.dayPayEnd, vm.dayPayUuid).then(function (response4) {
                        vm.totalPay = response4.data;
                        console.log(vm.totalPay);
                    })
                }
            })
        })

    }]);
    app.controller('OptionController', ['localStorageService', '$filter', '$rootScope', 'foodService', '$scope', function (localStorageService, $filter, $rootScope, foodService, $scope) {
        var vm = this;
        console.log('isOptionOnline?', navigator.onLine);
        foodService.getList($rootScope.data.Token).then(function (response) {
            vm.foodstatus = response.status;
            console.log('OptionStatus', vm.foodstatus);
            if (navigator.onLine) {
                if (vm.foodstatus == 200) {
                    vm.menuList = $rootScope.data.menuList;
                    vm.menuList = $filter('orderBy')(vm.menuList, 'id');
                    vm.pageSize = 10;

                    vm.curPage = 0;
                    vm.menuCurPage = 0;
                    vm.typeCurPage = 0;
                    vm.typeList = $rootScope.data.typeList;
                    vm.typeList = $filter('orderBy')(vm.typeList, 'Type');
                    console.log('typeList', vm.typeList);
                    vm.menuPageCount = Math.ceil(vm.menuList.length / vm.pageSize) - 1
                    vm.typePageCount = Math.ceil(vm.typeList.length / vm.pageSize) - 1
                    vm.item = {};
                    console.log(vm.item.type);
                    $scope.DIU = function (BenSimmons) {
                        return (typeof BenSimmons === 'undefined');
                    };
                    vm.submit = function () {
                        var copy = angular.copy(vm.item);
                        //console.log()
                        if (vm.item.name && vm.item.price) {
                            if (vm.item.id) {
                                angular.forEach(vm.menuList, function (value, key) {
                                    if (value.id === copy.id) {
                                        foodService.menuPost(vm.item);
                                        vm.menuList[key] = copy;
                                    }
                                });
                            } else {
                                var id = 1;
                                if (vm.menuList.length) {
                                    id = vm.menuList[vm.menuList.length - 1]["id"] * 1 + 1;
                                }
                                copy.id = id;
                                //vm.item.id = id;
                                foodService.menuPost(vm.item);
                                vm.menuList.push(copy);
                            }
                            vm.isList = true;
                            vm.item = {};
                            localStorageService.setProperty("menuList", vm.menuList);
                        }
                        else {
                            swal("新增/更新失敗", "請您確認商品名稱及價格確實填寫", "error");
                        }
                    };
                    vm.menuUpdate = function (item) {
                        console.log(item);
                        $('.bp').fadeIn();
                        $('.ap').fadeOut();
                        var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
                        $body.animate({
                            scrollTop: 0
                        }, 300);
                        vm.item = item;
                    };
                    $scope.Type = $rootScope.data.typeList;
                    //[
                    //        {
                    //            id: '1',
                    //            Name: '肉'
                    //        },
                    //        {
                    //            id: '2',
                    //            Name: '菜'
                    //        },
                    //        {
                    //            id: '3',
                    //            Name: '加工'
                    //        }
                    //];
                    vm.typeUpdate = function (item) {
                        console.log(item);
                        $('.ap').fadeIn();
                        $('.bp').fadeOut();
                        var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
                        $body.animate({
                            scrollTop: 0
                        }, 300);
                        $('html, body').scrollTop(0);
                        vm.item = item;
                    };

                    vm.typeDelete = function (id) {
                        swal({
                            title: "確定要刪除嗎？",
                            text: "您將無法恢復資料！",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "確定刪除！",
                            closeOnConfirm: false
                        },
                            function () {
                                foodService.typeDelete(id);
                                swal(
                                    {
                                        title: "刪除！",
                                        text: "此分類已被刪除。",
                                        type: "success"
                                    }
                                    , function () {
                                        location.reload();
                                    }
                                );

                            });
                    };
                    vm.menuDelete = function (id) {

                        swal({
                            title: "確定要刪除嗎？",
                            text: "您將無法恢復資料！",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "確定刪除！",
                            closeOnConfirm: false
                        },
                            function () {
                                foodService.menuDelete(id);
                                swal(
                                    {
                                        title: "刪除！",
                                        text: "此商品已被刪除。",
                                        type: "success"
                                    }
                                    , function () {
                                        location.reload();
                                    }
                                );

                            })
                    };
                    vm.show = 1;
                    vm.menuShow = function () {
                        $('.bp').fadeToggle();
                    };
                    vm.show = 1;
                    vm.typeShow = function () {
                        $('.ap').fadeToggle();
                    };
                    vm.typePost = function () {
                        foodService.typePost(vm.item);
                        vm.item = {};
                    };
                    vm.CustomDiscount = $rootScope.data.CustomDiscount;
                    vm.SaveCustomDiscount = function () {
                        if (vm.CustomDiscount >= 10 && vm.CustomDiscount <= 95) {
                            $rootScope.data.CustomDiscount = Number(vm.CustomDiscount);
                            localStorageService.setProperty("CustomDiscount", Number(vm.CustomDiscount));
                            swal("更改完成", "目前的折扣數為" + vm.CustomDiscount / 10 + "折", "success");
                        } else { swal("更改失敗", "限制輸入為10~95", "warning"); }
                    };
                }
                else {
                    swal("無法連接到伺服器", "請您連繫工程師大人", "error");
                }
            }
            else {
                swal("失去連線", "請檢察您的網路或連繫工程師大人", "error");
            }
        }).catch(function (response) {
            vm.foodstatus = response.status;
            console.log('OptionStatus', vm.foodstatus);
            if (navigator.onLine) {
                if (vm.foodstatus == 200) {
                    vm.menuList = $rootScope.data.menuList;
                    vm.menuList = $filter('orderBy')(vm.menuList, 'id');
                    vm.pageSize = 10;
                    vm.curPage = 0;
                    vm.menuCurPage = 0;
                    vm.typeCurPage = 0;
                    vm.typeList = $rootScope.data.typeList;
                    vm.typeList = $filter('orderBy')(vm.typeList, 'Type');
                    vm.menuPageCount = Math.ceil(vm.menuList.length / vm.pageSize) - 1
                    vm.typePageCount = Math.ceil(vm.typeList.length / vm.pageSize) - 1
                    vm.item = {};
                    vm.submit = function () {
                        var copy = angular.copy(vm.item);
                        //console.log()
                        foodService.menuPost(vm.item);
                        if (vm.item.id) {
                            angular.forEach(vm.menuList, function (value, key) {
                                if (value.id === copy.id)
                                    vm.menuList[key] = copy;
                            });
                        } else {
                            var id = 1;
                            if (vm.menuList.length) {
                                id = vm.menuList[vm.menuList.length - 1]["id"] * 1 + 1;
                            }
                            copy.id = id;
                            vm.menuList.push(copy);
                        }
                        vm.isList = true;
                        vm.item = {};


                        localStorageService.setProperty("menuList", vm.menuList);
                    };
                    vm.update = function (item) {
                        console.log(item);
                        vm.item = item;
                    };
                    vm.typeDelete = function (id) {
                        swal({
                            title: "確定删除吗？",
                            text: "你將無法復原該分類！",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "確定刪除！",
                            closeOnConfirm: false
                        },
                            function () {
                                foodService.typeDelete(id);
                                swal("删除！", "你的分類已經被全部删除。", "success");
                            });

                    };
                    vm.menuDelete = function (id) {
                        foodService.menuDelete(id);
                    };

                    vm.menuShow = function () {


                        $('.bp').fadeToggle();

                    };

                    vm.typeShow = function () {

                        $('.ap').fadeToggle();

                    };
                    vm.typePost = function () {
                        foodService.typePost(vm.item);
                        vm.item = {};
                    };
                    vm.CustomDiscount = $rootScope.data.CustomDiscount;
                    vm.SaveCustomDiscount = function () {
                        if (vm.CustomDiscount >= 10 && vm.CustomDiscount <= 95) {
                            $rootScope.data.CustomDiscount = Number(vm.CustomDiscount);
                            localStorageService.setProperty("CustomDiscount", Number(vm.CustomDiscount));
                            swal("更改完成", "目前的折扣數為" + vm.CustomDiscount / 10 + "折", "success");
                        } else { swal("更改失敗", "限制輸入為10~95", "warning"); }
                    };
                }
                else {
                    swal("無法連接到伺服器", "請聯繫iBower團隊", "error");
                }
            }
            else {
                swal("失去連線", "請檢查您的網路或聯繫iBower團隊", "error");
                $scope.setTab(1);
            }
        });




    }]);
    app.controller('BarCtrlController', ['ReportService', '$timeout', '$scope', '$rootScope', 'ExpendService', function (ReportService, $timeout, $scope, $rootScope, ExpendService) {
        //ReportService.getchartdata("w").then(function (response) {
        //    $rootScope.data.chartList1 = response;
        //});
        var vm = this;
        ReportService.getchartdata("m").then(function (response) {
            $rootScope.data.chartList2 = response;
        });
        //ReportService.getchartdata(0).then(function (response) {
        //    $rootScope.data.chartList3 = response;
        //});
        vm.weekList = [{ id: 0, week: "星期日" }, { id: 1, week: "星期一" }, { id: 3, week: "星期三" }, { id: 4, week: "星期四" }, { id: 5, week: "星期五" }, { id: 6, week: "星期六" }, { id: 7, week: "周平均" }, { id: 8, week: "月平均" }];




        vm.ChartList = $rootScope.data.chartList1;
        vm.LinkLawList;
        vm.MonthReportList;
        vm.daytdshow = function () {
            //console.log(87);
            $('.daytd').fadeIn();
            $('.chart').fadeOut();
            $('.linking').fadeOut();
            $('.monthreport').fadeOut();
        };
        vm.chartshow = function () {
            $('.daytd').fadeOut();
            $('.chart').fadeIn();
            $('.linking').fadeOut();
            $('.monthreport').fadeOut();
        };
        vm.linkingshow = function () {

            $('.linking').fadeIn();
            $('.daytd').fadeOut();
            $('.chart').fadeOut();
            $('.monthreport').fadeOut();
            ReportService.getLinkLawdata().then(function (LinkLawList) {
                vm.LinkLawList = LinkLawList;
            })
            ReportService.getHotdata().then(function (HotList) {
                vm.HotList = HotList;
            })



        };

        vm.monthreport = function () {

            $('.monthreport').fadeIn();
            $('.chart').fadeOut();
            $('.linking').fadeOut();
            $('.daytd').fadeOut();
            ReportService.getMonthReportdata().then(function (MonthReportList) {
                vm.MonthReportList = MonthReportList;


            })
            ReportService.getMonthChartdata().then(function (MonthChartList) {
                vm.MonthChartList = MonthChartList;

                $scope.myJson1.series[0].values = vm.MonthChartList.data.values;
                $scope.myJson1.series[0].goals = vm.MonthChartList.data.goals;
                $scope.myJson1.title.text = "iBower 月營收";
                $scope.myJson1.scaleX.labels = vm.MonthChartList.data.labels;

                $scope.myJson2.series[0].values = vm.MonthChartList.data.values2;
                $scope.myJson2.title.text = "iBower 月增率";
                $scope.myJson2.scaleX.labels = vm.MonthChartList.data.labels;
            })
        };
        vm.monthshow = function () {

            vm.ChartList = $rootScope.data.chartList2;
            $scope.myJson.series = vm.ChartList.data;
            $scope.myJson.title.text = "月平均銷售";
            $scope.myJson.scaleX.labels = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
            $('.weekset').fadeOut();
            $('.monthset').fadeIn();
        }
        vm.weekshow = function () {

            vm.ChartList = $rootScope.data.chartList1;
            $scope.myJson.series = vm.ChartList.data;
            $scope.myJson.title.text = "周平均銷售";
            $scope.myJson.scaleX.labels = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
            $('.monthset').fadeOut();
            $('.weekset').fadeIn();

        }
        vm.weekchange = function () { //**時段銷售圖表
            ReportService.getchartdata($scope.DayOfWeek.id).then(function (response) {
                $rootScope.data.chartList3 = response;
                vm.ChartList = $rootScope.data.chartList3;
                $scope.myJson.series = vm.ChartList.data;
                $scope.myJson.title.text = $scope.DayOfWeek.week + " 時段銷售";
                $scope.myJson.scaleX.labels = ["16-17", "17-18", "18-19", "19-20", "20-21", "21-22", "22-23", "23-00", "00-01", "01-02"]
            });

        }

        //console.log("123")
        //vm.Changeday = -1
        //console.log(vm.Changeday)
        vm.ReportList = $rootScope.data.reportList;
        $("#datepicker").datepicker({
            showOtherMonths: true,
            dateFormat: "yy-mm-dd",
            maxDate: "+0d",
            onSelect: function (datepick) {
                //swal("QQ", "QQAQQ", "success")
                //DateDifference(StartDate,EndDate)
                var today = new Date($.datepicker.formatDate('yy-mm-dd', new Date()));
                var datepick = new Date(datepick);
                var ii = (today - datepick) / 86400000;
                //console.log(today);
                //console.log(datepick);
                //console.log(ii);
                ReportService.getdata(ii).then(function (ReportList) {
                    vm.ReportList = ReportList;
                })
            }
        });

        //$("#weeksetchange").datepicker({
        //    showOtherMonths: true,
        //    dateFormat: "yy-mm-dd",
        //    maxDate: "+0d",
        //    onSelect: function (datepick) {
        //        //swal("QQ", "QQAQQ", "success")
        //        //DateDifference(StartDate,EndDate)
        //        var today = new Date($.datepicker.formatDate('yy-mm-dd', new Date()));
        //        var datepick = new Date(datepick);
        //        var ii = (today - datepick) / 86400000;
        //        //console.log(today);
        //        //console.log(datepick);
        //        //console.log(ii);
        //        ReportService.getdata(ii).then(function (ReportList) {
        //            vm.ReportList = ReportList;
        //        })
        //    }
        //});
        //vm.datepicker = 0;
        //垃圾
        //$scope.datechange = function () {
        //    console.log(0.0);
        //    swal("QQ", "error");
        //}
        vm.Changeday = function (ii) {
            //console.log(this.ReportList);
            ReportService.getdata(ii).then(function (ReportList) {
                vm.ReportList = ReportList;
            })
        };




        ///****圖表***///
        $scope.myRender = {

            "height": "100%",
            "autoResize": "true"
        };
        $scope.myJson = {
            type: 'line',
            title: {
                text: 'iBower 周平均銷售'

            },

            plot: {
                tooltip: {
                    visible: false
                },
                cursor: 'hand',
                valueBox: {
                    text: "%t",
                    color: '#0B3954',
                    placement: "top",
                    offsetR: 20
                },
                aspect: 'spline',
                lineWidth: 2,
                marker: {
                    borderWidth: 0,
                    size: 5
                }
            },
            //legend: {
            //    adjustLayout: true,
            //    "highlight-plot": true,
            //    align: 'center',
            //    verticalAlign: 'bottom',
            //    maxItems: 5,
            //    overflow: 'scroll',
            //    "scroll": {
            //        "bar": {
            //            "background-color": "#ffe6e6",
            //            "border-left": "1px solid red",
            //            "border-right": "1px solid red",
            //            "border-top": "1px solid red",
            //            "border-bottom": "1px solid red",
            //        },
            //        "handle": {
            //            "background-color": "#ffe6e6",
            //            "border-left": "2px solid red",
            //            "border-right": "2px solid red",
            //            "border-top": "2px solid red",
            //            "border-bottom": "2px solid red",
            //            "border-radius": "15px"
            //        }
            //    }
            //},
            crosshairX: {},
            scaleX: {
                markers: [],
                offsetEnd: 75,
                "labels": ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日", "周平均", "月平均"]
            },
            series:
                $rootScope.data.chartList1.data
        };

        //*/**/*/*/*////
        $scope.myRender1 = {

            "height": "100%",
            "autoResize": "true"
        };
        $scope.myJson1 = {
            type: 'vbullet',
            title: {
                text: 'iBower 月營收'

            },

            tooltip: { // tooltip changes based on value
                fontSize: 14,
                borderRadius: 3,
                borderWidth: 0,
                shadow: true,
                text: '[今年：%node-value元 , 去年：%node-goal-value元]',


            },
            plot: {
                valueBox: [
                    {
                        type: 'all',
                        color: '#000',
                        placement: 'top',
                        text: '[今年：%node-value 去年：%node-goal-value]'
                    }
                ],
                alpha: 0.7,
                "border-width": 2,
                "border-color": 'black',
                "border-radius-top-left": 5,
                "border-radius-top-right": 5,
                hoverState: {
                    backgroundColor: "#909090"
                }
            },
            scaleX: {
                labels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            },
            series:
                [
                    {

                        values: ["10", "0", "0", "0"],
                        goals: ["0", "0", "0", "0"],
                        goal: {
                            backgroundColor: '#64b5f6',
                            borderWidth: 0,
                        },
                        rules: [ // rules for color
                            {
                                rule: '%v >= %g', // if greater than goal
                                backgroundColor: '#81c784'
                            },
                            {
                                rule: '%v < %g/2', // if less than half goal
                                backgroundColor: '#ef5350'
                            },
                            {
                                rule: '%v >= %g/2 && %v < %g', // if in between
                                backgroundColor: '#ffca28'
                            }
                        ]

                    }]
        };
        /*/*//*/**/
        $scope.myRender2 = {

            "height": "100%",
            "autoResize": "true"
        };
        $scope.myJson2 = {
            type: 'vbullet',
            //acked: true,
            title: {
                text: 'iBower 月營收'

            },
            scaleY: {
                refLine: {
                    lineWidth: 2,
                    lineColor: '#212121'
                }
            },
            tooltip: { // tooltip changes based on value
                fontSize: 14,
                borderRadius: 3,
                borderWidth: 0,
                shadow: true
            },
            plot: {
                valueBox: {
                    color: '#000',
                    placement: 'top',
                    text: "%v %",



                },
                alpha: 0.7,
                "border-width": 2,
                "border-color": 'black',
                "border-radius-top-left": 5,
                "border-radius-top-right": 5,
                hoverState: {
                    backgroundColor: "#909090"
                }
            },
            scaleX: {
                labels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            },
            series:
                [
                    {

                        values: ["10", "0", "0", "0"],

                        rules: [ // rules for color
                            {
                                rule: '%v >= %g', // if greater than goal
                                backgroundColor: '#81c784'
                            },
                            {
                                rule: '%v < %g/2', // if less than half goal
                                backgroundColor: '#ef5350'
                            },
                            {
                                rule: '%v >= %g/2 && %v < %g', // if in between
                                backgroundColor: '#ffca28'
                            }
                        ]

                    }]
        };



    }]);
    app.controller('ExpendController', ['$timeout', '$scope', '$rootScope', 'ExpendService', function ($timeout, $scope, $rootScope, ExpendService) {
        var vm = this;
        ExpendService.getExpend().then(function (res) {
            vm.ExpendList = res.data;
            console.log('haha', vm.ExpendList);
            //console.log('A營收B成本C人事', vm.ExpendList.A);
            vm.StartDay = new Date($.datepicker.formatDate('yy-mm-dd', new Date()));
            vm.StartDay.setDate(1);
            vm.EndDay = new Date($.datepicker.formatDate('yy-mm-dd', new Date()));
            vm.EndDay.setMonth(vm.EndDay.getMonth() + 1);
            vm.EndDay.setDate(1);
            vm.EndDay.setDate(vm.EndDay.getDate() - 1);
            vm.Acount = 0;
            vm.Atot = 0;
            vm.Bcount = 0;
            vm.Btot = 0;
            vm.Ccount = 0;
            vm.Ctot = 0;
            vm.Dtot = 0;
            vm.Etot = 0;
            vm.garlicPercent = function (mum) {
                return mum / vm.Atot * 100;
            }
            angular.forEach(vm.ExpendList.A, function (value, key) {
                vm.Acount = vm.Acount + value.Count;
                vm.Atot += value.Totle;
            });

            angular.forEach(vm.ExpendList.B, function (value, key) {
                vm.Bcount = vm.Bcount + value.Count;

                vm.Btot += value.Totle;
            });

            angular.forEach(vm.ExpendList.C, function (value, key) {
                vm.Ccount = vm.Ccount + value.Count;

                vm.Ctot += value.Totle;
            });

            angular.forEach(vm.ExpendList.D, function (value, key) {

                vm.Dtot += value.Totle;
            });

            angular.forEach(vm.ExpendList.E, function (value, key) {

                vm.Etot += value.Totle;
            });
            $("#start").datepicker({
                showOtherMonths: true,
                dateFormat: "yy-mm-dd",
                maxDate: new Date(),
                onSelect: function (start) {
                    vm.StartDay = start;
                }
            });
            $("#end").datepicker({
                maxDate: new Date(),
                showOtherMonths: true,
                dateFormat: "yy-mm-dd",
                //minDate: new Date(),
                onSelect: function (end) {
                    vm.EndDay = end;
                }
            });
            //console.log('S',vm.StartDay);
            //console.log('E',vm.EndDay);
            vm.Post = function (Start, End) {
                //console.log('S', Start);
                //console.log('E', End);
                ExpendService.getYinYaBiao(Start, End).then(function (res2) {
                    vm.ExpendList = res2.data;
                    console.log('data', vm.ExpendList);
                    vm.Acount = 0;
                    vm.Atot = 0;
                    vm.Bcount = 0;
                    vm.Btot = 0;
                    vm.Ccount = 0;
                    vm.Ctot = 0;
                    vm.Dtot = 0;
                    vm.Etot = 0;
                    angular.forEach(vm.ExpendList.A, function (value, key) {
                        vm.Acount = vm.Acount + value.Count;

                        vm.Atot += value.Totle;
                        console.log(vm.Acount);
                        console.log(vm.Atot);
                    });
                    angular.forEach(vm.ExpendList.B, function (value, key) {
                        vm.Bcount = vm.Bcount + value.Count;
                        vm.Btot += value.Totle;
                    });
                    angular.forEach(vm.ExpendList.C, function (value, key) {
                        vm.Ccount = vm.Ccount + value.Count;

                        vm.Ctot += value.Totle;
                    });
                    angular.forEach(vm.ExpendList.D, function (value, key) {
                        vm.Dtot += value.Totle;
                    });
                    angular.forEach(vm.ExpendList.E, function (value, key) {
                        vm.Etot += value.Totle;
                    });
                })
            }
        });
    }]);
    app.controller('ChenXianController', ['$timeout', '$scope', '$rootScope', 'RoleSetService', function ($timeout, $scope, $rootScope, RoleSetService) {
        var vm = this;
        // :"))
        vm.GerBiehChenXian = [
            {
                id: '0',
                Name: 'N'
            },
            {
                id: '1',
                Name: 'R'
            },
            {
                id: '2',
                Name: 'RC'
            },
            {
                id: '3',
                Name: 'RCU'
            },
            {
                id: '4',
                Name: 'RCD'
            },
            {
                id: '5',
                Name: 'CRUD'
            }

        ];
        RoleSetService.getRoleSet().then(function (response) {
            vm.CXList = response.data;
            console.log(vm.CXList);
        });

    }]);

    app.filter('pageStartFrom', [function () {
        return function (input, start) {
            start = +start;
            if (input != 'undefined')
                return input.slice(start);
        }
    }]);
    $httpProvider.interceptors.push(['$q', '$rootScope', function ($q, $rootScope) {
        return {
            'request': function (config) {
                $rootScope.loading = true;
                return $q.resolve(config);
            },
            'response': function (response) {
                $rootScope.loading = false;
                return $q.resolve(response);
            },
            'requestError': function (rejection) {
                $rootScope.loading = false;
                return $q.reject(rejection);
            },
            'responseError': function (rejection) {
                $rootScope.loading = false;
                return $q.reject(rejection);
            }
        }
    }])


})();
