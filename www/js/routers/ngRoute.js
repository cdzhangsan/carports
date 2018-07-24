var app = angular.module('starter')
  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $provide) {
    //$ionicConfigProvider.scrolling.jsScrolling(false); //使用原生滚动
    //ionic.Platform.isFullScreen = true;
    //$ionicConfigProvider.views.swipeBackEnabled(false); //ionic禁止滑动返回操作---适配iOS平台
    //设置设备样式
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');
    //$ionicConfigProvider.tabs.position('bottom');

    //center:标题居中，left:标题居左，right:标题居右
    /*$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    //设置返回按钮属性
    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    //设置设备控件
    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');*/
    $stateProvider
      .state('login', { //登录页面
        url: '/login',
        cache:false,
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })
      .state('regist', { //注册页面
        url: '/regist',
        templateUrl: 'templates/regist.html',
        controller: 'registCtrl'
      })
      .state('regSetPassword', { //设置密码
        url: '/regSetPassword',
        params: { "phone": null },
        templateUrl: 'templates/regSetPassword.html',
        controller: 'regSetPasswordCtrl'
      })


      .state('app', {
        url: '/app',
        abstract: true,
        cache: false,
        templateUrl: 'templates/client/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.sharePark', { //共享车位
        url: '/sharePark',
        params: { searchCondition: null },
        views: {
          'menuContent': {
            templateUrl: 'templates/client/sharePark/sharePark.html',
            controller: 'shareParkCtrl'
          }
        }
      })
      .state('searchPark', { //车位查询
        url: '/searchPark',
        cache: false,
        params: { "address": null },
        templateUrl: 'templates/client/sharePark/searchPark.html',
        controller: 'searchParkCtrl'
      })
      .state('demandCarport', { //求租车位
        url: '/demandCarport',
        cache: false,
        params: {demandId: null,orderId:null},
        templateUrl: 'templates/client/sharePark/demandCarport.html',
        controller: 'demandCarportCtrl'
      })
      .state('parkDetails', { //停车场详情
        url: '/parkDetails',
        cache: false,
        templateUrl: 'templates/client/sharePark/parkDetails.html',
        controller: 'parkDetailsCtrl'
      })
      .state('carportDetails', { //车位详情
        url: '/carportDetails',
        cache: false,
        params:{id:null},
        templateUrl: 'templates/client/sharePark/carportDetails.html',
        controller: 'carportDetailsCtrl'
      })
      .state('subscribeSure', { //车位预约
        url: '/subscribeSure',
        params:{carportMes:null,id:null},
        templateUrl: 'templates/client/sharePark/subscribeSure.html',
        controller: 'subscribeSureCtrl'
      })
      .state('subscribeSuccess', { //预约成功
        url: '/subscribeSuccess',
        params:{carportMes:null,id:null},
        templateUrl: 'templates/client/sharePark/subscribeSuccess.html',
        controller: 'subscribeSuccessCtrl'
      })

      .state('myInOut', { //我的收支
        url: '/myInOut',
        templateUrl: 'templates/client/myList/myInOut.html',
        controller: 'myInOutCtrl'
      })
      .state('evaluate', { //发表评价
        url: '/evaluate',
        cache: false,
        params:{orderId:null,orderPid:null},
        templateUrl: 'templates/client/myList/evaluate.html',
        controller: 'evaluateCtrl'
      })
      .state('myOrder', { //我的订单
        url: '/myOrder',
        cache: false,
        params:{orderState:null},
        templateUrl: 'templates/client/myList/myOrder.html',
        controller: 'myOrderCtrl'
      })
      .state('orderDetails', { //订单详情
        url: '/orderDetails',
        params: {type:null,carOption: null,orderId:null},
        templateUrl: 'templates/client/myList/orderDetails.html',
        controller: 'orderDetailsCtrl'
      })
      .state('myCar', { //我的车辆
        url: '/myCar',
        cache: false,
        templateUrl: 'templates/client/myList/myCar.html',
        controller: 'myCarCtrl'
      })
      .state('bindCar', { //绑定车辆
        url: '/bindCar',
        params: { "carMes": null,carType:null },
        templateUrl: 'templates/client/myList/bindCar.html',
        controller: 'bindCarCtrl'
      })
      .state('myCarport', { //我的车位
        url: '/myCarport',
        cache: false,
        templateUrl: 'templates/client/myList/myCarport.html',
        controller: 'myCarportCtrl'
      })
      .state('bindCarport', { //车位绑定
        url: '/bindCarport',
        templateUrl: 'templates/client/myList/bindCarport.html',
        controller: 'bindCarportCtrl'
      })
      .state('showCarport', { //发布车位
        url: '/showCarport',
        params: { carportId: null ,orderId:null,type:null},
        templateUrl: 'templates/client/myList/showCarport.html',
        controller: 'showCarportCtrl'
      })
      .state('myMessage', { //我的消息
        url: '/myMessage',
        templateUrl: 'templates/client/myList/myMessage.html',
        controller: 'myMessageCtrl'
      })
      .state('myCustomer', { //我的客服
        url: '/myCustomer',
        templateUrl: 'templates/client/myList/myCustomer.html',
        controller: 'myCustomerCtrl'
      })
      .state('mySet', { //我的设置
        url: '/mySet',
        cache: false,
        templateUrl: 'templates/client/myList/mySet.html',
        controller: 'mySetCtrl'
      })
      .state('setNickName', { //设置昵称
        url: '/setNickName',
        params: { "setType": null },
        templateUrl: 'templates/client/myList/setNickName.html',
        controller: 'setNickNameCtrl'
      })
      .state('changePhoneNumberFirst', { //更换手机号第一页
        url: '/changePhoneNumberFirst',
        templateUrl: 'templates/client/myList/changePhoneNumberFirst.html',
        controller: 'changePhoneNumberFirstCtrl'
      })
      .state('changeNumber', { //更换手机号第二页
        url: '/changeNumber',
        templateUrl: 'templates/client/myList/changeNumber.html',
        controller: 'changeNumberCtrl'
      })
      .state('setEmail', { //设置邮箱
        url: '/setEmail',
        templateUrl: 'templates/client/myList/setEmail.html',
        controller: 'setEmailCtrl'
      })
      .state('setPassword', { //修改密码
        url: '/setPassword',
        params: { "setType": null },
        cache:false,
        templateUrl: 'templates/client/myList/setPassword.html',
        controller: 'setPasswordCtrl'
      })
      .state('accountNumber', { //收支账号
        url: '/accountNumber',
        templateUrl: 'templates/client/myList/accountNumber.html',
        controller: 'accountNumberCtrl'
      })
      .state('blacklist', { //黑名单
        url: '/blacklist',
        templateUrl: 'templates/client/myList/blacklist.html',
        controller: 'blacklistCtrl'
      })


      .state('management', { //管理端首页
        url: '/management',
        cache: false,
        templateUrl: 'templates/management/management.html',
        controller: 'managementCtrl'
      })
      .state('companyManagement', { //公司管理
        url: '/companyManagement',
        cache: false,
        templateUrl: 'templates/management/companyManagement.html',
        controller: 'companyManagementCtrl'
      })
      .state('companyMess', { //公司信息、添加公司
        url: '/companyMess',
        params: { "companyType": null,companyId:null},
        templateUrl: 'templates/management/companyMess.html',
        controller: 'companyMessCtrl'
      })
      .state('userManagement', { //用户管理
        url: '/userManagement',
        cache: false,
        templateUrl: 'templates/management/userManagement.html',
        controller: 'userManagementCtrl'
      })
      .state('adduser', { //用户信息、添加用户
        url: '/adduser',
        params: { "userType": null,userId:null},
        templateUrl: 'templates/management/adduser.html',
        controller: 'adduserCtrl'
      })
      .state('parkMan', { //停车场管理
        url: '/parkMan',
        cache: false,
        templateUrl: 'templates/management/parkMan.html',
        controller: 'parkManCtrl'
      })
      .state('addpark', { //添加停车场、停车场信息
        url: '/addpark',
        params: { "parkType": null,parkId:null,"address": null},
        templateUrl: 'templates/management/addpark.html',
        controller: 'addparkCtrl'
      })
      .state('carportMan', { //车位管理
        url: '/carportMan',
        cache: false,
        templateUrl: 'templates/management/carportMan.html',
        controller: 'carportManCtrl'
      })
      .state('addCarport', { //添加车位、车位信息
        url: '/addCarport',
        params: { "carportType": null,carportId:null},
        templateUrl: 'templates/management/addCarport.html',
        controller: 'addCarportCtrl'
      })
      .state('chargMan', { //充电桩管理
        url: '/chargMan',
        cache: false,
        templateUrl: 'templates/management/chargMan.html',
        controller: 'chargManCtrl'
      })
      .state('addCharg', { //添加充电桩、充电桩信息
        url: '/addCharg',
        params: { "chargeType": null,chargeId:null},
        templateUrl: 'templates/management/addCharg.html',
        controller: 'addChargCtrl'
      })
      .state('mMySet', { //管理端我的设置
        url: '/mMySet',
        cache: false,
        templateUrl: 'templates/management/mMySet.html',
        controller: 'mMySetCtrl'
      })


    $urlRouterProvider.otherwise('/login');
  })
