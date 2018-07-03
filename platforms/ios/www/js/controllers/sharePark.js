angular.module('sharePark', [])
  //ripple emulate  
  .controller('AppCtrl', function($scope, $ionicModal, $timeout, parksServe, $state, $ionicHistory, $http, getDataService) {
    if (localStorage.getItem('userMessage') != 'undefined') {
      $scope.userMess = JSON.parse(localStorage.getItem('userMessage')); //存储在本地的用户信息
      let loginName = $scope.userMess.mobile;
      if (loginName) {
        $scope.userName = loginName.substring(0, 3) + '****' + loginName.substring(7, 11);
      }
      if (!$scope.userMess.photo) {
        $scope.userPhoto = 'img/useravatar.png';
      } else {
        $scope.userPhoto = $scope.userMess.photo;
      }
    };

    $scope.menuAlert = false;
    $scope.showmenuAlert = function() {
      $scope.menuAlert = true;
    }
    $scope.closemenuAlert = function() {
      $scope.menuAlert = false;
    }
  })

  .controller('shareParkCtrl', function($scope, $timeout, $state, parksServe, $stateParams, $cordovaGeolocation, getDataService) { //车位共享
    function getUSerLocation() { //定位用户位置
      document.addEventListener("deviceready", () => {
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
          var option = {};
          option.address = '';
          option.lng = position.coords.longitude;
          option.lat = position.coords.latitude;
          localStorage.setItem('spaceLocation', JSON.stringify(option)); //保存定位经纬度
          creatMap();
        }, function(err) {
          $scope.hintText = '定位失败';
          $scope.hintShow = true;
          hintHide();
        });
      }, false);
    };
    // function getUSerLocation() { //定位用户位置
    //   var map, geolocation;
    //   map = new AMap.Map('container', {
    //     resizeEnable: true
    //   });
    //   map.plugin('AMap.Geolocation', function() {
    //     geolocation = new AMap.Geolocation({
    //       enableHighAccuracy: true, //是否使用高精度定位，默认:true
    //       buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    //       zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    //       buttonPosition: 'RB'
    //     });
    //     map.addControl(geolocation);
    //     geolocation.getCurrentPosition();
    //     AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
    //     AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
    //   });

    //   function onComplete(data) {
    //     console.log(data);
    //     // alert('定位成' + JSON.stringify(data));
    //     var option = {};
    //     option.address = data.formattedAddress;
    //     option.lng = data.position.lng;
    //     option.lat = data.position.lat;
    //     localStorage.setItem('spaceLocation', JSON.stringify(option)); //保存定位经纬度
    //     console.log(option);
    //     creatMap();
    //   };

    //   function onError(err) {
    //     // alert('定位失败' + JSON.stringify(err));
    //     $scope.hintText = '定位失败';
    //     $scope.hintShow = true;
    //     hintHide();
    //   }

    let parkShowCa = document.getElementById('park'); //选择的那个停车场信息
    /*let examine = document.getElementById('examine'); //刷新按钮（重新定位）*/
    $scope.carMess = false; //单个停车场信息卡片
    $scope.parkListShow = false; //停车场列表信息卡片
    $scope.examineBottom = 0; //刷新按钮bottom

    $scope.parks = [];
    var watchList = $scope.$watch(parksServe.get().parks, function() { //监听停车场数组的变化
      $scope.searchCondition = $stateParams.searchCondition;
      if (parksServe.get().parks) { //显示搜索以后的停车场信息
        $scope.parks.splice(0);
        var parklists = parksServe.get().parks;
        for (var i = 0; i < parklists.length; i++) {
          var parklist = {};
          parklist.id = parklists[i].id;
          parklist.name = parklists[i].name;
          parklist.count = parklists[i].count;
          parklist.price = 5;
          var location = JSON.parse(localStorage.getItem('spaceLocation')); //用户当前位置信息
          var lnglat = new AMap.LngLat(location.lng, location.lat);
          var km = lnglat.distance(parklists[i].parkloc.split(',')) / 1000;
          parklist.range = km.toFixed(2);
          $scope.parks.push(parklist);
        }
        $scope.examineBottom = parklists.length * 1.34 + 0.71;
        $scope.parkListShow = true;
      } else {
        $scope.parkListShow = false;
      };
      watchList();
    }, true);

    var points = []; //停车场信息

    // function getUSerLocation() { //定位用户位置
    //   var map, geolocation;
    //   map = new AMap.Map('container', {
    //     resizeEnable: true
    //   });
    //   map.plugin('AMap.Geolocation', function() {
    //     geolocation = new AMap.Geolocation({
    //       enableHighAccuracy: true, //是否使用高精度定位，默认:true
    //       buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    //       zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    //       buttonPosition: 'RB'
    //     });
    //     map.addControl(geolocation);
    //     geolocation.getCurrentPosition();
    //     AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
    //     AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
    //   });

    //   function onComplete(data) {
    //     console.log(data);
    //     // alert('定位成' + JSON.stringify(data));
    //     var option = {};
    //     option.address = data.formattedAddress;
    //     option.lng = data.position.lng;
    //     option.lat = data.position.lat;
    //     localStorage.setItem('spaceLocation', JSON.stringify(option)); //保存定位经纬度
    //     console.log(option);
    //     creatMap();
    //   };

    //   function onError(err) {
    //     // alert('定位失败' + JSON.stringify(err));
    //     $scope.hintText = '定位失败';
    //     $scope.hintShow = true;
    //     hintHide();
    //   }
    // };

    if (localStorage.getItem('spaceLocation')) {
      var location = JSON.parse(localStorage.getItem('spaceLocation')); //用户当前位置信息
      var userLocation = location.lng + ',' + location.lat; //用户当前经纬度
      if (userLocation) {
        let map = new AMap.Map('mapContainer', {
          resizeEnable: true,
          zoom: 16,
          center: userLocation.split(',')
        });
      }
    }

    //获取停车场
    $scope.hintShow = false;
    getDataService.hasHeaderRequest('post', 'get/parkinfos')
      .then(function(data) {
        if (data.status == 102) {
          points.splice(0, points.length);
          data.data.forEach(function(element, index) {
            element.parkloc = element.x + ',' + element.y;
            points.push(element);
          });
          creatMap();
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

    //创建地图
    function creatMap() {
      if (localStorage.getItem('spaceLocation')) {
        var location = JSON.parse(localStorage.getItem('spaceLocation')); //用户当前位置信息
        var userLocation = location.lng + ',' + location.lat; //用户当前经纬度
        if (userLocation) {
          let map = new AMap.Map('mapContainer', {
            resizeEnable: true,
            zoom: 16,
            center: userLocation.split(',')
          });
          setMarkers(map, points, userLocation);
          moveMapCheck(map);
        }
      }
    };

    function setMarkers(map, points, userLocation) { //为地图添加附近停车点、显示用户所在地
      let userLOcationicon = new AMap.Icon({ //设置停车点图标
        image: 'img/userLocation.png',
        size: new AMap.Size(33, 45),
        imageSize: { //显示图标大小
          width: 28,
          height: 24
        }
      });
      let userLOcationmarker = new AMap.Marker({
        icon: userLOcationicon,
        position: userLocation.split(','),
        offset: new AMap.Pixel(-15, 0),
        clickable: true,
        autoRotation: true,
        map: map
      });
      let pointsArray = []; //停车点的坐标二维数组
      if (points) {
        let icon = new AMap.Icon({ //设置停车点图标
          image: 'img/mapMarker.png',
          size: new AMap.Size(33, 45),
          imageSize: { //显示图标大小
            width: 28,
            height: 42
          }
        });
        for (let i = 0; i < points.length; i++) {
          let marker = new AMap.Marker({
            icon: icon,
            position: points[i].parkloc.split(','),
            offset: new AMap.Pixel(-15, 0),
            clickable: true,
            extData: points[i].id,
            map: map
          });
          AMap.event.addListener(marker, 'click', (e) => { //为地图添加点击事件
            var parkId = e.target.G.extData;
            $scope.parkobj = { price: 7 };
            points.forEach(function(element, index) {
              if (element.id == parkId) {
                sessionStorage.setItem('parkid', parkId);
                $scope.parkobj.id = parkId;
                $scope.parkobj.num = element.count;
                $scope.parkobj.name = element.name;
                $scope.parkobj.address = element.address;
                var location = JSON.parse(localStorage.getItem('spaceLocation')); //用户当前位置信息
                var lnglat = new AMap.LngLat(location.lng, location.lat);
                var km = lnglat.distance(element.parkloc.split(',')) / 1000;
                $scope.parkobj.range = km.toFixed(2);
                $scope.parkListShow = false;
                $scope.examineBottom = 2.74;
                parkShowCa.classList.add('show');
                parkShowCa.classList.remove('hide');
              }
            });
          });
        };
      }
    }
    $scope.closeParkShow = function(event) { //关闭停车场信息
      event.stopPropagation();
      if (event.target.localName === 'canvas') {
        $scope.parkListShow = false;
        $scope.examineBottom = 0;
        parkShowCa.classList.add('hide');
        parkShowCa.classList.remove('show');
      }
    }
    //移动地图选择位置
    function moveMapCheck(map) {
      AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
        let positionPicker = new PositionPicker({
          mode: 'dragMap', //设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
          map: map, //依赖地图对象
          iconStyle: { //自定义外观
            url: 'img/mapCent.png', //图片地址
            size: [17, 32], //要显示的点大小，将缩放图片
            ancher: [9, 16], //锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
          }
        })
        positionPicker.start();
        positionPicker.on('success', function(positionResult) {
          // console.log(positionResult);
        });
        positionPicker.on('fail', function(positionResult) {
          // console.log(positionResult);
        });
      });
    }

    /*重新获取定位*/
    $scope.getUserLocat = function() {
      getUSerLocation();
    };

    function getLocation() { //H5提供的定位方式
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
        alert("浏览器不支持地理定位。");
      }
    }

    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("定位失败,用户拒绝请求地理定位");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("定位失败,位置信息是不可用");
          break;
        case error.TIMEOUT:
          alert("定位失败,请求获取用户位置超时");
          break;
        case error.UNKNOWN_ERROR:
          alert("定位失败,定位系统失效");
          break;
      }
    };

    function showPosition(position) {
      var lat = position.coords.latitude; //纬度 
      var lag = position.coords.longitude; //经度 
      alert('纬度:' + lat + ',经度:' + lag);
    }
    /*附近停车场展示*/
    $scope.parks = []; //停车场信息数组
    $scope.parkListShow = false; //停车场列表是否显示
    $scope.refreshHeight = 0; //刷新按钮bottom值
    $scope.parkSelectBtn = { //停车场选择菜单字体颜色
      maColor: '#ff8800',
      dtColor: '#808080',
      piColor: '#808080'
    }
    $scope.getParks = function(BtnId) { //停车场选择
      if (BtnId === 'matchedDegree') { //匹配度最高
        $scope.parkSelectBtn = { maColor: '#ff8800', dtColor: '#808080', piColor: '#808080' };
        $scope.searchCondition.order = '';
        sortPark($scope.searchCondition);
      } else if (BtnId === 'distance') { //距离最近
        $scope.parkSelectBtn = { maColor: '#808080', dtColor: '#ff8800', piColor: '#808080' };
        $scope.searchCondition.order = 'distance';
        sortPark($scope.searchCondition);
      } else { //价格最低
        $scope.parkSelectBtn = { maColor: '#808080', dtColor: '#808080', piColor: '#ff8800' };
        $scope.searchCondition.order = 'price';
        sortPark($scope.searchCondition);
      }
    };

    $scope.getparkDeatil=function(parkId){   //跳转到车场详情
      sessionStorage.setItem('parkid', parkId);
      $state.go('parkDetails');
    }

    function sortPark(codition) { //车位排序
      $scope.parks.splice(0);
      getDataService.hasHeaderRequest('post', 'search/parkingslots', codition)
        .then(function(data) {
          console.log(data);
          if (data.status == 102) {
            let parklists = data.data;
            for (var i = 0; i < parklists.length; i++) {
              var parklist = {};
              parklist.id = parklists[i].id;
              parklist.name = parklists[i].name;
              parklist.count = parklists[i].count;
              parklist.price = 5;
              var location = JSON.parse(localStorage.getItem('spaceLocation')); //用户当前位置信息
              var lnglat = new AMap.LngLat(location.lng, location.lat);
              var km = lnglat.distance([parklists[i].x, parklists[i].y]) / 1000;
              parklist.range = km.toFixed(2);
              $scope.parks.push(parklist);
            }
          } else if (data.status == 101) {
            noCarportHint(event);
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(data) {
          $scope.hintText = '获取停车场失败';
          $scope.hintShow = true;
          hintHide();
        })
    }

    $scope.goparkDetails = function() { //跳转至停车场详情
      $state.go('parkDetails')
    };

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }

  })

  .controller('searchParkCtrl', function($scope, $state, $ionicPopover, $stateParams, $timeout, parksServe, getDataService) { //车位查询
    $scope.seaConditions = { slotloc: '', isstakeinfo: '', chgfeed: '', chgfeeg: '', parkfeed: '', parkfeeg: '', range: 0 }; //用户查询车位位置输入条件
    $scope.selectAdres = '选择停车位置';
    $scope.location = {}; //用户选择的地址
    $scope.parkloc = '';
    $scope.selectAddress = {}; //用户选择的地理位置信息对象
    if ($stateParams.address) { //显示选择的地理位置
      $scope.selectAddress = JSON.parse($stateParams.address);
      $scope.selectAdres = $scope.selectAddress.address;
    };

    /*选择框*/
    $scope.options = []; //传递过去的选项数组
    var subclauses = []; //选项框属于哪一条
    $scope.range = '选择距离范围'; //选择范围
    $scope.charge = '选择是否充电'; //选择是否充电
    $scope.popover = $ionicPopover.fromTemplateUrl('popover', {
      scope: $scope
    });
    $ionicPopover.fromTemplateUrl('popover', {
      scope: $scope
    }).then(function(popop) {
      $scope.popover = popop;
    });
    $scope.openPopover = function(event, condition) { //打开选择框
      subclauses.push(condition);
      if (condition === 'range') {
        $scope.options = ['100m', '200m', '300m'];
      } else {
        $scope.options = ['是', '否'];
      };
      $scope.popover.show(event);
    };
    $scope.closePopover = function() { //关闭选择框 
      $scope.popover.hide();
    };
    $scope.surePopover = function(option) { //确认选择框 
      if (subclauses[0] === 'range') {
        $scope.range = option;
        $scope.seaConditions.range = option.substring(0, option.length - 1);
      } else {
        $scope.charge = option;
        if (option == '是') {
          $scope.seaConditions.isstakeinfo = 1;
        } else {
          $scope.seaConditions.isstakeinfo = '';
        }
      };
      $scope.popover.hide();
      subclauses.splice(0, subclauses.length);
    };
    $scope.$on('$destroy', function() { // 清除浮动框
      $scope.popover.remove();
    });

    const calendarStart = new lCalendar(); //选择开始时间
    const calendarEnd = new lCalendar(); //选择结束时间
    calendarStart.init({
      'trigger': '#serchStartTime',
      'type': 'datetime'
    });
    calendarEnd.init({
      'trigger': '#serchEndTime',
      'type': 'datetime'
    });

    $scope.searchPark = function(event) { //查询并返回首页
      let otime = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''); //当前系统时间
      let pointArray;
      if ($scope.parkloc) {
        pointArray = $scope.parkloc.split(',');
      } else {
        pointArray = JSON.parse(localStorage.getItem('spaceLocation'));
      };
      $scope.seaConditions.slotloc = 'POINT(' + Number(pointArray[0]) + ' ' + Number(pointArray[1]) + ')';
      if (document.getElementById('serchStartTime').value) {
        $scope.seaConditions.stime = document.getElementById('serchStartTime').value;
      } else {
        $scope.seaConditions.stime = otime;
      };
      if (document.getElementById('serchEndTime').value) {
        $scope.seaConditions.etime = document.getElementById('serchEndTime').value;
      } else {
        $scope.seaConditions.etime = otime;
      };
      getDataService.hasHeaderRequest('post', 'search/parkingslots', $scope.seaConditions)
        .then(function(data) {
          if (data.status == 102) {
            let result = data.data;
            result.forEach(function(element, index) {
              element.parkloc = element.x + ',' + element.y;
            });
            let parksList = { parks: result };
            parksServe.set(parksList);
            $state.go('app.sharePark', { searchCondition: $scope.seaConditions });
          } else if (data.status == 101) {
            noCarportHint(event);
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
    }
    $scope.noCarportHint = $ionicPopover.fromTemplateUrl('noCarportHint', { //没有找到车位弹出
      scope: $scope
    });
    $ionicPopover.fromTemplateUrl('noCarportHint', {
      scope: $scope
    }).then(function(popop) {
      $scope.noCarportHint = popop;
    });
    $scope.closenoCarportHint = function() { //关闭选择框 
      $scope.noCarportHint.hide();
    };
    $scope.$on('$destroy', function() { // 清除浮动框
      $scope.noCarportHint.remove();
    });

    function noCarportHint(event) { //没有查找到对应车位时候的提示
      $scope.noCarportHint.show(event);
    };

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('demandCarportCtrl', function($scope, $ionicPopover, $stateParams, $state, $timeout, getDataService) { //求租车位
    $scope.demandInfos = { chgfee: 0, parkfee: 0, range: 0, address: 0, distance: 0 }; //用户发布的求租车位信息
    $scope.demandInfos.otime = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''); //当前系统时间

    if (localStorage.getItem('userMessage') != 'undefined') {
      $scope.userMess = JSON.parse(localStorage.getItem('userMessage')); //存储在本地的用户信息
      let loginName = $scope.userMess.mobile;
      if (loginName) {
        $scope.userName = loginName.substring(0, 3) + '****' + loginName.substring(7, 11);
      }
    };

    $scope.selectAdres = '选择停车位置(必选)';
    $scope.parkloc = ''; //用户选择的地理位置信息对象

    let demandPage = $stateParams.demandId; //从哪个页面跳转过来
    $scope.demandBack = function() { //返回键函数
      if (demandPage === 'searchPark') {
        $state.go('searchPark');
      } else if (demandPage === 'mycar') {
        $state.go('myCar');
      } else if (demandPage === 'modify') {
        $state.go('myOrder');
      } else {
        $state.go('app.sharePark');
      };
    }

    $scope.SelectRange = '选择距离范围(必选)';
    $scope.demandPopover = $ionicPopover.fromTemplateUrl('demandPopover', {
      scope: $scope
    });
    $ionicPopover.fromTemplateUrl('demandPopover', {
      scope: $scope
    }).then(function(popop) {
      $scope.demandPopover = popop;
    });
    $scope.opendemandPopover = function(event) { //打开选择框
      $scope.options = ['100m', '200m', '300m'];
      $scope.demandPopover.show(event);
    };
    $scope.closedemandPopover = function() { //关闭选择框 
      $scope.demandPopover.hide();
    };
    $scope.suredemandPopover = function(option) { //确认选择框 
      $scope.SelectRange = option;
      $scope.demandInfos.distance = option.substring(0, option.length - 1);
      $scope.demandPopover.hide();
    };
    $scope.$on('$destroy', function() { // 清除浮动框
      $scope.demandPopover.remove();
    });

    const calendarStart = new lCalendar(); //选择开始时间
    const calendarEnd = new lCalendar(); //选择结束时间
    calendarStart.init({
      'trigger': '#demandStartTime',
      'type': 'datetime'
    });
    calendarEnd.init({
      'trigger': '#demandEndTime',
      'type': 'datetime'
    });

    $scope.inforSub = function() { //提交车位发布信息
      if (!$scope.parkloc) {
        $scope.hintText = '地理位置不能为空';
        $scope.hintShow = true;
        hintHide();
      } else if ($scope.SelectRange == '选择距离范围(必选)') {
        $scope.hintText = '距离范围不能为空';
        $scope.hintShow = true;
        hintHide();
      } else {
        if (demandPage === 'modify') {
          $scope.demandInfos.id = $stateParams.orderId;
          subFun('modify');
        } else {
          subFun('other');
        }
      };
    };

    function subFun(type) {
      if (document.getElementById('demandStartTime').value) {
        $scope.demandInfos.stime = document.getElementById('demandStartTime').value;
      } else {
        $scope.demandInfos.stime = $scope.demandInfos.otime;
      };
      if (document.getElementById('demandEndTime').value) {
        $scope.demandInfos.etime = document.getElementById('demandEndTime').value;
      } else {
        $scope.demandInfos.etime = $scope.demandInfos.otime;
      };
      if ($scope.parkloc) {
        let pointArray = $scope.parkloc.split(',');
        $scope.demandInfos.slotloc = 'POINT(' + Number(pointArray[0]) + ' ' + Number(pointArray[1]) + ')';
      } else {
        $scope.demandInfos.slotloc = '';
      };
      $scope.demandInfos.address = $scope.selectAdres;
      if (type === 'modify') { //修改订单
        getDataService.hasHeaderRequest('post', 'put/buyinginfos/id', $scope.demandInfos)
          .then(function(data) {
            if (data.status == 101) {
              $state.go('app.sharePark');
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
        getDataService.hasHeaderRequest('post', 'post/buyinginfos', $scope.demandInfos)
          .then(function(data) {
            if (data.status == 101) {
              if (demandPage === 'searchPark') {
                $state.go('searchPark');
              } else if (demandPage === 'mycar') {
                $state.go('myCar');
              } else {
                $state.go('app.sharePark');
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
      }
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('parkDetailsCtrl', function($scope, $stateParams, $state, $timeout, getDataService) { //停车场详情
    $scope.parkMes = {}; //停车场信息
    $scope.parkSolits = []; //该车场车位列表
    var parkid = JSON.parse(sessionStorage.getItem('parkid')); //用户当前位置信息
    getPaerMes(parkid);

    function getPaerMes(parkid) {
      getDataService.hasHeaderRequest('post', 'get/parkinfos', { id: parkid })
        .then(function(data) {
          if (data.status == 102) {
            let result = data.data[0];
            $scope.parkMes.id = result.id;
            $scope.parkMes.count = result.count;
            $scope.parkMes.name = result.name;
            $scope.parkMes.address = result.address;
            var location = JSON.parse(localStorage.getItem('spaceLocation')); //用户当前位置信息
            var lnglat = new AMap.LngLat(location.lng, location.lat);
            var km = lnglat.distance([result.x, result.y]) / 1000;
            $scope.parkMes.range = km.toFixed(2);
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
    getDataService.hasHeaderRequest('post', 'get/sellinginfos/slotid', { parkid: parkid })
      .then(function(data) {
        if (data.status == 102) {
          var result = data.data;
          result.forEach(function(element, index) {
            var chargType, chargPower, charguse;
            var carport = {};
            carport.id = element.id;
            carport.slotid = element.slotid;
            carport.parkfee = element.parkfee;
            if (element.staketype) {
              if (element.state) {
                if (element.staketype == 1) {
                  chargType = '直流';
                } else if (element.staketype == 2) {
                  chargType = '交流';
                } else {
                  chargType = '其它';
                };
                carport.charg = chargType;
                // carport.charg = chargType + '、' + element.power + 'KW' + '、正常';
              } else {
                carport.charg = '异常';
              };
            } else {
              carport.charg = '无';
            };
            carport.floor = element.floor;
            $scope.parkSolits.push(carport);
          });
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

    $scope.parkSelectBtn = { //停车场选择菜单字体颜色
      maColor: '#ff8800',
      dtColor: '#808080',
      piColor: '#808080'
    };
    $scope.getParks = function(BtnId) { //停车场选择
      if (BtnId === 'matchedDegree') { //匹配度最高
        $scope.parkSelectBtn = { maColor: '#ff8800', dtColor: '#808080', piColor: '#808080' };
      } else if (BtnId === 'distance') { //距离最近
        $scope.parkSelectBtn = { maColor: '#808080', dtColor: '#ff8800', piColor: '#808080' };
      } else { //价格最低
        $scope.parkSelectBtn = { maColor: '#808080', dtColor: '#808080', piColor: '#ff8800' };
      }
    }

    $scope.godeatil = function(id) { //跳转车位详情
      $state.go('carportDetails', { id: id });
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('carportDetailsCtrl', function($scope, $state, $timeout, $stateParams, getDataService) { //车位详情
    $scope.parkMes = {}; //停车场信息
    var parkid = JSON.parse(sessionStorage.getItem('parkid')); //用户当前位置信息
    getPaerMes(parkid);

    function getPaerMes(parkid) {
      getDataService.hasHeaderRequest('post', 'get/parkinfos', { id: parkid })
        .then(function(data) {
          if (data.status == 102) {
            let result = data.data[0];
            $scope.parkMes.id = result.id;
            $scope.parkMes.count = result.count;
            $scope.parkMes.name = result.name;
            $scope.parkMes.address = result.address;
            var location = JSON.parse(localStorage.getItem('spaceLocation')); //用户当前位置信息
            var lnglat = new AMap.LngLat(location.lng, location.lat);
            var km = lnglat.distance([result.x, result.y]) / 1000;
            $scope.parkMes.range = km.toFixed(2);
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

    $scope.backPark = function() { //返回停车场详情
      $state.go('parkDetails')
    };
    $scope.carportMes = {}; //车位信息
    getDataService.hasHeaderRequest('post', 'get/sellinginfos/slotid', { id: $stateParams.id }) //$scope.parkMes.id
      .then(function(data) {
        if (data.status == 102) {
          var result = data.data;
          $scope.carportMes.id = result.pid;
          $scope.carportMes.slotid = result.slotid;
          $scope.carportMes.stime = result.stime;
          $scope.carportMes.etime = result.etime;
          $scope.carportMes.duration = calculateHours(result.stime, result.etime); //停车时长
          $scope.carportMes.parkfee = result.parkfee;
          $scope.carportMes.chgfee = result.chgfee;
          $scope.carportMes.overtimeinterval = result.overtimeinterval;
          $scope.carportMes.total = result.parkfee * $scope.carportMes.duration;
          var chargType, chargPower, charguse;
          if (result.staketype) {
            if (result.state) {
              if (result.staketype == 1) {
                chargType = '直流';
              } else if (result.staketype == 2) {
                chargType = '交流';
              } else {
                chargType = '其它';
              };
              $scope.carportMes.charg = chargType + '、' + result.power + 'KW' + '、正常';
            } else {
              $scope.carportMes.charg = '异常';
            };
          } else {
            $scope.carportMes.charg = '无';
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

    $scope.scribeSure = function() { //去预约页面
      $state.go('subscribeSure', { carportMes: $scope.carportMes, id: $stateParams.id });
    }

    function calculateHours(startTime, endTime) { //计算停车时长
      let duration, _timeDiffer;
      if (startTime && endTime) {
        _timeDiffer = Date.parse(endTime) - Date.parse(startTime); //时间差的毫秒数
        duration = Math.floor(_timeDiffer / (60 * 1000))
      };
      return duration;
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('subscribeSureCtrl', function($scope, $ionicPopover, $state, $timeout, $stateParams, getDataService) { //车位预约
    $scope.backCarport = function() { //返回车位详情
      $state.go('carportDetails', { id: $stateParams.id });
    };
    $scope.carportMes = $stateParams.carportMes;

    $scope.carusersub = { total: 0 }; //用户预约信息
    if ($scope.carportMes.slotid) {
      console.log({ slotid: $scope.carportMes.id });
      getDataService.hasHeaderRequest('post', 'get/parkingslots', { slotid: $scope.carportMes.id })
        .then(function(data) {
          console.log(data);
          if (data.status == 102) {
            $scope.carusersub.slotid = data.data[0].id;
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(data) {
          $scope.hintText = '车辆列表获取失败';
          $scope.hintShow = true;
          hintHide();
        })
    };
    $scope.carusersub.parkfee = $scope.carportMes.parkfee;
    // $scope.carusersub.total = $scope.carportMes.parkfee * calculateHours($scope.carportMes.stime, $scope.carportMes.etime);

    const calendarStart = new lCalendar(); //选择开始时间
    const calendarEnd = new lCalendar(); //选择结束时间
    calendarStart.init({
      'trigger': '#carportStartTime',
      'type': 'datetime',
      'start': $scope.carportMes.stime,
      'end': $scope.carportMes.etime,
      'state': 'start'
    });
    calendarEnd.init({
      'trigger': '#carportEndTime',
      'type': 'datetime',
      'start': $scope.carportMes.stime,
      'end': $scope.carportMes.etime,
      'state': 'end'
    });

    var startTime, endTime;
    $scope.getStartTime = function() {
      var chattTime = document.getElementById('lendDate');
      chattTime.addEventListener('click', function() {
        startTime = document.getElementById('carportStartTime').value;
        endTime = document.getElementById('carportEndTime').value;
        // $scope.carusersub.total = $scope.carportMes.parkfee * calculateHours(startTime, endTime);
        // $scope.$apply();
      })
    }

    function calculateHours(startTime, endTime) { //计算停车时长
      let duration, _timeDiffer;
      if (startTime && endTime) {
        _timeDiffer = Date.parse(endTime) - Date.parse(startTime); //时间差的毫秒数
        duration = Math.floor(_timeDiffer / (60 * 1000));
      };
      return duration;
    }

    //选择车辆
    $scope.voiture = '选择预约车辆(必选)'; //选择预约车辆
    $scope.voitureid = ''; //选择预约车辆id
    $scope.timeture = '0'; //选择预约保留时间
    let stateArr = [];
    $scope.options = []; //选项数组
    $scope.popover = $ionicPopover.fromTemplateUrl('popover', {
      scope: $scope
    });
    $ionicPopover.fromTemplateUrl('popover', {
      scope: $scope
    }).then(function(popop) {
      $scope.popover = popop;
    });
    $scope.openPopover = function(event, state) { //打开选择框
      stateArr.splice(0, stateArr.length);
      $scope.options.splice(0, $scope.options.length);
      stateArr.push(state);
      if (state === 'car') {
        getDataService.hasHeaderRequest('post', 'get/carinfos', { title: 'yuyue' })
          .then(function(data) {
            if (data.status == 102) {
              $scope.options = data.data;
              $scope.popover.show(event);
            } else if (data.status == 401 || data.status == 402 || data.status == 403) {
              $state.go('login')
            } else {
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            }
          }).catch(function(data) {
            $scope.hintText = '车辆列表获取失败';
            $scope.hintShow = true;
            hintHide();
          })
      } else {
        $scope.options = [
          { id: 't04', plateno: '0' },
          { id: 't01', plateno: '10' },
          { id: 't02', plateno: '15' },
          { id: 't03', plateno: '20' }
        ];
        $scope.popover.show(event);
      };
    };
    $scope.closePopover = function(option) { //关闭选择框 
      if (option) {
        if (stateArr[0] === 'car') {
          $scope.voiture = option.plateno;
          $scope.voitureid = option.id;
          $scope.carusersub.carid = option.id;
        } else if (stateArr[0] === 'time') {
          $scope.timeture = option.plateno;
          $scope.carusersub.total = $scope.carportMes.parkfee * option.plateno;
          $scope.carusersub.prepay = $scope.carportMes.parkfee * option.plateno;
        };
      };
      $scope.popover.hide();
    };
    $scope.$on('$destroy', function() { // 清除浮动框
      $scope.popover.remove();
    });

    $scope.zhifubao = function() { //支付宝支付
      console.log($scope.carusersub);
      $scope.carusersub.stime = document.getElementById('carportStartTime').value;
      $scope.carusersub.etime = document.getElementById('carportEndTime').value;
      var nowTime = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''); //当前系统时间
      var newsecond = Date.parse($scope.carusersub.stime) + $scope.timeture * 60 * 1000;
      $scope.carusersub.ctime = new Date(newsecond).Format("yyyy-MM-dd hh:mm");
      getDataService.hasHeaderRequest('post', 'traninfos/payment', $scope.carusersub)
        .then(function(data) {
          if (data.status == 101) {
            $state.go('subscribeSuccess')
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          };
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        }).catch(function(data) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        })
    }

    Date.prototype.Format = function(fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('subscribeSuccessCtrl', function($scope, $ionicActionSheet) { //预约成功
    var schemeBaidu, schemeGaode, platform;
    if (device.platform === 'iOS') { //如果是ios系统执行
      platform = 'ios';
      schemeBaidu = 'baidu://'; //百度地图
      schemeGaode = 'iosamap://'; //高德地图
    } else if (device.platform === 'Android') { //如果是Android系统执行
      platform = 'android';
      schemeBaidu = 'com.baidu.BaiduMap'; //百度地图
      schemeGaode = 'com.autonavi.minimap'; //高德地图
    };

    $scope.gotoNavigat = function() { //导航函数 
      $ionicActionSheet.show({
        cancelText: '取消',
        buttons: [
          { text: '高德地图' },
          { text: '百度地图' }
        ],
        buttonClicked: function(index) {
          if (index === 0) {
            appAvailability.check(schemeGaode, gaodeSuccessCallback, gaodeErrorCallback); //检测手机上是否装有高德地图APP            
          } else {
            appAvailability.check(schemeGaode, baiduSuccessCallback, baiduErrorCallback); //检测手机上是否装有百度地图APP
          };
          return true;
        }
      });
    };

    function gaodeSuccessCallback() { //高德地图回调函数
      let sApp;
      if (platform === 'ios') {
        startApp.set("iosamap://path?sourceApplication=applicationName&sname=我的位置&&dlat=40.07717&dlon=116.314094&dname=B&dev=0&t=0");
      } else {
        sApp = startApp.set({ /* params */
          "action": "ACTION_VIEW",
          "category": "CATEGORY_DEFAULT",
          "type": "text/css",
          "package": "com.autonavi.minimap",
          "uri": "amapuri://route/plan/?sid=BGVIS1&sname=我的位置&dlat=40.07717&dlon=116.314094&dname=B&dev=0&t=0",
          "flags": ["FLAG_ACTIVITY_CLEAR_TOP", "FLAG_ACTIVITY_CLEAR_TASK"],
          "intentstart": "startActivity",
        }, { /* extras */
          "EXTRA_STREAM": "extraValue1",
          "extraKey2": "extraValue2"
        });
      }

      sApp.start(function() { /* success */
        console.log("OK");
      }, function(error) { /* fail */
        alert(error);
      });
    };

    function gaodeErrorCallback() { //高德地图回调函数
      alert('未检测到高德地图');
    };

    function baiduSuccessCallback() { //百度地图回调函数
      let sApp
      if (platform === 'ios') {
        startApp.set("baidumap://map/navi?location=40.057023, 116.307852&src=push&type=BLK&src=webapp.line.yourCompanyName.yourAppName");
      } else {
        sApp = startApp.set({ /* params */
          "action": "ACTION_VIEW",
          "category": "CATEGORY_DEFAULT",
          "type": "text/css",
          "package": "com.baidu.BaiduMap",
          "uri": "bdapp://map/direction?origin=我的位置&destination=中关村&mode=driving&region=北京",
          "flags": ["FLAG_ACTIVITY_CLEAR_TOP", "FLAG_ACTIVITY_CLEAR_TASK"],
          "intentstart": "startActivity",
        }, { /* extras */
          "EXTRA_STREAM": "extraValue1",
          "extraKey2": "extraValue2"
        });
      };

      sApp.start(function() { /* success */
        console.log("OK");
      }, function(error) { /* fail */
        alert(error);
      });
    };

    function baiduErrorCallback() { //百度地图回调函数
      alert('未检测到百度地图');
    };
  })
