angular.module('login', [])
  .controller('loginCtrl', function($scope, $state, $timeout, $ionicLoading, getDataService) { // 登录
    $scope.logdata = {
      uname: '18615728090',
      upwd: 'a123456'
    }
    $scope.otherLogin = false;      //第三方登录功能开关
    //判断用户登录状态开始
      var _access_token = localStorage.getItem('access-token');
      var _userMessage = localStorage.getItem('userMessage');
      if(_access_token && _userMessage){
        $scope.loginShow = false;
        _userMessage = JSON.parse(_userMessage)
        if (_userMessage.type == 5) {
          $state.go('app.sharePark')
        } else {
          $state.go('management')
        }
      }else{
        $scope.loginShow = true;
      }
    //判断用户登录状态结束



    $scope.login = function() {
      let params = {}
      params.mobile = $scope.logdata.uname
      params.password = $scope.logdata.upwd
      $ionicLoading.show({
        template: '<i class="icon ion-load-c"></i><br>请稍后...'
      });
      getDataService.noHeaderRequest('post', 'get/users/mobile', params)
        .then(function(data) {
          $ionicLoading.hide();
          if (data.status == 102) {
            localStorage.setItem('access-token', data.token); // 本地存储请求token(每次登陆时更新)
            localStorage.setItem('userMessage', JSON.stringify(data.data)); // 本地存储登录用户信息
            if (data.data.type == 5) {
              $state.go('app.sharePark')
            } else {
              $state.go('management')
            }
            $scope.logdata = { uname: null, upwd: null }
          } else {
            $scope.hintText = data.message
            $scope.hintShow = true
            $timeout(function() {
              $scope.hintShow = false
            }, 1000)
          }
        }).catch(function(err) {
        $ionicLoading.hide();
          $scope.hintText = '登录失败'
          $scope.hintShow = true
          $timeout(function() {
            $scope.hintShow = false
          }, 1000)
        })
    }
  })
  .controller('registCtrl', function($scope, $state, $interval, $timeout, getDataService) { // 注册
    var phoneRegexp = /^1[3|4|5|7|8][0-9]{9}$/
    $scope.btnBackground = 'notGet'; // 获取验证码按钮背景色
    $scope.btnDisabled = true; // 获取验证码按钮能否点
    $scope.regist = {
      phoneNum: '',
      code: ''
    }

    $scope.toPhone = function() {
      if (phoneRegexp.test($scope.regist.phoneNum)) {
        $scope.btnBackground = 'canGet'
        $scope.btnDisabled = false
      } else {
        $scope.btnBackground = 'notGet'
        $scope.btnDisabled = true
      }
    }

    $scope.codeTime = '获取验证码'
    $scope.getCode = function() { // 获取验证码
      getDataService.noHeaderRequest('post', 'get/smscode', { mobile: $scope.regist.phoneNum })
        .then(function(data) {
          if (data.status == 201) {
            var num = 60
            var timer = $interval(function() {
              num--
              $scope.codeTime = num + '秒'
              if (num == 0) {
                $interval.cancel(timer)
                $scope.codeTime = '重新获取'
              }
            }, 1000)
          } else {
            $scope.hintText = data.message
            $scope.hintShow = true
            hintHide()
          }
        }).catch(function(err) {
          $scope.hintText = '获取验证码失败'
          $scope.hintShow = true
          hintHide()
        })
    }

    $scope.changeNumber = function() { // 注册下一步
      getDataService.noHeaderRequest('post', 'post/smscode', { smscode: $scope.regist.code })
        .then(function(data) {
          if (data.status == 202) {
            $state.go('regSetPassword', { phone: $scope.regist.phoneNum })
          } else {
            $scope.hintText = data.message
            $scope.hintShow = true
            hintHide()
          }
        }).catch(function(err) {
          $scope.hintText = err.message
          $scope.hintShow = true
          hintHide()
        })
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false
      }, 1000)
    }
  })
  .controller('regSetPasswordCtrl', function($scope, $stateParams, $state, $timeout, getDataService) { // 设置密码
    var pwdRegexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/
    $scope.hintShow = false
    $scope.regdata = { // 用户输入的注册信息
      pwd: '',
      rpwd: ''
    }
    $scope.register = {
      pwd: '',
      mobile: $stateParams.phone
    }
    $scope.regSub = function() { // 提交注册
      if (!pwdRegexp.test($scope.regdata.pwd)) {
        $scope.hintText = '密码格式有误(6-10位，数字与字母组合)'
        $scope.hintShow = true
        hintHide()
      } else if ($scope.regdata.pwd != $scope.regdata.rpwd) {
        $scope.hintText = '两次密码不一致'
        $scope.hintShow = true
        hintHide()
      } else {
        $scope.register.pwd = $scope.regdata.pwd
        getDataService.noHeaderRequest('post', 'register', $scope.register)
          .then(function(data) {
            if (data.status == 101) {
              $state.go('login')
            } else {
              $scope.hintText = data.message
              $scope.hintShow = true
              hintHide()
            }
          }).catch(function(err) {
            $scope.hintText = '注册失败'
            $scope.hintShow = true
            hintHide()
          })
      }
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false
      }, 1000)
    }
  })
