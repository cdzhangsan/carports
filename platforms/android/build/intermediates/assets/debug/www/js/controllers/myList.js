angular.module('myList', [])

  .controller('myInOutCtrl', function($scope) { //我的收支

  })
  .controller('myOrderCtrl', function($scope, $stateParams, $ionicPopover, $state, $timeout, getDataService) { //我的订单
    $scope.userType = '车主';
    $scope.carUser = true;
    $scope.selectType = 'publish'; //选择的状态
    // $scope.orderState='no';  //订单状态
    // console.log($stateParams.orderState);
    $scope.userPopover = $ionicPopover.fromTemplateUrl('userPopover', {
      scope: $scope
    }).then(function(popop) {
      $scope.userPopover = popop;
    });
    $scope.choiceUser = function(event) { //打开选择框
      $scope.options = ['车主', '业主'];
      $scope.userPopover.show(event);
    };
    $scope.closeuserPopover = function() { //关闭选择框
      $scope.userPopover.hide();
    };
    $scope.sureuserPopover = function(option) { //确认选择框
      if (option === '业主') {
        $scope.carUser = false;
        $scope.getowerOrder($scope.selectType);
      } else {
        $scope.carUser = true;
        $scope.getOrder($scope.selectType);
      };
      $scope.userType = option;
      $scope.userPopover.hide();
    };
    $scope.$on('$destroy', function() { // 清除浮动框
      $scope.userPopover.remove();
    });

    $scope.orderNavBtns = { //我的订单导航
      publish: 'activat', //已发布
      subscribe: '', //已预约
      going: '', //进行中
      pay: '', //待支付
      done: '', //已完成
      evaluate: '' //已评价
    };
    $scope.publishShow = true; //车主已发布页面显示
    function carNavs() { //车主导航显示
      $scope.navigator = false; //导航按钮是否显示
      $scope.communicat = false; //即时通讯按钮是否显示
      $scope.modprice = false; //修改支付金额
      $scope.stSure = false; //停车确认
      $scope.paySucc = false; //支付完成
      $scope.stSucc = false; //停车完成
      $scope.evaluate = false; //评价
      $scope.black = false; //加入黑名单
      $scope.deletOrder = false; //删除订单
    };
    $scope.orderMes = []; //订单信息
    getOrderMes('get/buyinginfos/userid');
    $scope.getOrder = function(type) { //车主导航点击函数
      $scope.selectType = type;
      $scope.orderNavBtns = { publish: '', subscribe: '', going: '', pay: '', done: '', evaluate: '' };
      if (type === 'publish') {
        $scope.publishShow = true;
        $scope.orderNavBtns.publish = 'activat';
        getOrderMes('get/buyinginfos/userid', 1);
      } else if (type === 'subscribe') {
        carNavs();
        $scope.navigator = true;
        $scope.communicat = true;
        $scope.stSure = true;
        $scope.publishShow = false;
        $scope.orderNavBtns.subscribe = 'activat';
        getOrderMes('get/transinfo/status', 1, { status: 1 });
      } else if (type === 'going') {
        carNavs();
        $scope.stSucc = true;
        $scope.communicat = true;
        $scope.publishShow = false;
        $scope.orderNavBtns.going = 'activat';
        getOrderMes('get/transinfo/status', 1, { status: 2 });
      } else if (type === 'pay') {
        carNavs();
        $scope.publishShow = false;
        $scope.communicat = true;
        $scope.paySucc = true;
        $scope.orderNavBtns.pay = 'activat';
        getOrderMes('get/transinfo/status', 1, { status: 3 });
      } else if (type === 'done') {
        carNavs();
        $scope.publishShow = false;
        $scope.deletOrder = true;
        $scope.orderNavBtns.done = 'activat';
        getOrderMes('get/transinfo/status', 1, { status: 4 });
      } else {
        carNavs();
        $scope.evaluate = true;
        $scope.black = true;
        $scope.publishShow = false;
        $scope.orderNavBtns.evaluate = 'activat';
        getOrderMes('get/transinfo/notappraised', 1);
      }
    };

    $scope.owerOrderNavBtns = { //我的订单导航
      publish: 'activat', //已发布
      subscribe: '', //已预约
      going: '', //进行中
      pay: '', //待支付
      done: '', //已完成
      evaluate: '' //已评价
    };
    $scope.ownerpublishShow = true; //已发布页面显示
    function ownerNavs() { //业主导航
      $scope.sureOrder = false; //确认订单
      $scope.cancelOrder = false; //取消订单
      $scope.ocommunicat = false; //即时通讯按钮是否显示
      $scope.omodprice = false; //修改支付金额
      $scope.oevaluate = false; //评价
      $scope.oblack = false; //加入黑名单
      $scope.odeletOrder = false; //删除订单
    };
    $scope.getowerOrder = function(type) { //业主导航点击函数
      $scope.selectType = type;
      $scope.owerOrderNavBtns = { publish: '', subscribe: '', going: '', pay: '', done: '', evaluate: '' };
      $scope.ownerpublishShow = false;
      if (type === 'publish') {
        $scope.ownerpublishShow = true;
        $scope.owerOrderNavBtns.publish = 'activat';
        getOrderMes('get/sellinginfos/id', 2);
      } else if (type === 'subscribe') {
        ownerNavs();
        $scope.sureOrder = true;
        $scope.cancelOrder = true;
        $scope.owerOrderNavBtns.subscribe = 'activat';
        getOrderMes('get/sellinginfos/status', 2, { status: 1 });
      } else if (type === 'going') {
        ownerNavs();
        $scope.ocommunicat = true;
        $scope.owerOrderNavBtns.going = 'activat';
        getOrderMes('get/sellinginfos/status', 2, { status: 2 });
      } else if (type === 'pay') {
        ownerNavs();
        $scope.ocommunicat = true;
        $scope.omodprice = true;
        $scope.owerOrderNavBtns.pay = 'activat';
        getOrderMes('get/sellinginfos/status', 2, { status: 3 });
      } else if (type === 'done') {
        ownerNavs();
        $scope.odeletOrder = true;
        $scope.owerOrderNavBtns.done = 'activat';
        getOrderMes('get/sellinginfos/status', 2, { status: 4 });
      } else {
        ownerNavs();
        $scope.oevaluate = true;
        $scope.oblack = true;
        $scope.owerOrderNavBtns.evaluate = 'activat';
        getOrderMes('get/transinfo/notappraised', 1);
      }
    }
    $scope.toDetail = function(mes) { //跳转到订单详情
      $state.go('orderDetails', { type: $scope.userType, carOption: $scope.selectType, orderId: mes.id });
    };

    function getOrderMes(url, type, status = {}) { //获取订单信息
      getDataService.hasHeaderRequest('post', url, status)
        .then(function(data) {
          console.log(data);
          $scope.orderMes.splice(0, $scope.orderMes.length);
          if (data.status == 102) {
            data.data.forEach(function(element) {
              if (element.hasOwnProperty('slotpic')) {
                if (!element.slotpic) {
                  if (type === 1) {
                    element.slotpic = 'img/car.png';
                  } else {
                    element.slotpic = 'img/parkIcon.png';
                  }
                };
              };
              if (element.hasOwnProperty('stime')) {
                if (element.stime && element.etime) {
                  element.duration = calculateHours(element.stime, element.etime);
                } else {
                  element.duration = 0;
                }
              };
              $scope.orderMes.push(element);
            });
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            localStorage.removeItem('access-token');
            localStorage.removeItem('userMessage');
            $state.go('login');
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(data) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        });
    };

    $scope.step_car = function(type, order, event) { //停车确认、停车完成
      event.stopPropagation();
      let argument_obj = {};
      argument_obj.id = order.id;
      argument_obj.slotno = order.slotno;
      argument_obj.carid = order.carid;
      argument_obj.etime = order.etime;
      if (type === 'sure') {
        argument_obj.status = 2;
      } else if (type === 'succ') {
        argument_obj.status = 3;
      };
      getDataService.hasHeaderRequest('post', 'put/transinfo/status', argument_obj)
        .then(function(data) {
          if (data.status == 101) {
            if (type === 'sure') {
              getOrderMes('get/transinfo/status', 1, { status: 1 });
            } else if (type === 'succ') {
              getOrderMes('get/transinfo/status', 1, { status: 2 });
            };
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            localStorage.removeItem('access-token');
            localStorage.removeItem('userMessage');
            $state.go('login');
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          };
        }).catch(function(data) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        });
    };
    $scope.payAll = function(order, event) { //支付完成
      event.stopPropagation();
      let argument_obj = {};
      argument_obj.id = order.id;
      argument_obj.cid = order.carid;
      argument_obj.pid = order.slotno;
      getDataService.hasHeaderRequest('post', 'put/transinfo/end', argument_obj)
        .then(function(data) {
          if (data.status == 101) {
            getOrderMes('get/transinfo/status', 1, { status: 3 });
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            localStorage.removeItem('access-token');
            localStorage.removeItem('userMessage');
            $state.go('login');
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          };
        }).catch(function(data) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        });
    };

    $scope.deltOrder = function(order, type, event) { //取消订单
      event.stopPropagation();
      let url, subobj = { id: order.id };
      if (type === 'caruser') {
        url = 'destroy/buyinginfos/id';
      } else {
        url = 'destroy/sellinginfos/id';
        subobj.pid = order.pid;
      };
      getDataService.hasHeaderRequest('post', url, subobj)
        .then(function(data) {
          console.log(data);
          if (data.status == 101) {
            if (type === 'caruser') {
              getOrderMes('get/buyinginfos/userid', 1);
            } else {
              getOrderMes('get/sellinginfos/id', 2);
            };
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            localStorage.removeItem('access-token');
            localStorage.removeItem('userMessage');
            $state.go('login');
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          };
        }).catch(function(data) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        });
    };

    $scope.deletorder = function(orderId, type, event) { //删除订单
      event.stopPropagation();
      let url = '';
      if (type === 'caruser') {
        url = 'destroy/transInfo/completed';
      } else {
        url = 'destroy/sellinginfos/completed';
      };
      getDataService.hasHeaderRequest('post', url, { id: orderId })
        .then(function(data) {
          console.log(data);
          if (data.status == 101) {
            if (type === 'caruser') {
              getOrderMes('get/transinfo/status', 1, { status: 4 });
            } else {
              getOrderMes('get/sellinginfos/status', 2, { status: 4 });
            };
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            localStorage.removeItem('access-token');
            localStorage.removeItem('userMessage');
            $state.go('login');
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          };
        }).catch(function(data) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        });
    };

    function calculateHours(startTime, endTime) { //计算停车时长
      let duration, _timeDiffer;
      if (startTime && endTime) {
        _timeDiffer = Date.parse(endTime) - Date.parse(startTime); //时间差的毫秒数
        duration = Math.floor(_timeDiffer / (60 * 60 * 1000))
      };
      return duration;
    };

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    };
  })
  .controller('orderDetailsCtrl', function($scope, $stateParams, $timeout, getDataService) { //订单详情
    $scope.ordermes = {}; //订单详情数组
    $scope.doing = false;
    $scope.simple = false;
    var carOption = $stateParams.carOption; //车主导航调过来参数
    if ($stateParams.type == '车主') { //是车主还是业主
      $scope.cartype = true;
      if (carOption === 'publish') { //已发布详情
        $scope.simple = true;
        getOrderMes('get/buyinginfos/userid', $stateParams.orderId);
      } else if (carOption === 'subscribe') {
        getOrderMes('get/transinfo/status', $stateParams.orderId, 1);
      } else if (carOption === 'going') {
        getOrderMes('get/transinfo/status', $stateParams.orderId, 2);
      } else if (carOption === 'pay') {
        getOrderMes('get/transinfo/status', $stateParams.orderId, 3);
      } else if (carOption === 'done') {
        getOrderMes('get/transinfo/status', $stateParams.orderId, 4);
      } else {
        getOrderMes('get/transinfo/notappraised', $stateParams.orderId);
      }
    } else {
      $scope.cartype = false;
      if (carOption === 'publish') { //已发布详情
        $scope.simple = true;
        getOrderMes('get/sellinginfos/id', $stateParams.orderId);
      } else if (carOption === 'subscribe') {
        getOrderMes('get/sellinginfos/status', $stateParams.orderId, 1);
      } else if (carOption === 'going') {
        getOrderMes('get/sellinginfos/status', $stateParams.orderId, 2);
      } else if (carOption === 'pay') {
        getOrderMes('get/sellinginfos/status', $stateParams.orderId, 3);
      } else if (carOption === 'done') {
        getOrderMes('get/sellinginfos/status', $stateParams.orderId, 4);
      } else {
        getOrderMes('get/transinfo/notappraised', $stateParams.orderId);
      }
    };

    function getOrderMes(url, orderId, status) { //获取订单详情信息
      getDataService.hasHeaderRequest('post', url, { id: orderId, status: status })
        .then(function(data) {
          if (data.status == 102) {
            let result = data.data[0];
            $scope.ordermes = result;
            if (result.hasOwnProperty('slotpic')) {
              if (!result.slotpic) {
                $scope.ordermes.slotpic = 'img/parkIcon.png';
              };
            };
            if (result.hasOwnProperty('stime')) {
              if (result.stime && result.etime) {
                result.duration = calculateHours(result.stime, result.etime);
              } else {
                result.duration = 0;
              }
            };
            if (result.hasOwnProperty('staketype')) {
              if (result.staketype) {
                if (result.state) {
                  if (result.staketype == 1) {
                    chargType = '直流';
                  } else if (result.staketype == 2) {
                    chargType = '交流';
                  } else {
                    chargType = '其它';
                  };
                  $scope.ordermes.charg = chargType + '、' + result.power + 'KW' + '、正常';
                } else {
                  $scope.ordermes.charg = '异常';
                };
              } else {
                $scope.ordermes.charg = '无';
              };
            };
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            localStorage.removeItem('access-token');
            localStorage.removeItem('userMessage');
            $state.go('login');
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(data) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        });
    };

    function calculateHours(startTime, endTime) { //计算停车时长
      let duration, _timeDiffer;
      if (startTime && endTime) {
        _timeDiffer = Date.parse(endTime) - Date.parse(startTime); //时间差的毫秒数
        duration = Math.floor(_timeDiffer / (60 * 60 * 1000))
      };
      return duration;
    };

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    };
  })
  .controller('evaluateCtrl', function($scope, $state, $stateParams, $timeout, getDataService) { //发表评价
    console.log($stateParams.orderPid);
    $scope.evaluate = { id: $stateParams.orderId, comment: '', pid: $stateParams.orderPid };
    $scope.myStars = [
      { name: '差', num: 1 },
      { name: '较差', num: 2 },
      { name: '一般', num: 3 },
      { name: '好', num: 4 },
      { name: '很好', num: 5 }
    ];
    $scope.clickCnt = $scope.evaluate.dscore = 3;
    $scope.evaVul = '一般';
    $scope.stars = function(myStar) {
      $scope.clickCnt = $scope.evaluate.dscore = myStar.num;
      $scope.evaVul = myStar.name;
    };

    $scope.subEva = function() { //提交评价
      getDataService.hasHeaderRequest('post', 'put/transinfo/evaluate', $scope.evaluate)
        .then(function(data) {
          if (data.status == 101) {
            $state.go('myOrder', { orderState: 'yes' });
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            localStorage.removeItem('access-token');
            localStorage.removeItem('userMessage');
            $state.go('login');
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(data) {
          $scope.hintText = '评价失败';
          $scope.hintShow = true;
          hintHide();
        });
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    };
  })
  .controller('myCarCtrl', function($scope, $state, $timeout, getDataService) { //我的车辆
    $scope.leisCars = []; //未预约车辆
    $scope.useCars = []; //预约车辆
    getDataService.hasHeaderRequest('post', 'get/carinfos')
      .then(function(data) {
        if (data.status == 102) {
          data.data.forEach(function(element, index) {
            if (element.state == 1) { //已预约
              element.details = false;
              if (element.carpic1) {
                element.img = element.carpic1;
              } else if (element.carpic2) {
                element.img = element.carpic2;
              } else {
                element.img = 'img/car.png';
              };
              $scope.useCars.push(element);
            } else {
              if (element.carpic1) {
                element.img = element.carpic1;
              } else if (element.carpic2) {
                element.img = element.carpic2;
              } else {
                element.img = 'img/car.png';
              };
              $scope.leisCars.push(element);
            }
          });
        } else if (data.status == 401 || data.status == 402 || data.status == 403) {
          localStorage.removeItem('access-token');
          localStorage.removeItem('userMessage');
          $state.go('login');
        } else {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        }
      }).catch(function(data) {
        $scope.hintText = data.message;
        $scope.hintShow = true;
        hintHide();
      });

    $scope.mycar = function($event, carMes) { //修改或者查看我的车辆信息
      $event.stopPropagation();
      $state.go('bindCar', { carMes: carMes, carType: 'change' });
    };
    $scope.postInquiry = function($event) { //发布求租
      $event.stopPropagation();
      $state.go('demandCarport', { demandId: 'mycar' });
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    };
  })
  .controller('bindCarCtrl', function($scope, $stateParams, $ionicLoading, $http, $ionicActionSheet, $rootScope, $cordovaCamera, $ionicPopover, $cordovaImagePicker, $state, $timeout, getDataService) { //绑定车辆
    $scope.carCode = {}; //车牌号
    $scope.bindCar = {};
    $scope.deletBtn = false;
    $scope.licensePlatePop = false;
    $scope.licensePlate = ["京", "沪", "粤", "浙","川","鄂", "甘", "赣", "桂","贵", "黑", "吉", "晋","津", "辽", "鲁", "蒙","闽", "宁", "青", "琼","陕", "苏", "皖", "湘","新", "冀", "渝", "豫","云","藏", "港", "澳", "台","警","使","领","学"];

    $scope.frontHeight = 1.72;
    $scope.behindHeight = 1.72;
    $scope.frontImgs = []; //车辆前脸照片
    $scope.behindImgs = []; //车辆后脸照片
    $scope.frontShow = true;
    $scope.behindShow = true;
    $scope.mycarimg = { img1: '', img2: '' }; //检验车辆照片是否改换

     if ($stateParams.carType === 'add') {
      $scope.carTitle = '绑定车辆';
      $scope.deletBtn = false;
      $scope.carCode = {
          one: $scope.licensePlate[0],
           two: ''
       };
      $scope.bindCar = {
        name: '',
        brand: '',
        cartype: '2',
      };
    } else {
      $scope.carTitle = '车辆信息';
      $scope.deletBtn = true;
      $scope.bindCar.id = $stateParams.carMes.id;
      $scope.bindCar.brand = $stateParams.carMes.brand;
      $scope.bindCar.name = $stateParams.carMes.name;
      $scope.bindCar.cartype = $stateParams.carMes.cartype;
      $scope.bindCar.id = $stateParams.carMes.id;
      var platenos = $stateParams.carMes.plateno;
      $scope.carCode.one = platenos.substring(0,1);
      $scope.carCode.two = platenos.substring(1,platenos.length);
      if ($stateParams.carMes.carpic1) {
        $scope.mycarimg.img1 = $stateParams.carMes.carpic1;
        $scope.frontImgs.push($stateParams.carMes.carpic1); //车辆前脸照片
        $scope.frontShow = false;
      };
      if ($stateParams.carMes.carpic2) {
        $scope.mycarimg.img2 = $stateParams.carMes.carpic2;
        $scope.behindImgs.push($stateParams.carMes.carpic2); //车辆后脸照片
        $scope.behindShow = false;
      };
    };
    // $scope.$watch('carCode',function(v,o){
    //   for(var key in $scope.carCode){
    //     if($scope.carCode[key]!=''&& typeof $scope.carCode[key] !='undefined' ){
    //       $scope.carCode[key] = $scope.carCode[key].toUpperCase()
    //     }
    //   }
    // },true)
    $scope.toUpperCase = function(){
      $scope.carCode.two = $scope.carCode.two.toUpperCase()
    };
    $scope.showLpPop = function(){
      $scope.licensePlatePop = true;
    };
    $scope.chooseThis = function(x){
      $scope.carCode.one = x;
      console.log($scope.carCode.one);
      $scope.licensePlatePop = false;
    };
    $scope.quxChoose = function(){
      $scope.licensePlatePop = false;
    };
    $scope.deletCar = function() { //删除车辆
      getDataService.hasHeaderRequest('post', 'destroy/carinfos/id', { id: $stateParams.carMes.id })
        .then(function(data) {
          if (data.status == 101) {
            $state.go('myCar');
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            localStorage.removeItem('access-token');
            localStorage.removeItem('userMessage');
            $state.go('login');
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(data) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        });
    };

    $scope.gotoCarme = function(delt) { //拍照
      $ionicActionSheet.show({
        cancelText: '取消',
        buttons: [
          { text: '拍照' },
          { text: '从相册选择' }
        ],
        buttonClicked: function(index) {
          document.addEventListener("deviceready", function() {
            if (index == '0') { //拍照
              var cameraOptions = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                allowEdit: false,
                targetWidth: 800,
                targetWidth: 800,
                saveToPhotoAlbum: true
              };
              var options = {
                name: 'phone.jpg'
              };
              $cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
                if(imageData){
                  if (delt == 'front') {
                    $scope.frontImgs.splice(0, $scope.frontImgs.length);
                    $scope.frontImgs.push(imageData);
                    $scope.frontShow = false;
                    carportH();
                  } else if (delt == 'behind') {
                    $scope.behindImgs.splice(0, $scope.behindImgs.length);
                    $scope.behindImgs.push(imageData);
                    $scope.behindShow = false;
                    deedH();
                  };
                };
              }, function(err) {
                // error
              });
            } else if (index == '1') {
              //从手机相册选择
              var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 100
              };
              $cordovaImagePicker.getPictures(options)
                .then(function(results) {
                  if(results!=''){
                    if (delt == 'front') {
                      $scope.frontImgs = $scope.frontImgs.concat(results);
                      $scope.frontShow = false;
                      carportH();
                    } else if (delt == 'behind') {
                      $scope.behindImgs = $scope.behindImgs.concat(results);
                      $scope.behindShow = false;
                      deedH();
                    };
                  };
                }, function(error) {
                  console.log(error);
                });
            }
          }, false);
          return true;
        }
      })
    }

    /*拍照、选择照片结束*/
    $scope.deletps = function(img, index, delt) { //删除照片
      if (delt == 'front') {
        $scope.frontImgs.splice(index, 1);
        $scope.frontShow = true;
        carportH();
      } else if (delt == 'behind') {
        $scope.behindImgs.splice(index, 1);
        $scope.behindShow = true;
        deedH();
      };
    };
    $scope.bigimg = $ionicPopover.fromTemplateUrl('bigimg', { //弹出大图
      scope: $scope
    });
    $ionicPopover.fromTemplateUrl('bigimg', {
      scope: $scope
    }).then(function(popop) {
      $scope.bigimg = popop;
    });
    $scope.getBig = function($event, index, delt) { //点击查看大图
      $scope.bigimg.show($event);
      if (delt == 'front') {
        $scope.Bimg = $scope.frontImgs[index];
      } else if (delt == 'behind') {
        $scope.Bimg = $scope.behindImgs[index];
      };
    };
    $scope.closebigimg = function() {
      $scope.bigimg.hide();
    };
    // 清除浮动框
    $scope.$on('$destroy', function() {
      $scope.bigimg.remove();
    });

    function carportH() { //车辆前脸高度变化
      let arrLgh = $scope.frontImgs.length;
      if (arrLgh > 2) {
        $scope.frontHeight = Math.ceil((arrLgh + 1) / 3) * 1.35 + 0.43;
      } else {
        $scope.frontHeight = 1.72;
      };
    };

    function deedH() { //车辆后脸高度变化
      let arrLgh = $scope.behindImgs.length;
      if (arrLgh > 2) {
        $scope.behindHeight = Math.ceil((arrLgh + 1) / 3) * 1.35 + 0.43;
      } else {
        $scope.behindHeight = 1.72;
      };
    };

    $scope.toBIndCar = function() {
      var carCodes = '';
      // for (code in $scope.carCode) {
      //   if($scope.carCode[code]!=''){
      //     carCodes += $scope.carCode[code];
      //   }else{
      //     $scope.hintText = '请正确填写车牌号码';
      //     $scope.hintShow = true;
      //     hintHide();
      //     return false;
      //   }
      //
      // };
      if($scope.carCode.two.length<6){
        $scope.hintText = '请正确填写车牌号码';
        $scope.hintShow = true;
        hintHide();
        return false;
      }else{
        carCodes += $scope.carCode.one;
        carCodes += $scope.carCode.two;
      }

      $scope.bindCar.plateno = carCodes;
      if ($stateParams.carType === 'add') {
        getDataService.hasHeaderRequest('post', 'post/carinfos', $scope.bindCar)
          .then(function(data) {
            if (data.status == 101) {
              if ($scope.frontImgs[0] &&($scope.mycarimg.img1 != $scope.frontImgs[0])) {
                uploadImg($scope.frontImgs, '001', data.id);
                return false;
              }
              if ($scope.mycarimg.img2 != $scope.behindImgs[0]) {
                uploadImg($scope.behindImgs, '002', data.id);
                return false;
              }
                $state.go('myCar');

            } else if (data.status == 401 || data.status == 402 || data.status == 403) {
              localStorage.removeItem('access-token');
              localStorage.removeItem('userMessage');
              $state.go('login');
            } else {
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            }
          }).catch(function(data) {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          });
      } else {
        getDataService.hasHeaderRequest('post', 'post/carinfos/id', $scope.bindCar)
          .then(function(data) {
            if (data.status == 101) {
              if ($scope.frontImgs[0] && ($scope.mycarimg.img1 != $scope.frontImgs[0])) {
                  uploadImg($scope.frontImgs, '001', $scope.bindCar.id);
                return false;
              };
              if ($scope.behindImgs[0] && ($scope.mycarimg.img2 != $scope.behindImgs[0])) {
                uploadImg($scope.behindImgs, '002', $scope.bindCar.id);
                return false;
              }

              $state.go('myCar');

            } else if (data.status == 401 || data.status == 402 || data.status == 403) {
              localStorage.removeItem('access-token');
              localStorage.removeItem('userMessage');
              $state.go('login');
            } else {
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            }
          }).catch(function(data) {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          });
      }
    };

    function uploadImg(imgs, code, mId) {
      document.addEventListener("deviceready", function() {
        $ionicLoading.show({
          template: '<i class="icon ion-load-c"></i><br>请稍后....'
        });
        var ft = new FileTransfer();
        for (var i = 0; i < imgs.length; i++) {
          var options = new FileUploadOptions();
          var imgurl = decodeURIComponent(imgs[i]);
          options.fileKey = "file";
          options.fileName = imgurl.substr(imgurl.lastIndexOf('/') + 1);
          options.mimeType = "image/jpeg"; //文件样式
          options.params = { id: mId, code: code };
          options.headers = { 'x-access-token': localStorage.getItem('access-token') };
          ft.upload(imgurl, $rootScope.baseUrl + '/v1/mg/put/carinfos/pic', win, fail, options, true);
        };
      }, false);
    };

    function win(r) {
      $ionicLoading.hide();
      var response = JSON.parse(r.response);
      if (response.status == 101) {
        $state.go('myCar');
      } else {
        $scope.hintText = '图片未保存';
        $scope.hintShow = true;
        hintHide();
      }
    };

    function fail(error) {
      $ionicLoading.hide();
      $scope.hintText = '图片上传失败';
      $scope.hintShow = true;
      hintHide();
    };

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    };
  })
  .controller('myCarportCtrl', function($scope, $timeout, $state, getDataService) { //我的车位
    $scope.leisureCarports = [];
    $scope.useCarports = [];
    getDataService.hasHeaderRequest('get', 'get/meparkingslots')
      .then(function(data) {
        if (data.status == 102) {
          let result = data.data;
          result.forEach(function(element, index) {
            element.parkloc = element.x + ',' + element.y;
            if (element.state == 0) {
              $scope.leisureCarports.push(element);
            } else {
              if (element.state == 1) {
                element.statu = '发布中';
              } else if (element.state == 2) {
                element.statu = '使用中';
              } else if (element.state == 3) {
                element.statu = '冻结中';
              } else if (element.state == 4) {
                element.statu = '预约中';
              };
              element.useDetail = false;
              $scope.useCarports.push(element);
            }
          });
        } else if (data.status == 401 || data.status == 402 || data.status == 403) {
          localStorage.removeItem('access-token');
          localStorage.removeItem('userMessage');
          $state.go('login');
        } else {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        }
      }).catch(function(data) {
        $scope.hintText = data.message;
        $scope.hintShow = true;
        hintHide();
      });

    $scope.getuseDetail = function(item, $event) { //获取车位详情
      $event.stopPropagation();
      $scope.useDetail = {};
      getDataService.hasHeaderRequest('post', 'get/parkingslots', { slotid: item.id })
        .then(function(data) {
          if (data.status == 102) {
            var result = data.data[0];
            $scope.useDetail.slotid = result.slotid;
            $scope.useDetail.stime = result.stime;
            $scope.useDetail.etime = result.etime;
            $scope.useDetail.parkfee = result.parkfee;
            $scope.useDetail.servfee = result.servfee;
            $scope.useDetail.chgfee = result.chgfee;
            $scope.useDetail.overtimemultiplier = result.overtimemultiplier;
            if (result.staketype) {
              if (result.state) {
                var stakeStype;
                if (result.staketype == 1) {
                  stakeStype = '直流';
                } else if (result.staketype == 2) {
                  stakeStype = '交流';
                } else {
                  stakeStype = '其它';
                };
                $scope.chargMes = stakeStype + '、' + result.power + 'KW' + '、正常';
              } else {
                $scope.chargMes = '异常';
              };
            } else {
              $scope.chargMes = '无';
            };
            $scope.useCarports.forEach(function(element, index) {
              element.useDetail = false;
            });
            item.useDetail = true;
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(data) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        });
    };

    $scope.closeuseDetail = function(item, $event) { //关闭车位详情
      $event.stopPropagation();
      var index = $scope.useCarports.indexOf(item);
      $scope.useCarports[index].useDetail = false;
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    };
  })
  .controller('bindCarportCtrl', function($scope, $ionicPopover, $state, $timeout, getDataService) { //绑定车位
    $scope.showCarport = false;
    $scope.mycarports = { //绑定车位是需要提交的信息
      id: '',
      phone: '',
      name: ''
    };

    $scope.carportMes = { //页面上显示的车位信息
      parkName: '选择停车场',
      slotid: '选择车位',
      ownername: '',
      owntype: '',
      address: '',
      slotpic: '', //车位照片
      propertypic: '' //产权证照片
    };
    $scope.carports = []; //某停车场全部车位
    $scope.carportPic = false; //车位照片是否显示
    $scope.deedPic = false; //产权证照片是否显示
    $scope.selects = []; //选择显示
    $scope.parkId = ''; //获取车位时车场ID
    var selectType = []; //选择车位还是停车场
    $scope.selecter = { //选中车场或者车位
      value: ''
    };
    $scope.select = $ionicPopover.fromTemplateUrl('select', {
      scope: $scope
    });
    $ionicPopover.fromTemplateUrl('select', {
      scope: $scope
    }).then(function(popop) {
      $scope.select = popop;
    });
    $scope.toSelect = function($event, stype) {
      selectType.push(stype);
      $scope.selects.splice(0, $scope.selects.length);
      if (stype === 'park') {
        $scope.selecter.value.name = $scope.carportMes.parkName;
        getDataService.hasHeaderRequest('post', 'get/parkinfos')
          .then(function(data) {
            if (data.status == 102) {
              data.data.forEach(function(element, index) {
                $scope.selects.push(element);
              });
              if ($scope.selects.length > 7) {
                $scope.nowhei = '4.06rem';
              };
              $scope.select.show($event);
            } else if (data.status == 401 || data.status == 402 || data.status == 403) {
              $state.go('login')
            } else {
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            }
          }).catch(function(data) {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          })
      } else {
        $scope.selecter.value.name = $scope.carportMes.slotid;
        getDataService.hasHeaderRequest('post', 'get/parkingslots', { id: $scope.parkId })
          .then(function(data) {
            if (data.status == 102) {
              $scope.carports.splice(0, $scope.carports.length);
              data.data.forEach(function(element, index) {
                $scope.carports.push(element);
                var itemobj = { id: '', name: '' };
                itemobj.id = element.id;
                itemobj.name = element.slotid;
                $scope.selects.push(itemobj);
              });
              if ($scope.selects.length > 7) {
                $scope.nowhei = '4.06rem';
              };
              $scope.select.show($event);
            } else if (data.status == 401 || data.status == 402 || data.status == 403) {
              $state.go('login')
            } else {
              selectType.splice(0, selectType.length);
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            };
          }).catch(function(data) {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          })
      }
    };
    $scope.closeselect = function() {
      selectType.splice(0, selectType.length);
      $scope.select.hide();
    };
    $scope.search = { key: '' }; //搜索条件
    $scope.searchSmth = function() { //搜索
      console.log($scope.search.key)
    };
    $scope.selectSure = function() { //确认选择
      if (selectType[0] == 'park') {
        $scope.showCarport = true;
        $scope.carportMes.parkName = $scope.selecter.value.name;
        $scope.parkId = $scope.selecter.value.id;
      } else {
        $scope.carportMes.slotid = $scope.selecter.value.name;
        $scope.mycarports.id = $scope.selecter.value.id;
        $scope.carports.forEach(function(element, index) {
          if ($scope.selecter.value.id == element.id) {
            $scope.carportMes.ownername = element.ownername;
            if (element.address) {
              $scope.carportMes.address = element.address;
              $scope.carportPic = true;
            };
            if (element.slotpic) {
              $scope.deedPic = true;
              $scope.carportMes.slotpic = element.slotpic;
            };
            $scope.carportMes.propertypic = element.propertypic;
            if (element.owntype == 1) {
              $scope.carportMes.owntype = '购买持有';
            } else {
              $scope.carportMes.owntype = '租赁持有';
            }
          }
        });
      };
      selectType.splice(0, selectType.length);
      $scope.selects.splice(0, $scope.selects.length);
      $scope.carports.splice(0, $scope.carports.length);
      $scope.select.hide();
    };
    // 清除浮动框
    $scope.$on('$destroy', function() {
      $scope.select.remove();
    });

    $scope.bindCarport = function() { //绑定车位
      let usermes = JSON.parse(localStorage.getItem('userMessage'));
      $scope.mycarports.phone = usermes.mobile;
      $scope.mycarports.name = usermes.name;
      if(!$scope.mycarports.id){
        $scope.hintText = "请选择正确车位！"
        $scope.hintShow = true;
        hintHide();
        return false;
      }
      console.log($scope.mycarports);
      getDataService.hasHeaderRequest('post', 'post/meparkingslots', $scope.mycarports)
        .then(function(data) {
          if (data.status == 101) {
            $state.go('myCarport');
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          };
        }).catch(function(data) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        })
    };

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    };
  })
  .controller('showCarportCtrl', function($scope, $state, $stateParams, $timeout, getDataService) { //共享车位
    $scope.carport = {}; //用户共享时的信息
    $scope.chargMes = ''; //显示在页面上的车桩位信息
    $scope.tatol = ''; //停车预计费用
    $scope.sselt = '选择开始时间';
    $scope.eselt = '选择结束时间';
    $scope.canElectric = true;
    let slot_id = ''; //车位id
    if ($stateParams.type === 'mod') { //修改订单过来
      $scope.carport.id = $stateParams.orderId;
      slot_id = $stateParams.carportId;
    } else {
      slot_id = $stateParams.carportId.id;
      var carportloc = $stateParams.carportId.parkloc.split(',');
      $scope.carport.slotloc = 'POINT(' + Number(carportloc[0]) + ' ' + Number(carportloc[1]) + ')';
    };
    getDataService.hasHeaderRequest('post', 'get/parkingslots', { slotid: slot_id })
      .then(function(data) {
        if (data.status == 102) {
          var result = data.data[0];
          $scope.carport.parkid = result.parkid;
          $scope.carport.slotid = result.id;
          $scope.carport.carportid = result.slotid;
          $scope.carport.address = result.address;
          $scope.carport.stime = result.stime;
          $scope.carport.etime = result.etime;
          if (result.stime) {
            $scope.sselt = result.stime;
          };
          if (result.etime) {
            $scope.eselt = result.etime;
          };
          if (result.staketype) {
            $scope.canElectric = true;
            if (result.state) {
              var stakeStype;
              if (result.staketype == 1) {
                stakeStype = '直流';
              } else if (result.staketype == 2) {
                stakeStype = '交流';
              } else {
                stakeStype = '其它';
              };
              $scope.chargMes = stakeStype + '、' + result.power + 'KW' + '、' + '正常';
            } else {
              $scope.chargMes = '异常';
            };
          } else {
            $scope.canElectric = false;
            $scope.chargMes = '无';
          };
        } else if (data.status == 401 || data.status == 402 || data.status == 403) {
          $state.go('login')
        } else {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        }
      }).catch(function(data) {
        $scope.hintText = data.message;
        $scope.hintShow = true;
        hintHide();
      })
    const calendarStart = new lCalendar(); //选择开始时间
    const calendarEnd = new lCalendar(); //选择结束时间
    calendarStart.init({
      'trigger': '#serchStartTime',
      'type': 'datetime',
    });
    calendarEnd.init({
      'trigger': '#serchEndTime',
      'type': 'datetime',
    });

    $scope.showCarport = function() { //共享车位
      $scope.carport.otime = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''); //当前系统时间
      if (document.getElementById('serchStartTime').value) {
        $scope.carport.stime = document.getElementById('serchStartTime').value;
      } else if (!$scope.carport.stime) {
        $scope.carport.stime = $scope.carport.otime;
      };
      if (document.getElementById('serchEndTime').value) {
        $scope.carport.etime = document.getElementById('serchEndTime').value;
      } else if (!$scope.carport.etime) {
        $scope.carport.etime = $scope.carport.otime;
      };
      if (Date.parse($scope.carport.etime) - Date.parse($scope.carport.otime)>0) {
        if ($stateParams.type === 'mod') { //修改订单过来
          getDataService.hasHeaderRequest('post', 'put/sellinginfos/id', $scope.carport)
            .then(function(data) {
              if (data.status == 101) {
                $state.go('myOrder');
              } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                $state.go('login')
              } else {
                $scope.hintText = data.message;
                $scope.hintShow = true;
                hintHide();
              }
            }).catch(function(data) {
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            })
        } else {
          getDataService.hasHeaderRequest('post', 'post/sellinginfos', $scope.carport)
            .then(function(data) {
              console.log(data);
              if (data.status == 101) {
                $state.go('myCarport');
              } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                $state.go('login')
              } else {
                $scope.hintText = data.message;
                $scope.hintShow = true;
                hintHide();
              }
            }).catch(function(data) {
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            })
        };
      } else {
        $scope.hintText = '结束时间不能早于当前时间';
        $scope.hintShow = true;
        hintHide();
      };
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('myCustomerCtrl', function($scope) { //我的客服

  })
  .controller('mySetCtrl', function($scope, getDataService, $rootScope, $ionicLoading, $timeout, $state, $ionicPopup, $stateParams, $cordovaImagePicker, $cordovaCamera, $ionicActionSheet) { //我的设置
    $scope.userMess = JSON.parse(localStorage.getItem('userMessage')); //存储在本地的用户信息
    console.log($scope.userMess);
    var nickName = $stateParams.name;
    let loginName = $scope.userMess.mobile;
    if (loginName) {
      $scope.userName = loginName.substring(0, 3) + '****' + loginName.substring(7, 11);
    };
    if (!$scope.userMess.photo) {
      $scope.userPhoto = 'img/useravatar.png';
    } else {
      $scope.userPhoto = $scope.userMess.photo;
    };
    if (!$scope.userMess.email) {
      $scope.email = '设置邮箱账号';
    } else {
      $scope.email = $scope.userMess.email;
    };
    $scope.name = $scope.userMess.name;

    $scope.gotoCarme = function() { //拍照
      $ionicActionSheet.show({
        cancelText: '取消',
        buttons: [
          { text: '拍照' },
          { text: '从相册选择' }
        ],
        buttonClicked: function(index) {
          document.addEventListener("deviceready", function() {
            if (index == '0') { //拍照
              var cameraOptions = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                allowEdit: false,
                targetWidth: 800,
                targetWidth: 800,
                saveToPhotoAlbum: true
              };
              var options = {
                name: 'phone.jpg'
              };
              $cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
                uploadImg(imageData);
              }, function(err) {
                // error
              });
            } else if (index == '1') {
              //从手机相册选择
              var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 100
              };
              $cordovaImagePicker.getPictures(options)
                .then(function(results) {
                  uploadImg(results[0]);
                }, function(error) {
                  console.log(error);
                });
            }
          }, false);
          return true;
        }
      })
    };

    function uploadImg(img) {
      document.addEventListener("deviceready", function() {
        $ionicLoading.show({
          template: '<i class="icon ion-load-c"></i><br>请稍后....'
        });
        var ft = new FileTransfer();
        var options = new FileUploadOptions();
        var imgurl = decodeURIComponent(img);
        options.fileKey = "file";
        options.fileName = imgurl.substr(imgurl.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg"; //文件样式
        options.headers = { 'x-access-token': localStorage.getItem('access-token') };
        ft.upload(imgurl, $rootScope.baseUrl + '/v1/mg/post/headImage', win, fail, options, true);
      }, false);
    };

    function win(r) {
      $ionicLoading.hide();
      var response = JSON.parse(r.response);
      if (response.status == 102) {
        $scope.userPhoto = response.data;
        document.getElementById('usepic').src = response.data; //更换头像
        $scope.userMess.photo = response.data;
        localStorage.setItem('userMessage', JSON.stringify($scope.userMess)); //本地存储登录用户信息
      } else {
        $scope.hintText = data.message;
        $scope.hintShow = true;
        hintHide();
      }
    }

    function fail(error) {
      $ionicLoading.hide();
      $scope.hintText = '修改头像失败';
      $scope.hintShow = true;
      hintHide();
    }

    $scope.outLogin = function() { //退出登录
      $ionicPopup.confirm({
        cssClass: 'goOut',
        template: "<div>确定退出登录？</div>",
        buttons: [{
            text: "取消"
          },
          {
            text: '确定',
            onTap: function(e) {
              getDataService.hasHeaderRequest('get', 'patch/users/id')
                .then(function(data) {
                  console.log(data);
                  if (data.status == 101) {
                    localStorage.removeItem('access-token');
                    localStorage.removeItem('userMessage');
                    localStorage.removeItem('spaceLocation');
                    $state.go('login');
                  } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                    localStorage.removeItem('access-token');
                    localStorage.removeItem('userMessage');
                    localStorage.removeItem('spaceLocation');
                    $state.go('login')
                  } else {
                    $scope.hintText = data.message;
                    $scope.hintShow = true;
                    hintHide();
                  }
                }).catch(function() {
                  $scope.hintText = '退出登录失败';
                  $scope.hintShow = true;
                  hintHide();
                })
            }
          }
        ]
      });
    };

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('setNickNameCtrl', function($scope, $stateParams, $state, $timeout, getDataService) { //设置昵称
    var userMess = JSON.parse(localStorage.getItem('userMessage')); //存储在本地的用户信息
    var setType = $stateParams.setType;
    $scope.back = function() { //返回键
      if (setType == 'myset') {
        $state.go('mySet')
      } else {
        $state.go('mMySet')
      }
    };

    $scope.nick = { name: '' }; //昵称
    $scope.hintShow = false;
    $scope.subNick = function() { //修改昵称
      if (!$scope.nick.name) {
        $scope.hintText = '昵称不能为空';
        $scope.hintShow = true;
        hintHide();
      } else {
        getDataService.hasHeaderRequest('post', 'put/users/name', $scope.nick)
          .then(function(data) {
            if (data.status == 101) {
              userMess.name = $scope.nick.name;
              localStorage.setItem('userMessage', JSON.stringify(userMess)); //本地存储登录用户信息
              if (setType == 'myset') {
                $state.go('mySet');
              } else {
                $state.go('mMySet');
              }
            } else if (data.status == 401 || data.status == 402 || data.status == 403) {
              $state.go('login')
            } else {
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            }
          }).catch(function(data) {
            $scope.hintText = '修改失败';
            $scope.hintShow = true;
            hintHide();
          })
      }
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('changePhoneNumberFirstCtrl', function($scope, $ionicPopover, $state) { //更换手机号第一页
    let userMess = JSON.parse(localStorage.getItem('userMessage')); //存储在本地的用户信息

    console.log($scope.userMess);
    $scope.mobile = userMess.mobile;

    $scope.popover = $ionicPopover.fromTemplateUrl('popover', {
      scope: $scope
    }).then(function(popop) {
      $scope.popover = popop;
    });
    $scope.openPopover = function(event) { //打开选择框
      $scope.popover.show(event);
    };
    $scope.closePopover = function() { //关闭选择框
      $scope.popover.hide();
    };
    $scope.$on('$destroy', function() { // 清除浮动框
      $scope.popover.remove();
    });

    $scope.codeTime = '获取验证码';
  })
  .controller('changeNumberCtrl', function($scope) { //更换手机号第二页

  })
  .controller('setEmailCtrl', function($scope, $timeout, $state, getDataService) { //设置邮箱
    let userMess = JSON.parse(localStorage.getItem('userMessage')); //存储在本地的用户信息

    $scope.user = { email: '' }; //用户输入的邮箱号
    var emreg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/; //邮箱正则
    $scope.setEmail = function() {
      if (emreg.test($scope.user.email)) {
        getDataService.hasHeaderRequest('post', 'put/users/email', { email: $scope.user.email })
          .then(function(data) {
            if (data.status == 101) {
              userMess.email = $scope.user.email;
              localStorage.setItem('userMessage', JSON.stringify(userMess)); //本地存储登录用户信息
              $state.go('mySet');
            } else if (data.status == 401 || data.status == 402 || data.status == 403) {
              $state.go('login')
            } else {
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            }
          }).catch(function(data) {
            $scope.hintText = '邮箱修改失败';
            $scope.hintShow = true;
            hintHide();
          })
      } else {
        $scope.hintText = '邮箱格式有误';
        $scope.hintShow = true;
        hintHide();
      };
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('setPasswordCtrl', function($scope, $stateParams, $state, $timeout, getDataService) { //修改密码
    var setType = $stateParams.setType;
    $scope.back = function() { //返回键
      if (setType == 'myset') {
        $state.go('mySet')
      } else {
        $state.go('mMySet')
      }
    };
    $scope.setPwd = { oPwd: '', nPwd: '', rnPwd: '' }; //修改密码参数
    $scope.hintShow = false;
    $scope.subPwd = function() { //修改昵称
      if (!$scope.setPwd.nPwd) {
        $scope.hintText = '密码不能为空';
        $scope.hintShow = true;
        hintHide();
      } else if ($scope.setPwd.nPwd != $scope.setPwd.rnPwd) {
        $scope.hintText = '两次密码不一致';
        $scope.hintShow = true;
        hintHide();
      } else {
        getDataService.hasHeaderRequest('post', 'put/users/pwd', { password: $scope.setPwd.oPwd, newpwd: $scope.setPwd.nPwd })
          .then(function(data) {
            if (data.status == 101) {
              localStorage.removeItem('access-token');
              localStorage.removeItem('userMessage');
              $state.go('login');
            } else if (data.status == 401 || data.status == 402 || data.status == 403) {
              localStorage.removeItem('access-token');
              localStorage.removeItem('userMessage');
              $state.go('login');
            } else {
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            }
          }).catch(function(data) {
            $scope.hintText = '修改失败';
            $scope.hintShow = true;
            hintHide();
          })
      }
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('accountNumberCtrl', function($scope, $ionicPopover) { //收支账号
    $scope.accountType = '添加';
    $scope.oldNum = '输入账号'; //弹出款显示的账号
    $scope.zhifubaoAccount = '13890238823';
    $scope.weixinAccount = '13890244444';
    $scope.popover = $ionicPopover.fromTemplateUrl('popover', {
      scope: $scope
    }).then(function(popop) {
      $scope.popover = popop;
    });
    $scope.addAccount = function(event, type) { //添加账号
      $scope.accountType = '添加';
      $scope.oldNum = '输入账号';
      if (type === 'zhifubao') {

      } else {

      }
      $scope.popover.show(event);
    }
    $scope.compilAccount = function(event, type, accountNumber) { //编辑账号
      $scope.accountType = '编辑';
      if (type === 'zhifubao') {
        $scope.oldNum = $scope.zhifubaoAccount;
      } else {
        $scope.oldNum = $scope.weixinAccount;
      };
      $scope.popover.show(event);
    }
    $scope.closePopover = function() { //关闭选择框
      $scope.popover.hide();
    };
    $scope.accountSure = function() { //确认提交账号
      $scope.popover.hide();
    }
    $scope.$on('$destroy', function() { // 清除浮动框
      $scope.popover.remove();
    });

  })
  .controller('blacklistCtrl', function($scope) { //黑名单
    $scope.ownerClass = 'blacklistActive'; //车主class
    $scope.proprietorClass = 'blacklistNot'; //业主class
    $scope.getBlackList = function(navBtn) {
      if (navBtn === 'owner') {
        $scope.ownerClass = 'blacklistActive';
        $scope.proprietorClass = 'blacklistNot';
      } else {
        $scope.ownerClass = 'blacklistNot';
        $scope.proprietorClass = 'blacklistActive';
      }
    }

    $scope.blacklists = [
      { id: 'black01', useName: '龙域国际中心' },
      { id: 'black02', useName: '12312312321' },
      { id: 'black03', useName: '龙泽地铁站' },
      { id: 'black04', useName: '龙域国际中心' },
      { id: 'black05', useName: '龙域国际中心' },
    ];
    $scope.delet = function(item) { //删除黑名单对应人员
      $scope.blacklists.splice($scope.blacklists.indexOf(item), 1);
    };
  })
