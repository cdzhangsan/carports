angular.module('Driective', []) 
.directive('getLocation',function() {  //选择地理位置
    var getlocationObj={
        restrict:'EA',
        replace:true,
        template:`
            <script id="modal.html" type="text/ng-template">
                <ion-modal-view>
                    <ion-view class="searchPark">
                    <ion-header-bar align-title="center">
                        <button class="button" type="button" ng-click="closeModal()">
                        <img src="img/back.png">
                        </button>
                        <h2 class="title">选择车位位置</h2>
                        <button class="bindCar" type="button" ng-click="sureAddress()">
                        确定
                        </button>
                    </ion-header-bar>
                    <ion-content scroll="false">
                        <div class="selectSpace">
                        <header>
                            <div>
                            <div class="left">
                                <img src="img/searchwe.png" alt="">
                                <input type="text" ng-model="searchKey.value" placeholder="查找位置">
                            </div>
                            <button type="button" ng-click="getSpace()">搜索</button>
                            </div>
                        </header>
                        <div id="smallMap"></div>
                        <button type="button" class="examine" ng-click="getUserLocation()">
                            <img src="img/examine.png">
                        </button>
                        <span></span>
                        <ion-scroll id="resultContainer" scrollbar-y="false" zooming="false">
                            <ul id="resultCont">
                            <li ng-repeat="item in searchData" ng-click="toaddress({{item}})">
                                <h2>{{item.name}}</h2>
                                <p>{{item.address}}</p>
                            </li>
                            </ul>
                        </ion-scroll>
                        </div>
                    </ion-content>
                    </ion-view>
                </ion-modal-view>
                </script>
        `,
        controller: function ($scope, $ionicModal) {
            $scope.searchKey = { value: null };
            $scope.searchData = []; //显示地理信息数组
            let address = []; //选择的地址数组
            $ionicModal.fromTemplateUrl('modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
                creatMap();
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            $scope.searchKey = { value: null };
            $scope.searchData = []; //显示地理信息数组
            function creatMap() { //创建地图
                if (localStorage.getItem('spaceLocation')) {
                    var obj = {};
                    var location = JSON.parse(localStorage.getItem('spaceLocation')); //用户当前位置信息
                    var userLocation = location.lng + ',' + location.lat; //用户当前经纬度
                    obj.location = location;
                    address.splice(0, address.length);
                    address.push(obj);
                    var map = new AMap.Map('smallMap', {
                        resizeEnable: true,
                        zoom: 16,
                        center: userLocation.split(',')
                    });
                    moveMapCheck(map);
                };
            };
            //移动地图选择位置
            function moveMapCheck(map) {
                AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
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
                    positionPicker.on('success', function (positionResult) {
                        $scope.searchData.splice(0, $scope.searchData.length);
                        //console.log(positionResult);
                        localStorage.setItem('citycode', positionResult.regeocode.addressComponent.citycode); //保存用户所在城市citycode   
                        for (let i = 0; i < positionResult.regeocode.pois.length; i++) {
                            let resultObj = {};
                            resultObj.name = positionResult.regeocode.pois[i].name;
                            resultObj.address = positionResult.regeocode.pois[i].address;
                            resultObj.location = positionResult.regeocode.pois[i].location;
                            $scope.searchData.push(resultObj);
                        };
                        let addressObj = {}; //用户移动地图时选中的第一条地址信息
                        addressObj.name = positionResult.regeocode.pois[0].name;
                        addressObj.address = positionResult.regeocode.pois[0].address;
                        addressObj.location = positionResult.regeocode.pois[0].location;
                        address.splice(0, address.length);
                        address.push(addressObj);
                        $scope.$apply();
                    });
                    positionPicker.on('fail', function (positionResult) {
                        //console.log(positionResult);
                    });
                });
            };
            $scope.getSpace = function () { //搜索位置
                if ($scope.searchKey.value) {
                    $scope.searchData.splice(0, $scope.searchData.length);
                    AMap.service(["AMap.PlaceSearch"], function () {
                        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                            pageSize: 10,
                            city: localStorage.getItem('citycode')
                        });
                        //关键字查询
                        placeSearch.search($scope.searchKey.value, function (status, result) {
                            address.splice(0, address.length);
                            address.push(result.poiList.pois[0]);
                            var map = new AMap.Map('smallMap', {
                                resizeEnable: true,
                                zoom: 16,
                                center: [result.poiList.pois[0].location.lng, result.poiList.pois[0].location.lat]
                            });
                            moveMapCheck(map);
                            if (status === 'complete') {
                                for (let i = 0; i < result.poiList.pois.length; i++) {
                                    let resultObj = {};
                                    resultObj.name = result.poiList.pois[i].name;
                                    resultObj.address = result.poiList.pois[i].address;
                                    resultObj.location = result.poiList.pois[i].location;
                                    $scope.searchData.push(resultObj);
                                }
                            };
                            $scope.$apply();
                        });
                    });
                }
            };
            $scope.getUserLocation = function () { //刷新
                creatMap();
            };
            $scope.toaddress = function (item) { //二次选择
                var lngLat = [item.location.lng, item.location.lat];
                var map = new AMap.Map('smallMap', {
                    resizeEnable: true,
                    zoom: 16,
                    center: lngLat
                });
                address.splice(0, address.length);
                address.push(item);
                let location = item.location;
                AMap.service(["AMap.PlaceSearch"], function () {
                    var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                        pageSize: 10,
                        city: localStorage.getItem('citycode')
                    });
                    //关键字查询
                    placeSearch.search($scope.searchKey.value, function (status, result) {
                        moveMapCheck(map);
                        $scope.$apply();
                    });
                });
                var map = new AMap.Map('smallMap', {
                    resizeEnable: true,
                    zoom: 16,
                    center: [location.lng, location.lat]
                });
                moveMapCheck(map);
            }
            $scope.sureAddress = function () { //确认
                var location = address[0].location;
                console.log(address[0]);
                if (address[0]) { //显示选择的地理位置
                    $scope.location = address[0];
                    $scope.selectAdres = address[0].address;
                    $scope.parkloc = location.lng + ',' + location.lat;
                };
                $scope.searchKey = { value: null };
                $scope.modal.hide();
            }
        }
    };

    return getlocationObj;
})