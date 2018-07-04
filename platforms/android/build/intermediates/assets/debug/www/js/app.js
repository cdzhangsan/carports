var appModel = angular.module('starter', ['ui.router', 'ionic', 'ngCordova', 'login', 'sharePark', 'myList', 'MyServices', 'management', 'Driective'])

appModel.run(function ($rootScope, $ionicPlatform, $state, $location, $cordovaToast, $cordovaKeyboard, $ionicHistory, $timeout) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
      cordova.plugins.Keyboard.disableScroll(true)
    }
    if (window.StatusBar) {
      StatusBar.styleDefault()
    }
    window.addEventListener('native.keyboardshow', function (e) { // 监听键盘开启
      $rootScope.addlistkeybord = true
      document.body.classList.add('keyboard-open')
    })
    window.addEventListener('native.keyboardhide', function (e) { // 监听键盘关闭
      $rootScope.addlistkeybord = false
    })
  })
  $ionicPlatform.registerBackButtonAction(function (e) { // 安卓返回键
    let cont = $location.path()
    e.preventDefault()
    if ($rootScope.addlistkeybord) {
      cordova.plugins.Keyboard.close(); // 关闭键盘
      $rootScope.addlistkeybord = false
    } else if (document.getElementsByClassName('gearDate').length > 0) {
      document.body.removeChild(document.getElementsByClassName('gearDate')[0])
    } else if (document.getElementsByClassName('gearDatetime').length > 0) {
      document.body.removeChild(document.getElementsByClassName('gearDatetime')[0])
    } else {
      if (cont == '/login' || cont == '/app/sharePark' || cont == '/management') {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp()
        } else {
          $rootScope.backButtonPressedOnceToExit = true
          $cordovaToast.showShortBottom('再按一次退出车桩位')
          $timeout(function () {
            $rootScope.backButtonPressedOnceToExit = false
          }, 2000)
        }
      }else if (cont == '/subscribeSuccess') {
        $state.go('app.sharePark')
      }else if (cont == '/companyManagement' || cont == '/userManagement' || cont == '/parkMan' || cont == '/carportMan' || cont == '/chargMan' || cont == '/mMySet') {
        $state.go('management')
      } else if ($ionicHistory.backView()) {
        if ($cordovaKeyboard.isVisible()) {
          $cordovaKeyboard.close()
        } else {
          $ionicHistory.goBack()
        }
      } else {
        $rootScope.backButtonPressedOnceToExit = true
        $cordovaToast.showShortBottom('再按一次退出车桩位')
        $timeout(function () {
          $rootScope.backButtonPressedOnceToExit = false
        }, 2000)
      }
    }
    return false
  }, 101)
})
  .controller('indexCtrl', function ($scope, $rootScope) {
    // $rootScope.baseUrl = 'http://192.168.20.187:3000'
    $rootScope.baseUrl='http://39.108.238.158:3000'
    getUSerLocation()
    function getUSerLocation () { // 定位用户位置
      var map, geolocation
      map = new AMap.Map('container', {
        resizeEnable: true
      })
      map.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          // zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition: 'RB'
        })
        map.addControl(geolocation)
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', onComplete); // 返回定位信息
        AMap.event.addListener(geolocation, 'error', onError); // 返回定位出错信息
      })

      function onComplete (data) {
        var option = {}
        option.address = data.formattedAddress
        option.lng = data.position.lng
        option.lat = data.position.lat
        alert(JSON.stringify(option))
        localStorage.setItem('spaceLocation', JSON.stringify(option)); // 保存定位经纬度(临时)
      }

      function onError (data) {
        console.log(data);
        console.log('定位失败' + data)
      }
    }
  })
