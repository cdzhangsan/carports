angular.module('MyServices', [])
  .factory('getDataService', ['$q', '$http', function ($q, $http) { // 数据请求
    // var thePort = 'https://47.104.131.237'; // IP和端口
     var thePort = 'http://39.108.238.158:3000'; // IP和端口

    var noHeaderRequest = function (method, urlCode, paramets) { // url为接口路径、paramets为向后台传递参数
      let deferred = $q.defer()
      let promise = deferred.promise
      $http({
        method: method,
        url: thePort + '/v1/mg/' + urlCode,
        data: paramets
      })
        .success(function (data) {
          deferred.resolve(data)
        })
        .error(function (error) {
          deferred.reject(error)
        })
      return promise
    }
    var hasHeaderRequest = function (method, urlCode, paramets) { // url为接口路径、paramets为向后台传递参数
      let deferred = $q.defer()
      let promise = deferred.promise
      let headers = { 'x-access-token': localStorage.getItem('access-token') }; // 数据请求请求头
      $http({
        method: method,
        url: thePort + '/v1/mg/' + urlCode,
        data: paramets,
        headers: headers
      })
        .success(function (data) {
          deferred.resolve(data)
        })
        .error(function (error) {
          deferred.reject(error)
        })
      return promise
    }
    var loginFalseFun = function(){
      localStorage.removeItem('access-token');
      localStorage.removeItem('userMessage');
      localStorage.removeItem('spaceLocation');
      $state.go('login');
    }
    return {
      noHeaderRequest: noHeaderRequest,
      hasHeaderRequest: hasHeaderRequest,
      loginFalseFun: loginFalseFun
    }
  }])
  .factory('parksServe', function () { // 传递停车场数据
    var myServices = {}
    var myObject = {}
    var _set = function (data) {
      myObject = data
    }
    var _get = function () {
      return myObject
    }
    myServices.set = _set
    myServices.get = _get
    return myServices
  })
