/**
 * angular主应用的控制器，所有功能初始化之前首先加载此文件
 */
define([
    'app',
    'constants'
], function (app, constants) {
    app.registerController('mainCtrl', ['$scope', '$rootScope', '$state', '$$finder', '$timeout', 'layer', '$mdPanel',
        function ($scope, $rootScope, $state, $$finder, $timeout, layer, $mdPanel) {
            $rootScope.isLogin = false;

            /**
             * 回到主页
             */
            $rootScope.goHome = function () {
                $rootScope.toLink(constants.str.homeTarget, {});
            };

            /**
             * 访问权限校验
             * @param targetUrl
             */
            $rootScope.access = function (targetUrl) {
                if ($rootScope.isLogin) {
                    $$finder.post("checkAccess", {
                        "userName": $rootScope.userInfo.userName,
                        "targetUrl": targetUrl
                    }, {
                        success: function (data) {
                            if (data.statusCode != 200 || !data.content) {
                                $rootScope.goHome();
                            }
                        },
                        error: function (e) {
                            $rootScope.goHome();
                        }
                    });
                } else {
                    $rootScope.goHome();
                }


            };

            // 全局的后端服务响应标志
            $rootScope.determinateDis = true;

            $rootScope.menu = {
                isOpen: false
            };

            $rootScope.pageStyle = {
                pageOffset: 'mdl-cell--1-offset',
            };

            var chgWindow = function () {
                if (window.innerWidth <= 1116) {
                    $rootScope.pageStyle.pageOffset = '';
                } else if (window.innerWidth <= 1233) {
                    $rootScope.pageStyle.pageOffset = 'mdl-cell--1-offset';
                } else {
                    $rootScope.pageStyle.pageOffset = 'mdl-cell--2-offset';
                }
            };

            chgWindow();

            window.onresize = function () {
                $rootScope.$apply(function () {
                    chgWindow();
                });

            };

            $rootScope.userInfo = {};

            $rootScope.loginButton = {};

            document.addEventListener('visibilitychange', function () {
                if ("visible" === document.visibilityState && !$rootScope.menu.isOpen) {
                    $rootScope.$apply(function () {
                        $rootScope.menu.isOpen = true;
                    })
                }
            });


            /**
             * 跳转到指定路由地址
             * @param target 目标路由地址
             */
            $rootScope.toLink = function (target, params) {
                if (target && target !== "") {
                    $state.go(target, params);
                } else {
                    $rootScope.goHome();
                }
            };

            // 菜单和标题的初始化，后期调整，菜单放到后端配置
            $rootScope.baseData = {
                errorTitle: ''
            };

            $rootScope.restMenu = function () {
                $rootScope.baseData.menus = [{
                    target: "login",
                    icon: "account_circle",
                    name: "登录"
                }];
                $rootScope.loginButton = $rootScope.baseData.menus[0];
            };

            $rootScope.restMenu();

            let getMenu = function () {
                $$finder.post("getMenu", {
                    "userName": $rootScope.userInfo.userName
                }, {
                    success: function (data) {
                        if (data.statusCode == 200 && data.content.length > 0) {
                            $rootScope.baseData.errorTitle = "功能菜单";
                            $rootScope.baseData.menus = data.content;
                            angular.forEach($rootScope.baseData.menus, function (data, index) {
                                if (data.target == 'login') {
                                    $rootScope.loginButton = data;
                                    if ($rootScope.userInfo.userEmployeeName) {
                                        $rootScope.loginButton.name = $rootScope.userInfo.userEmployeeName;
                                    }
                                }
                            });
                        } else {
                            $rootScope.baseData.errorTitle = "未获取到功能!";
                            layer.alert("未获取到菜单，请联系管理员！");
                        }
                    },
                    error: function (e) {
                        console.error(e);
                        $rootScope.baseData.errorTitle = "未获取到功能菜单!";
                    }
                });
            };

            $rootScope.getConfig = function () {
                $$finder.post('configSys', {}, {
                        success: function (data) {
                            if (data.statusCode == 200) {
                                $rootScope.config = data.content;
                            }
                            $$finder.post('queryLogin', {}, {
                                success: function (data) {
                                    if (data.statusCode == 200) {
                                        $rootScope.userInfo = data.content;
                                        $rootScope.loginButton.isDisable = true;
                                        $rootScope.loginButton.name = $rootScope.userInfo.userEmployeeName;
                                        $rootScope.isLogin = true;
                                        getMenu();
                                    } else {
                                        $rootScope.isLogin = false;
                                    }
                                },
                                error: function (e) {
                                    console.error(e);
                                }
                            });
                        },
                        error: function (e) {
                            console.error(e);
                        }
                    }
                )
            };

            $rootScope.getConfig();

            $scope.showContentMenu = function ($event) {
                if ($rootScope.userInfo.userEmployeeName) {
                    layer.confirm('是否需要切换账号重新登录？', {
                        ok: function () {
                            $rootScope.userInfo = {};
                            $rootScope.loginButton.name = "登录";
                            $rootScope.restMenu();
                            $rootScope.goHome();
                            $$finder.post('logout', {}, {
                                success: function (data) {
                                    $rootScope.isLogin = false;
                                    showLoginPage($event);
                                },
                                error: function (e) {
                                    $rootScope.isLogin = false;
                                    showLoginPage($event);
                                    console.error(e);
                                }
                            });

                        },
                        cancel: function () {
                            return false;
                        }
                    });
                } else {
                    showLoginPage($event);
                }

            };

            let showLoginPage = function ($event) {
                let template = 'template/menuPanel/panel.login.tpl.html';
                let position = $mdPanel.newPanelPosition()
                    .relativeTo($event.target)
                    .addPanelPosition(
                        $mdPanel.xPosition.ALIGN_START,
                        $mdPanel.yPosition.BELOW
                    );

                var config = {
                    id: 'content_loginPanel',
                    attachTo: angular.element(document.body),
                    controller: function (mdPanelRef) {
                        this.user = {
                            userName: null,
                            passWord: null,
                            key: null
                        };

                        this.login = function () {
                            $$finder.post("login", this.user, {
                                success: function (data) {
                                    if (data.statusCode == 200) {
                                        $rootScope.userInfo = data.content;
                                        layer.alert("登录成功，欢迎：" + $rootScope.userInfo.userEmployeeName);
                                        getMenu();
                                        $rootScope.isLogin = true;
                                        $rootScope.goHome();
                                    } else {
                                        $rootScope.isLogin = false;
                                        $rootScope.restMenu();
                                        $rootScope.userInfo = {};
                                        layer.alert(data.message)
                                        $rootScope.goHome();
                                    }
                                },
                                error: function (e) {
                                    console.error(e);
                                }
                            });
                        };

                        this.closeMenu = function () {
                            mdPanelRef && mdPanelRef.close();
                        };
                    },
                    controllerAs: 'ctrl',
                    templateUrl: template,
                    position: position,
                    openFrom: $event,
                    zIndex: 100,
                    propagateContainerEvents: true,
                    clickOutsideToClose: true
                };
                $mdPanel.open(config);
            };

            $scope.actions = function (target, $event) {
                if (target != 'login') {
                    $rootScope.toLink(target, {});
                } else {
                    $scope.showContentMenu($event);
                }
            }

        }]
    )
});