angular.module('management', [])
  .controller('managementCtrl', function($scope) { //管理端首页
    $scope.matters = { //管理端首页事项显示
      company: true,
      user: true,
      park: true,
      carport: true,
      charg: true
    };
    var role = JSON.parse(localStorage.getItem('userMessage')).type;
    if (role == 1) {
      $scope.matters.park = false;
      $scope.matters.carport = false;
      $scope.matters.charg = false;
    } else if (role == 2) {
      $scope.matters.user = false;
      $scope.matters.park = false;
      $scope.matters.company = false;
      $scope.matters.charg = false;
    } else if (role == 8) {
      $scope.matters.carport = false;
      $scope.matters.company = false;
      $scope.matters.charg = false;
    } else if (role == 3) {
      $scope.matters.user = false;
      $scope.matters.company = false;
      $scope.matters.carport = false;
      $scope.matters.park = false;
    }

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
    }

    $scope.menuAlert = false; //划开菜单显示遮罩
    $scope.showmenuAlert = function() {
      $scope.menuAlert = true;
    }
    $scope.closemenuAlert = function() {
      $scope.menuAlert = false;
    }

    $scope.manageSearchBtn = false;
    $scope.inSearch = function() { //搜索框获取焦点
      $scope.manageSearchBtn = true;
    };
    $scope.outSearch = function() { //搜索框失去焦点
      $scope.manageSearchBtn = false;
    };

  })
  .controller('companyManagementCtrl', function($scope, $timeout, $state, getDataService) { //公司管理
    $scope.companys = []; //公司信息
    $scope.hintShow = false;

    $scope.searchCon = { searchName: '' }; //搜索条件
    $scope.manageSearchBtn = false;
    $scope.inSearch = function() { //搜索框获取焦点
      $scope.manageSearchBtn = true;
    };
    $scope.outSearch = function() { //搜索框失去焦点
      $scope.manageSearchBtn = false;
    };
    $scope.search = function() { //搜索公司
      getDataService.hasHeaderRequest('post', 'get/search', $scope.searchCon)
        .then(function(data) {
          if (data.status == 102) {
            $scope.companys.splice(0, $scope.companys.length);
            data.data.forEach(function(element) {
              if (element.alipay) {
                element.payaccount = element.alipay;
              } else if (element.wechat) {
                element.payaccount = element.wechat;
              } else {
                element.payaccount = '无账号';
              };
              $scope.companys.push(element);
            });
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide()
          }
        }).catch(function(err) {
          $scope.hintText = err.message;
          $scope.hintShow = true;
          hintHide()
        })
    };

    getDataService.hasHeaderRequest('get', 'get/offices/parentid')
      .then(function(data) {
        if (data.status == 102) {
          $scope.companys.splice(0, $scope.companys.length);
          data.data.forEach(function(element) {
            if (element.alipay) {
              element.payaccount = element.alipay;
            } else if (element.wechat) {
              element.payaccount = element.wechat;
            } else {
              element.payaccount = '无账号';
            };
            $scope.companys.push(element);
          });
        } else if (data.status == 401 || data.status == 402 || data.status == 403) {
          $state.go('login')
        } else if (data.status == 101) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide()
        }
      }).catch(function(err) {
        $scope.hintText = err.message;
        $scope.hintShow = true;
        hintHide()
      })

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('companyMessCtrl', function($scope, $stateParams, $http, $timeout, $state, $ionicPopover, getDataService) { //公司信息、添加公司
    $scope.compeny = {}; //公司的信息
    $scope.detail = { address: '' }; //用户输入的详细地址
    $scope.options = []; //选择公司类型
    $scope.adreIds = { pro: '110100', dist: '110000', city: '110101' }; //省市区ID数
    getDataService.hasHeaderRequest('get', 'get/types')
      .then(function(data) {
        if (data.status == 102) {
          $scope.options.splice(0, $scope.options.length);
          data.data.forEach(function(element) {
            $scope.options.push(element);
          });
        } else if (data.status == 401 || data.status == 402 || data.status == 403) {
          $state.go('login')
        } else {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        }
      }).catch(function(err) {
        $scope.hintText = err.message;
        $scope.hintShow = true;
        hintHide();
      })

    if ($stateParams.companyType === 'add') { //添加公司
      $scope.add = true;
      $scope.detail.address = '';
      $scope.companyTitle = '添加公司';
      $scope.seletadress = '选择公司位置(必选)';
      $scope.userType = '选择公司类型(必选)';
      $scope.compeny = {
        name: '',
        areaid: '',
        code: '',
        taxID: '',
        address: '',
        zipCode: '',
        type: '',
        phone: '',
        mobile: '',
        fax: '',
        email: '',
        remarks: '',
        master: '',
        alipay: '',
        wechat: ''
      };
    } else { //公司信息
      $scope.add = false;
      $scope.companyTitle = '公司信息';
      getDataService.hasHeaderRequest('get', 'get/types')
        .then(function(data) {
          $scope.options.splice(0, $scope.options.length);
          if (data.status == 102) {
            data.data.forEach(function(element) {
              $scope.options.push(element);
              getMes();
            });
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(err) {
          $scope.hintText = err.message;
          $scope.hintShow = true;
          hintHide();
        })
    }

    function getMes() { //公司详情
      getDataService.hasHeaderRequest('post', 'get/offices/id', { id: $stateParams.companyId })
        .then(function(data) {
          if (data.status == 102) {
            var result = data.data[0];
            $scope.compeny.id = result.id;
            $scope.compeny.name = result.name;
            $scope.compeny.taxID = result.taxid;
            $scope.options.forEach(function(element) { //公司类型
              if (element.id == result.type) {
                $scope.userType = element.name;
              }
            });
            $scope.compeny.areaid = result.aid;
            let parentId = result.aparent_ids.split(',');
            $scope.adreIds.city = result.aid;
            $scope.adreIds.dist = parentId[1];
            $scope.adreIds.pro = parentId[2];
            $scope.compeny.address = result.aremarks;
            $scope.compeny.type = result.type;
            $scope.compeny.phone = result.phone;
            $scope.compeny.mobile = result.mobile;
            $scope.compeny.email = result.email;
            $scope.compeny.payType = result.paytype;
            $scope.compeny.alipay = result.alipay;
            $scope.compeny.wechat = result.wechat;
            $scope.seletadress = result.aremarks;
            $scope.detail.address = result.address.substring(result.aremarks.length);
            $scope.compeny.zipCode = '';
            $scope.compeny.fax = '';
            $scope.compeny.remarks = '';
            $scope.compeny.master = result.master;
          }
        }).catch(function(err) {
          $scope.hintText = err.message;
          $scope.hintShow = true;
          hintHide();
        })
    }

    $scope.userPopover = $ionicPopover.fromTemplateUrl('userPopover', { //选择公司类型
      scope: $scope
    }).then(function(popop) {
      $scope.userPopover = popop;
    });
    $scope.choiceUser = function(event) { //打开选择框
      $scope.userPopover.show(event);
    };
    $scope.closeuserPopover = function() { //关闭选择框 
      $scope.userPopover.hide();
    };
    $scope.sureuserPopover = function(option) { //确认选择框
      $scope.userType = option.name;
      $scope.compeny.type = option.id;
      $scope.userPopover.hide();
    };

    //选择省市区
    var selectContactDom = $('#select_contact');
    var showContactDom = $('#show_contact');
    var contactProvinceCodeDom = $('#contact_province_code');
    var contactCityCodeDom = $('#contact_city_code');
    selectContactDom.bind('click', function() {
      var sccode = showContactDom.attr('data-city-code');
      var scname = showContactDom.attr('data-city-name');
      var oneLevelId = $scope.adreIds.dist;
      var twoLevelId = $scope.adreIds.pro;
      var threeLevelId = $scope.adreIds.city;
      var iosSelect = new IosSelect(3, [iosProvinces, iosCitys, iosCountys], {
        title: '',
        itemHeight: 35,
        relation: [1, 1],
        oneLevelId: oneLevelId,
        twoLevelId: twoLevelId,
        threeLevelId: threeLevelId,
        callback: function(selectOneObj, selectTwoObj, selectThreeObj) {
          contactProvinceCodeDom.val(selectOneObj.id);
          contactProvinceCodeDom.attr('data-province-name', selectOneObj.value);
          contactCityCodeDom.val(selectTwoObj.id);
          contactCityCodeDom.attr('data-city-name', selectTwoObj.value);
          showContactDom.attr('data-province-code', selectOneObj.id);
          showContactDom.attr('data-city-code', selectTwoObj.id);
          showContactDom.attr('data-district-code', selectThreeObj.id);
          showContactDom.html(selectOneObj.value + ' ' + selectTwoObj.value + ' ' + selectThreeObj.value);
          $scope.seletadress = selectOneObj.value + ' ' + selectTwoObj.value + ' ' + selectThreeObj.value;
          $scope.compeny.address = selectOneObj.value + selectTwoObj.value + selectThreeObj.value;
          $scope.compeny.areaid = selectThreeObj.id;
          getcode(selectThreeObj.value);
        }
      });
    });
    // getDataService.hasHeaderRequest('get', 'get/areas')
    //   .then(function(data) {
    //     var iosProvinces = [],
    //       iosCitys = [],
    //       iosCountys = [];
    //     if (data.data) {
    //       data.data.forEach(function(element, index) {
    //         if (element.parent_ids.length <= 2) {
    //           iosProvinces.push(element);
    //         } else if (element.parent_ids.length <= 4 && element.parent_ids.length > 2) {
    //           iosCitys.push(element);
    //         } else if (element.parent_ids.length > 4) {
    //           iosCountys.push(element);
    //         }
    //       });
    //       selectContactDom.bind('click', function() {
    //         var sccode = showContactDom.attr('data-city-code');
    //         var scname = showContactDom.attr('data-city-name');
    //         var oneLevelId = showContactDom.attr('data-province-code');
    //         var twoLevelId = showContactDom.attr('data-city-code');
    //         var threeLevelId = showContactDom.attr('data-district-code');
    //         var iosSelect = new IosSelect(3, [iosProvinces, iosCitys, iosCountys], {
    //           title: '',
    //           itemHeight: 35,
    //           relation: [1, 1],
    //           oneLevelId: oneLevelId,
    //           twoLevelId: twoLevelId,
    //           threeLevelId: threeLevelId,
    //           callback: function(selectOneObj, selectTwoObj, selectThreeObj) {
    //             $scope.compeny.areaid = selectThreeObj.id;
    //             showContactDom.attr('data-province-code', selectOneObj.id);
    //             showContactDom.attr('data-city-code', selectTwoObj.id);
    //             showContactDom.attr('data-district-code', selectThreeObj.id);
    //             //showContactDom.html(selectOneObj.name + ' ' + selectTwoObj.name + ' ' + selectThreeObj.name);
    //             $scope.seletadress = selectOneObj.name + ' ' + selectTwoObj.name + ' ' + selectThreeObj.name;
    //             $scope.compeny.address = selectOneObj.name + selectTwoObj.name + selectThreeObj.name;
    //             getcode(selectThreeObj.name);
    //           }
    //         });
    //       });
    //     }
    //   }).catch(function(err) {
    //     console.log(err);
    //   })

    function getcode(address) { //获取区域编码和归属区域id
      var address = address;
      $http({
        method: 'GET',
        url: 'http://restapi.amap.com/v3/config/district?key=584fc05ea7947a80f6437654e771c7e0&keywords=' + address + '&subdistrict=0'
      }).then(function successCallback(response) {
        if (response.data.districts) {
          // $scope.compeny.code = 1143222;
          $scope.compeny.code = response.data.districts[0].adcode;
        }
      }, function errorCallback(response) {
        // 请求失败执行代码
      });
    }
    $scope.hintText = ''; //提示框文本
    $scope.hintShow = false; //提示框文本是否显示
    $scope.addCompany = function() { //提价公司信息
      if (!$scope.compeny.name) {
        $scope.hintText = '公司名称不能为空';
        $scope.hintShow = true;
      } else if (!$scope.compeny.taxID) {
        $scope.hintText = '公司税号不能为空';
        $scope.hintShow = true;
      } else if (!$scope.compeny.type) {
        $scope.hintText = '公司类型不能为空';
        $scope.hintShow = true;
      } else if (!$scope.compeny.phone) {
        $scope.hintText = '电话号码不能为空';
        $scope.hintShow = true;
      } else if (!$scope.compeny.email) {
        $scope.hintText = '电子邮箱格式有误';
        $scope.hintShow = true;
      } else if (!$scope.compeny.areaid) {
        $scope.hintText = '公司位置不能为空';
        $scope.hintShow = true;
      } else if (!$scope.detail.address) {
        $scope.hintText = '具体地址不能为空';
        $scope.hintShow = true;
      } else {
        $scope.compeny.address = $scope.compeny.address + $scope.detail.address; //合并地址
        if ($stateParams.companyType === 'add') {
          getDataService.hasHeaderRequest('post', 'post/offices', $scope.compeny)
            .then(function(data) {
              if (data.status == 101) {
                $state.go('companyManagement');
              } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                $state.go('login')
              } else {
                $scope.hintText = data.message;
                $scope.hintShow = true;
                hintHide();
              };
            }).catch(function(err) {
              if (err.status == 103) {
                $scope.hintText = err.message;
                $scope.hintShow = true;
              };
              hintHide();
            })
        } else {
          getDataService.hasHeaderRequest('post', 'put/offices/id', $scope.compeny)
            .then(function(data) {
              if (data.status == 101) {
                $state.go('companyManagement');
              } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                $state.go('login')
              } else {
                $scope.hintText = data.message;
                $scope.hintShow = true;
                hintHide();
              }
            }).catch(function(err) {
              if (err.status == 103) {
                $scope.hintText = err.message;
                $scope.hintShow = true;
              };
              hintHide();
            })
        }
      }
      hintHide();
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })

  .controller('userManagementCtrl', function($scope, $timeout, $state, getDataService) { //用户管理
    $scope.persons = []; //人员列表数组
    $scope.hintShow = false;

    $scope.searchCon = { searchName: '' }; //搜索条件
    $scope.manageSearchBtn = false;
    $scope.inSearch = function() { //搜索框获取焦点
      $scope.manageSearchBtn = true;
    };
    $scope.outSearch = function() { //搜索框失去焦点
      $scope.manageSearchBtn = false;
    };
    $scope.search = function() { //搜索人员
      getDataService.hasHeaderRequest('post', 'get/users/officeid/search', $scope.searchCon)
        .then(function(data) {
          if (data.status == 102) {
            $scope.persons.splice(0, $scope.persons.length);
            let result = data.data;
            result.forEach(function(element, index) {
              let obj = {};
              obj.name = element.name;
              if (element.role_id == 2) {
                obj.role = '管理用户';
              } else {
                obj.role = '普通用户';
              };
              obj.id = element.id;
              $scope.persons.push(obj);
            });
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(err) {
          $scope.hintText = err.message;
          $scope.hintShow = true;
          hintHide();
        })
    };
    getDataService.hasHeaderRequest('get', 'get/users/officeid')
      .then(function(data) {
        if (data.status == 102) {
          let result = data.data;
          result.forEach(function(element, index) {
            let obj = {};
            obj.name = element.name;
            if (element.role_id == 2) {
              obj.role = '管理用户';
            } else {
              obj.role = '普通用户';
            };
            obj.id = element.id;
            $scope.persons.push(obj);
          });
        } else if (data.status == 401 || data.status == 402 || data.status == 403) {
          $state.go('login')
        } else {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        }
      }).catch(function(err) {
        $scope.hintText = err.message;
        $scope.hintShow = true;
        hintHide();
      })

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('adduserCtrl', function($scope, $stateParams, $ionicPopup, $timeout, $state, $ionicPopover, getDataService) { //用户信息、添加用户
    var useObj = JSON.parse(localStorage.getItem('userMessage'));
    $scope.person = {}; //用户信息
    $scope.selects = []; //归属公司信息
    $scope.pwdShow = true; //设置密码是否显示

    $scope.deletConditions = { userid: '' }; //删除人员条件  

    getDataService.hasHeaderRequest('get', 'get/offices/parentid') //获取归属公司(部门)信息
      .then(function(data) {
        data.data.forEach(function(element, index) {
          $scope.selects.push(element);
        });
      }).catch(function(err) {
        $scope.hintText = err.message;
        $scope.hintShow = true;
        hintHide();
      })


    $scope.userTitle = "用户添加";
    if ($stateParams.userType === 'add') { //添加人员
      $scope.pwdShow = true;
      $scope.add = false;
      $scope.userTitle = "用户添加";
      $scope.office = '选择公司(必选)' //选中公司展示
      $scope.manager = true; //是否管理员
      $scope.person = {
        companyid: useObj.office_id, //公司ID
        officeid: '',
        pwd: '',
        no: '',
        name: '',
        email: '',
        phone: '',
        mobile: '',
        remarks: '',
        roleid: '2'
      }
    } else { //修改人员
      $scope.add = true;
      $scope.pwdShow = false;
      $scope.userTitle = "用户信息";
      var userid = $stateParams.userId;
      if (userid) {
        getDataService.hasHeaderRequest('post', 'get/users/id', { id: userid })
          .then(function(data) {
            if (data.status == 102) {
              var result = data.data[0];
              $scope.office = result.oname;
              $scope.person.name = result.name;
              $scope.person.companyid = result.company_id;
              $scope.person.officeid = result.office_id;
              $scope.person.no = result.no;
              $scope.person.email = result.email;
              $scope.person.phone = result.phone;
              $scope.person.mobile = result.mobile;
              $scope.person.remarks = '';
              $scope.person.pwd = 123;
              if (result.role_id == 2) {
                $scope.manager = true;
              } else {
                $scope.manager = false;
              }
              $scope.person.roleid = result.role_id;
              $scope.person.id = userid;
              $scope.deletConditions.userid = result.id;
            } else if (data.status == 401 || data.status == 402 || data.status == 403) {
              $state.go('login')
            }
          }).catch(function(err) {
            $scope.hintText = err.message;
            $scope.hintShow = true;
            hintHide();
          })
      }
    }

    $scope.selecter = { //选中公司
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
    $scope.toSelect = function($event) {
      if ($scope.selects.length > 7) {
        $scope.nowhei = '4.06rem';
      };
      $scope.select.show($event);
    };
    $scope.closeselect = function() {
      $scope.select.hide();
    };
    $scope.search = { key: '' }; //搜索条件
    $scope.searchSmth = function() { //搜索公司
      console.log($scope.search.key)
    };
    $scope.selectSure = function() { //确认选择
      if ($scope.selecter.value.name) {
        $scope.office = $scope.selecter.value.name;
        $scope.person.officeid = $scope.selecter.value.id;
      };
      $scope.select.hide();
    };
    // 清除浮动框
    $scope.$on('$destroy', function() {
      $scope.select.remove();
    });

    var pwdRegexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/;
    $scope.verifyPwd = function() { //验证密码格式
      if (!pwdRegexp.test($scope.person.pwd)) {
        $scope.hintText = '密码格式有误(6-10位，数字与字母组合)'
        $scope.hintShow = true
        hintHide()
      }
    }

    $scope.hintText = ''; //提示框文本
    $scope.hintShow = false; //提示框文本是否显示
    $scope.subUser = function() { //提交用户信息
      if (!$scope.person.name) {
        $scope.hintText = '人员姓名不能为空';
        $scope.hintShow = true;
      } else if (!$scope.person.mobile) {
        $scope.hintText = '手机号不能为空';
        $scope.hintShow = true;
      } else if (!$scope.person.pwd) {
        $scope.hintText = '密码不能为空';
        $scope.hintShow = true;
      } else if (!pwdRegexp.test($scope.person.pwd)) {
        $scope.hintText = '密码格式有误(6-10位，数字与字母组合)'
        $scope.hintShow = true
      } else if (!$scope.person.officeid) {
        $scope.hintText = '归属公司不能为空';
        $scope.hintShow = true;
      } else if (!$scope.person.email) {
        $scope.hintText = '邮箱不能为空';
        $scope.hintShow = true;
      } else {
        if ($stateParams.userType === 'add') {
          getDataService.hasHeaderRequest('post', 'post/users', $scope.person)
            .then(function(data) {
              if (data.status == 101) {
                $state.go('userManagement');
              } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                $state.go('login')
              } else {
                $scope.hintText = data.message;
                $scope.hintShow = true;
                hintHide();
              };
            }).catch(function(err) {
              $scope.hintText = err.message;
              $scope.hintShow = true;
              hintHide();
            })
        } else {
          delete $scope.person.pwd;
          getDataService.hasHeaderRequest('post', 'put/users/id', $scope.person)
            .then(function(data) {
              if (data.status == 101) {
                $state.go('userManagement');
              } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                $state.go('login')
              } else {
                $scope.hintText = data.message;
                $scope.hintShow = true;
                hintHide();
              }
            }).catch(function(err) {
              if (err.status == 103) {
                $scope.hintText = err.message;
                $scope.hintShow = true;
              };
            })
        }

      }
      hintHide();
    };

    $scope.deletUser = function() { //删除用户
      $ionicPopup.confirm({
        cssClass: 'goOut',
        template: "<div>确定删除该人员？</div>",
        buttons: [{
            text: "取消"
          },
          {
            text: '确定',
            onTap: function(e) {
              getDataService.hasHeaderRequest('post', 'destroy/users/id', $scope.deletConditions)
                .then(function(data) {
                  if (data.status == 101) {
                    $state.go('userManagement');
                  } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                    $state.go('login')
                  } else {
                    $scope.hintText = data.message;
                    $scope.hintShow = true;
                    hintHide();
                  }
                }).catch(function(err) {
                  $scope.hintText = err.message;
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
  .controller('parkManCtrl', function($scope, $timeout, $state, getDataService) { //停车场管理
    $scope.parks = []; //公司信息
    $scope.hintText = ''; //提示框文本
    $scope.hintShow = false;

    $scope.searchCon = { searchName: '' }; //搜索条件
    $scope.manageSearchBtn = false;
    $scope.inSearch = function() { //搜索框获取焦点
      $scope.manageSearchBtn = true;
    };
    $scope.outSearch = function() { //搜索框失去焦点
      $scope.manageSearchBtn = false;
    };
    $scope.search = function() { //搜索停车场
      getDataService.hasHeaderRequest('post', 'get/search', $scope.searchCon)
        .then(function(data) {
          if (data.status == 102) {
            $scope.parks = data.data;
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide()
          }
        }).catch(function(err) {
          $scope.hintText = err.message;
          $scope.hintShow = true;
          hintHide()
        })
    };

    getDataService.hasHeaderRequest('get', 'get/offices/parentid')
      .then(function(data) {
        if (data.status == 102) {
          $scope.parks = data.data;
        } else if (data.status == 401 || data.status == 402 || data.status == 403) {
          $state.go('login')
        } else if (data.status == 101) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        }
      }).catch(function(err) {
        $scope.hintText = err.message;
        $scope.hintShow = true;
        hintHide();
      })

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('addparkCtrl', function($scope, $stateParams, $ionicModal, $ionicPopover, $state, $http, $timeout, getDataService) { //添加停车场、停车场信息
    // $scope.selectAddress = {}; //用户选择的地理位置信息对象
    // $scope.location={};  //用户选择的地址
    // if ($stateParams.address) { //显示选择的地理位置
    //   let addressMes = JSON.parse($stateParams.address);
    //   $scope.parkloc = addressMes.location.lng + ',' + addressMes.location.lat;
    // };
    $scope.adreIds = { pro: '110100', dist: '110000', city: '110101' }; //省市区ID数
    $scope.parkloc = '停车场经纬度(必填)';
    let address = []; //选择的地址数组

    $scope.park = {}; //停车场信息
    $scope.detail = {}; //详细地址
    $scope.hintShow = false;
    if ($stateParams.parkType === 'add') { //添加停车场
      $scope.parkTitle = '添加停车场';
      $scope.seletadress = '选择地址(必选)';
      $scope.add = true;
      $scope.detail.address = '';
      $scope.park = {
        name: '',
        areaid: '',
        code: '',
        address: '',
        zipCode: '',
        mobile: '',
        phone: '',
        fax: '',
        email: '',
        taxID: '',
        alipay: '',
        wechat: '',
        remarks: '',
        parkloc: '',
        oslotnum: '',
        islotnum: '',
        oslotbegin: '',
        oslotend: '',
        islotbegin: '',
        islotend: '',
        master: ''
      }
    } else { //修改停车场
      $scope.parkTitle = '停车场信息';
      $scope.add = false;
      getDataService.hasHeaderRequest('post', 'get/offices/id', { id: $stateParams.parkId })
        .then(function(data) {
          if (data.status == 102) {
            result = data.data[0];
            $scope.park.id = result.id;
            $scope.park.name = result.name,
              $scope.park.areaid = result.aid;
            let parentId = result.aparent_ids.split(',');
            $scope.adreIds.city = result.aid;
            $scope.adreIds.dist = parentId[1];
            $scope.adreIds.pro = parentId[2];
            $scope.park.code = 12112;
            $scope.park.address = result.aremarks;
            $scope.detail.address = result.address.substring(result.aremarks.length);
            $scope.park.zipCode = '';
            $scope.park.mobile = result.mobile;
            $scope.park.phone = result.phone;
            $scope.park.fax = '';
            $scope.park.email = result.email;
            $scope.park.taxID = result.taxid;
            $scope.park.payType = result.paytype;
            $scope.seletadress = result.aremarks;
            $scope.park.alipay = result.alipay;
            $scope.park.wechat = result.wechat;
            $scope.park.remarks = result.aremarks;
            $scope.park.parkloc = result.parkloc;
            $scope.parkloc = result.x + ',' + result.y;
            $scope.park.oslotnum = result.oslotnum;
            $scope.park.islotnum = result.islotnum;
            $scope.park.oslotbegin = result.oslotbegin;
            $scope.park.oslotend = result.oslotend;
            $scope.park.islotbegin = result.islotbegin;
            $scope.park.islotend = result.islotend;
            $scope.park.master = result.master;
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(err) {
          if (err.status == 103) {
            $scope.hintText = err.message;
            $scope.hintShow = true;
          };
          hintHide();
        })
    };

    //选择省市区
    var selectContactDom = $('#select_contact');
    var showContactDom = $('#show_contact');
    var contactProvinceCodeDom = $('#contact_province_code');
    var contactCityCodeDom = $('#contact_city_code');
    selectContactDom.bind('click', function() {
      var sccode = showContactDom.attr('data-city-code');
      var scname = showContactDom.attr('data-city-name');
      var oneLevelId = $scope.adreIds.dist;
      var twoLevelId = $scope.adreIds.pro;
      var threeLevelId = $scope.adreIds.city;
      var iosSelect = new IosSelect(3, [iosProvinces, iosCitys, iosCountys], {
        title: '',
        itemHeight: 35,
        relation: [1, 1],
        oneLevelId: oneLevelId,
        twoLevelId: twoLevelId,
        threeLevelId: threeLevelId,
        callback: function(selectOneObj, selectTwoObj, selectThreeObj) {
          contactProvinceCodeDom.val(selectOneObj.id);
          contactProvinceCodeDom.attr('data-province-name', selectOneObj.value);
          contactCityCodeDom.val(selectTwoObj.id);
          contactCityCodeDom.attr('data-city-name', selectTwoObj.value);
          showContactDom.attr('data-province-code', selectOneObj.id);
          showContactDom.attr('data-city-code', selectTwoObj.id);
          showContactDom.attr('data-district-code', selectThreeObj.id);
          showContactDom.html(selectOneObj.value + ' ' + selectTwoObj.value + ' ' + selectThreeObj.value);
          $scope.seletadress = selectOneObj.value + ' ' + selectTwoObj.value + ' ' + selectThreeObj.value;
          $scope.park.address = selectOneObj.value + selectTwoObj.value + selectThreeObj.value;
          $scope.park.areaid = selectThreeObj.id;
          getcode(selectThreeObj.value);
        }
      });
    });
    // getDataService.hasHeaderRequest('get', 'get/areas')
    //   .then(function(data) {
    //     var iosProvinces = [],
    //       iosCitys = [],
    //       iosCountys = [];
    //     if (data.data) {
    //       data.data.forEach(function(element, index) {
    //         if (element.parent_ids.length <= 2) {
    //           iosProvinces.push(element);
    //         } else if (element.parent_ids.length <= 4 && element.parent_ids.length > 2) {
    //           iosCitys.push(element);
    //         } else if (element.parent_ids.length > 4) {
    //           iosCountys.push(element);
    //         }
    //       });
    //       selectContactDom.bind('click', function() {
    //         var sccode = showContactDom.attr('data-city-code');
    //         var scname = showContactDom.attr('data-city-name');
    //         var oneLevelId = showContactDom.attr('data-province-code');
    //         var twoLevelId = showContactDom.attr('data-city-code');
    //         var threeLevelId = showContactDom.attr('data-district-code');
    //         var iosSelect = new IosSelect(3, [iosProvinces, iosCitys, iosCountys], {
    //           title: '',
    //           itemHeight: 35,
    //           relation: [1, 1],
    //           oneLevelId: oneLevelId,
    //           twoLevelId: twoLevelId,
    //           threeLevelId: threeLevelId,
    //           callback: function(selectOneObj, selectTwoObj, selectThreeObj) {
    //             $scope.park.areaid = selectThreeObj.id;
    //             showContactDom.attr('data-province-code', selectOneObj.id);
    //             showContactDom.attr('data-city-code', selectTwoObj.id);
    //             showContactDom.attr('data-district-code', selectThreeObj.id);
    //             $scope.seletadress = selectOneObj.name + ' ' + selectTwoObj.name + ' ' + selectThreeObj.name;
    //             //showContactDom.html(selectOneObj.name + ' ' + selectTwoObj.name + ' ' + selectThreeObj.name);
    //             $scope.park.address = selectOneObj.name + selectTwoObj.name + selectThreeObj.name;
    //             getcode(selectThreeObj.name);
    //           }
    //         });
    //       });
    //     }
    //   }).catch(function(err) {
    //     console.log(err);
    //   })

    function getcode(address) { //获取区域编码和归属区域id
      var address = address;
      $http({
        method: 'GET',
        url: 'http://restapi.amap.com/v3/config/district?key=584fc05ea7947a80f6437654e771c7e0&keywords=' + address + '&subdistrict=0'
      }).then(function successCallback(response) {
        if (response.data.districts.length > 0) {
          // $scope.park.code = 1143222;
          $scope.compeny.code = response.data.districts[0].adcode;
        }
      }, function errorCallback(response) {
        // 请求失败执行代码
      });
    }

    $scope.subPark = function() { //提交停车场信息
      if (!$scope.park.name) {
        $scope.hintText = '停车场名称不能为空';
        $scope.hintShow = true;
      } else if ($scope.parkloc == '停车场经纬度(必填)' || !$scope.parkloc) {
        $scope.hintText = '经纬度不能为空';
        $scope.hintShow = true;
      } else if (!$scope.park.phone) {
        $scope.hintText = '电话不能为空';
        $scope.hintShow = true;
      } else if (!$scope.park.email) {
        $scope.hintText = '邮箱不能为空';
        $scope.hintShow = true;
      } else if (!$scope.park.areaid) {
        $scope.hintText = '地址不能为空';
        $scope.hintShow = true;
      } else if (!$scope.detail.address) {
        $scope.hintText = '具体位置不能为空';
        $scope.hintShow = true;
      } else {
        $scope.park.address = $scope.park.address + $scope.detail.address;
        let pointArray = $scope.parkloc.split(',');
        $scope.park.parkloc = 'POINT(' + Number(pointArray[0]) + ' ' + Number(pointArray[1]) + ')';
        for (i in $scope.park) {
          if (!$scope.park[i]) {
            $scope.park[i] = 0;
          }
        };
        if ($stateParams.parkType === 'add') { //添加停车场
          getDataService.hasHeaderRequest('post', 'post/parkfee/offices', $scope.park)
            .then(function(data) {
              if (data.status == 101) {
                $state.go('parkMan');
              } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                $state.go('login')
              } else {
                $scope.hintText = data.message;
                $scope.hintShow = true;
                hintHide();
              }
            }).catch(function(err) {
              if (err.status == 103) {
                $scope.hintText = err.message;
                $scope.hintShow = true;
              };
              hintHide();
            })
        } else { //修改停车场
          getDataService.hasHeaderRequest('post', 'put/parkfee/offices', $scope.park)
            .then(function(data) {
              if (data.status == 101) {
                $state.go('parkMan');
              } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                $state.go('login')
              } else {
                $scope.hintText = data.message;
                $scope.hintShow = true;
                hintHide();
              }
            }).catch(function(err) {
              if (err.status == 103) {
                $scope.hintText = err.message;
                $scope.hintShow = true;
              };
              hintHide();
            })
        }
      }
      hintHide();
    }

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('carportManCtrl', function($scope, $timeout, $state, getDataService) { //车位管理
    $scope.carports = []; //公司信息
    $scope.hintText = ''; //提示框文本
    $scope.hintShow = false;

    $scope.searchCon = { searchName: '' }; //搜索条件
    $scope.manageSearchBtn = false;
    $scope.inSearch = function() { //搜索框获取焦点
      $scope.manageSearchBtn = true;
    };
    $scope.outSearch = function() { //搜索框失去焦点
      $scope.manageSearchBtn = false;
    };
    $scope.search = function() { //搜索车位
      getDataService.hasHeaderRequest('post', 'get/search', $scope.searchCon)
        .then(function(data) {
          if (data.status == 102) {
            $scope.carports = data.data;
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide()
          }
        }).catch(function(err) {
          $scope.hintText = err.message;
          $scope.hintShow = true;
          hintHide()
        })
    };
    getDataService.hasHeaderRequest('get', 'get/offices/parentid')
      .then(function(data) {
        if (data.status == 102) {
          $scope.carports = data.data;
        } else if (data.status == 401 || data.status == 402 || data.status == 403) {
          $state.go('login')
        } else if (data.status == 101) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        }
      }).catch(function(err) {
        $scope.hintText = err.message;
        $scope.hintShow = true;
        hintHide();
      })

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('addCarportCtrl', function($scope, $stateParams, $ionicPopup, $ionicPopover, $rootScope, $state, $http, $ionicActionSheet, $timeout, $cordovaImagePicker, $cordovaCamera, getDataService) { //添加车位、车位信息
    $scope.carport = {}; //车位信息

    $scope.deletConditions = { stakeid: '', id: '' }; //删除车位时需要的参数
    $scope.carportHeight = 1.72;
    $scope.deedLiHeight = 1.72;
    $scope.carportImgs = []; //车位照片
    $scope.deedImgs = []; //产权证照片
    $scope.carportShow = true;
    $scope.deedShow = true;
    $scope.cpImgs = { img1: '', img2: '' }; //用来判断图片是否修改

    $scope.hintShow = false;
    if ($stateParams.carportType === 'add') { //添加车位
      $scope.add = true;
      $scope.carportTitle = '添加车位';
      $scope.valid = '是';
      $scope.OwnType = '选择所属类型(必选)';
      $scope.selectStartTime = '选择开始时间';
      $scope.selectEndTime = '选择结束时间';
      $scope.carport.owntype = '';
      $scope.carport.slotid = '';
      $scope.carport.parkid = '';
      $scope.carport.chgdiscount = '';
      $scope.carport.chgfloor = '';
      $scope.carport.validity = true;
      $scope.carport.slotpic = '';
      $scope.carport.propertypic = '';
      $scope.carport.routepic1 = '';
      $scope.carport.daystart = '';
      $scope.carport.dayend = '';
      $scope.carport.timestart = '';
      $scope.carport.timeend = '';
      $scope.carport.freetime = '';
      $scope.carport.basetime = '';
      $scope.carport.basefee = '';
      $scope.carport.normalfee = '';
      $scope.carport.totallimit = '';
      $scope.carport.feefloor = '';
    } else { //车位信息
      $scope.add = false;
      $scope.carportTitle = '车位信息';
      getDataService.hasHeaderRequest('post', 'get/offices/id', { id: $stateParams.carportId })
        .then(function(data) {
          if (data.status == 102) {
            var result = data.data.pspf[0];
            if (result.validity) {
              $scope.valid = '是';
            } else {
              $scope.valid = '否';
            };
            if (result.owntype == 1) {
              $scope.OwnType = '购买持有';
            } else {
              $scope.OwnType = '租赁持有';
            };
            $scope.selectStartTime = result.daystart.substring(0, 10) + ' ' + result.timestart.substring(0, 5);
            $scope.selectEndTime = result.dayend.substring(0, 10) + ' ' + result.timeend.substring(0, 5);
            $scope.carport.owntype = result.owntype;
            $scope.carport.slotid = result.slotid;
            $scope.carport.id = result.id;
            $scope.carport.parkid = result.parkid;
            $scope.carport.chgdiscount = result.chgdiscount;
            $scope.carport.chgfloor = result.chgfloor;
            $scope.carport.validity = result.validity;
            $scope.carport.slotpic = result.slotpic;
            $scope.carport.propertypic = result.propertypic;
            $scope.carport.routepic1 = '';
            $scope.carport.daystart = result.daystart;
            $scope.carport.dayend = result.dayend;
            $scope.carport.timestart = result.timestart;
            $scope.carport.timeend = result.timeend;
            $scope.carport.freetime = result.freetime;
            $scope.carport.basetime = result.basetime;
            $scope.carport.basefee = result.basefee;
            $scope.carport.normalfee = result.normalfee;
            $scope.carport.totallimit = result.totallimit;
            $scope.carport.feefloor = result.feefloor;
            if (result.slotpic) {
              $scope.cpImgs.img1 = result.slotpic;
              $scope.carportImgs.push(result.slotpic); //车位照片
              $scope.carportShow = false;
            };
            if (result.propertypic) {
              $scope.cpImgs.img2 = result.propertypic;
              $scope.deedImgs.push(result.propertypic); //产权证照片           
              $scope.deedShow = false;
            };
            $scope.deletConditions.stakeid = result.stakeid;
            $scope.deletConditions.id = result.id;
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(err) {
          if (err.status == 103) {
            $scope.hintText = err.message;
            $scope.hintShow = true;
          };
          hintHide();
        })
    }

    const calendarStart = new lCalendar(); //选择开始时间
    const calendarEnd = new lCalendar(); //选择结束时间
    calendarStart.init({
      'trigger': '#carportStartTime',
      'type': 'datetime'
    });
    calendarEnd.init({
      'trigger': '#carportEndTime',
      'type': 'datetime'
    });

    $scope.owntypes = [
      { id: 1, name: '购买持有' },
      { id: 2, name: '租赁持有' }
    ];
    $scope.OwnTypePopover = $ionicPopover.fromTemplateUrl('ownTypePopover', { //选择类型
      scope: $scope
    }).then(function(popop) {
      $scope.OwnTypePopover = popop;
    });
    $scope.choiceOwntype = function(event) { //打开选择框
      $scope.OwnTypePopover.show(event);
    };
    $scope.closeOwntype = function() { //关闭选择框 
      $scope.OwnTypePopover.hide();
    };
    $scope.sureOwntype = function(option) { //确认选择框
      $scope.carport.owntype = option.id;
      $scope.OwnType = option.name;
      $scope.OwnTypePopover.hide();
    };
    $scope.valids = [
      { id: true, name: '是' },
      { id: false, name: '否' }
    ];
    $scope.popover = $ionicPopover.fromTemplateUrl('popover', { //选择支付类型
      scope: $scope
    }).then(function(popop) {
      $scope.popover = popop;
    });
    $scope.choicecan = function(event) { //打开选择框
      $scope.popover.show(event);
    };
    $scope.closecan = function() { //关闭选择框 
      $scope.popover.hide();
    };
    $scope.surecan = function(option) { //确认选择框
      $scope.carport.validity = option.id;
      $scope.valid = option.name;
      $scope.popover.hide();
    };
    $scope.$on('$destroy', function() { // 清除浮动框
      $scope.OwnTypePopover.remove();
      $scope.popover.remove();
    });

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
                if (delt == 'carport') {
                  $scope.carportImgs.splice(0, $scope.carportImgs.length);
                  $scope.carportImgs.push(imageData);
                  $scope.carportShow = false;
                  carportH();
                } else if (delt == 'deed') {
                  $scope.deedImgs.splice(0, $scope.deedImgs.length);
                  $scope.deedImgs.push(imageData);
                  $scope.deedShow = false;
                  deedH();
                };
              }, function(err) {
                console.log(err);
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
                  if (delt == 'carport') {
                    $scope.carportImgs = $scope.carportImgs.concat(results);
                    $scope.carportShow = false;
                    carportH();
                  } else if (delt == 'deed') {
                    $scope.deedImgs = $scope.deedImgs.concat(results);
                    $scope.deedShow = false;
                    deedH();
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
      if (delt == 'carport') {
        $scope.carportImgs.splice(index, 1);
        $scope.carportShow = true;
        carportH();
      } else if (delt == 'deed') {
        $scope.deedImgs.splice(index, 1);
        $scope.deedShow = true;
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
      if (delt == 'carport') {
        $scope.Bimg = $scope.carportImgs[index];
      } else if (delt == 'deed') {
        $scope.Bimg = $scope.deedImgs[index];
      };
    };
    $scope.closebigimg = function() {
      $scope.bigimg.hide();
    };
    // 清除浮动框
    $scope.$on('$destroy', function() {
      $scope.bigimg.remove();
    });

    function carportH() { //车位照高度变化
      let arrLgh = $scope.carportImgs.length;
      if (arrLgh > 2) {
        $scope.carportHeight = Math.ceil((arrLgh + 1) / 3) * 1.35 + 0.43;
      } else {
        $scope.carportHeight = 1.72;
      };
    };

    function deedH() { //产权证照高度变化
      let arrLgh = $scope.deedImgs.length;
      if (arrLgh > 2) {
        $scope.deedLiHeight = Math.ceil((arrLgh + 1) / 3) * 1.35 + 0.43;
      } else {
        $scope.deedLiHeight = 1.72;
      };
    };

    function uploadImg(imgs, code, mId) { //上传图片
      document.addEventListener("deviceready", function() {
        var ft = new FileTransfer();
        if (imgs.length > 0) {
          for (var i = 0; i < imgs.length; i++) {
            var options = new FileUploadOptions();
            var imgurl = decodeURIComponent(imgs[i]);
            options.fileKey = "file";
            options.fileName = imgurl.substr(imgurl.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg"; //文件样式
            options.params = { id: mId, code: code };
            options.headers = { 'x-access-token': localStorage.getItem('access-token') };
            ft.upload(imgurl, $rootScope.baseUrl + '/v1/mg/put/pf/parkslots/pic', win, fail, options, true);
          };
        }
      }, false);
    };

    function win(r) {
      var response = JSON.parse(r.response);
      if (response.status == 101) {
        $state.go('carportMan');
      } else {
        $scope.hintText = '图片未保存';
        $scope.hintShow = true;
        hintHide();
      }
    };

    function fail(error) {
      $scope.hintText = '图片上传失败';
      $scope.hintShow = true;
      hintHide();
    };

    $scope.subCarport = function() { //提交车位信息
      var nowTime = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''); //当前系统时间
      var startTime = document.getElementById('carportStartTime').value;
      var endTime = document.getElementById('carportEndTime').value;
      if (startTime) { //开始天、开始时间
        $scope.carport.daystart = startTime.split(' ')[0];
        $scope.carport.timestart = startTime.split(' ')[1];
      } else {
        $scope.carport.daystart = nowTime.split(' ')[0];
        $scope.carport.timestart = nowTime.split(' ')[1].substring(0, 5);
      };
      if (endTime) { //结束天、结束时间
        $scope.carport.dayend = endTime.split(' ')[0];
        $scope.carport.timeend = endTime.split(' ')[1];
      } else {
        $scope.carport.dayend = nowTime.split(' ')[0];
        $scope.carport.timeend = nowTime.split(' ')[1].substring(0, 5);
      };
      if ($scope.carport.owntype === '') {
        $scope.hintText = '车位所属类型不能为空';
        $scope.hintShow = true;
      } else if (!$scope.carport.slotid) {
        $scope.hintText = '车位编号不能为空';
        $scope.hintShow = true;
      } else {
        for (i in $scope.carport) {
          if (!$scope.carport[i]) {
            $scope.carport[i] = 0;
          }
        };
        if ($stateParams.carportType === 'add') {
          getDataService.hasHeaderRequest('post', 'post/pf/parkslots', $scope.carport)
            .then(function(data) {
              if (data.status == 101) {
                if (($scope.cpImgs.img1 != $scope.carportImgs[0] && $scope.carportImgs[0] != undefined) || ($scope.cpImgs.img2 != $scope.deedImgs[0] && $scope.deedImgs[0] != undefined)) {
                  if ($scope.cpImgs.img1 != $scope.carportImgs[0] && $scope.carportImgs[0] != undefined) {
                    uploadImg($scope.carportImgs, '001', data.id);
                  };
                  if ($scope.cpImgs.img2 != $scope.deedImgs[0] && $scope.deedImgs[0] != undefined) {
                    uploadImg($scope.deedImgs, '002', data.id);
                  }
                } else {
                  $state.go('carportMan');
                };
              } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                $state.go('login')
              } else {
                $scope.hintText = data.message;
                $scope.hintShow = true;
                hintHide();
              }
            }).catch(function(err) {
              if (err.status == 103) {
                $scope.hintText = err.message;
                $scope.hintShow = true;
              };
              hintHide();
            })
        } else {
          getDataService.hasHeaderRequest('post', 'put/pf/parkslots', $scope.carport)
            .then(function(data) {
              if (data.status == 101) {
                if(($scope.cpImgs.img1 != $scope.carportImgs[0] && $scope.carportImgs[0] != undefined)||($scope.cpImgs.img2 != $scope.deedImgs[0] && $scope.deedImgs[0] != undefined)) {
                  if ($scope.cpImgs.img1 != $scope.carportImgs[0] && $scope.carportImgs[0] != undefined) {
                    uploadImg($scope.carportImgs, '001', $scope.carport.id);
                  };
                  if ($scope.cpImgs.img2 != $scope.deedImgs[0] && $scope.deedImgs[0] != undefined) {
                    uploadImg($scope.deedImgs, '002', $scope.carport.id);
                  }
                } else {
                  $state.go('carportMan');
                };
              } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                $state.go('login')
              } else {
                $scope.hintText = data.message;
                $scope.hintShow = true;
                hintHide();
              }
            }).catch(function(err) {
              if (err.status == 103) {
                $scope.hintText = err.message;
                $scope.hintShow = true;
              };
              hintHide();
            })
        }
      };
      hintHide();
    };

    $scope.deletCarport = function() { //删除车位
      $ionicPopup.confirm({
        cssClass: 'goOut',
        template: "<div>确定删除该停车场？</div>",
        buttons: [{
            text: "取消"
          },
          {
            text: '确定',
            onTap: function(e) {
              getDataService.hasHeaderRequest('post', 'destroy/pf/parkslots', $scope.deletConditions)
                .then(function(data) {
                  if (data.status == 101) {
                    $state.go('carportMan');
                  } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                    $state.go('login')
                  } else {
                    $scope.hintText = data.message;
                    $scope.hintShow = true;
                    hintHide();
                  }
                }).catch(function(err) {
                  if (err.status == 103) {
                    $scope.hintText = err.message;
                    $scope.hintShow = true;
                  };
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
  .controller('chargManCtrl', function($scope, $timeout, $state, getDataService) { //充电桩管理
    $scope.charges = []; //公司信息
    $scope.hintText = ''; //提示框文本
    $scope.hintShow = false;

    $scope.searchCon = { searchName: '' }; //搜索条件
    $scope.manageSearchBtn = false;
    $scope.inSearch = function() { //搜索框获取焦点
      $scope.manageSearchBtn = true;
    };
    $scope.outSearch = function() { //搜索框失去焦点
      $scope.manageSearchBtn = false;
    };
    $scope.search = function() { //搜索车位
      getDataService.hasHeaderRequest('post', 'get/search', $scope.searchCon)
        .then(function(data) {
          if (data.status == 102) {
            $scope.charges = data.data;
          } else if (data.status == 401 || data.status == 402 || data.status == 403) {
            $state.go('login')
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(err) {
          $scope.hintText = err.message;
          $scope.hintShow = true;
          hintHide();
        })
    };

    getDataService.hasHeaderRequest('get', 'get/offices/parentid')
      .then(function(data) {
        if (data.status == 102) {
          $scope.charges = data.data;
          for (i in $scope.charges) { //充电类型
            if ($scope.charges[i].staketype == 1) {
              $scope.charges[i].stakType = '直流充电桩';
            } else if ($scope.charges[i].staketype == 2) {
              $scope.charges[i].stakType = '交流充电桩';
            } else {
              $scope.charges[i].stakType = '其他';
            }
          };
        } else if (data.status == 401 || data.status == 402 || data.status == 403) {
          $state.go('login')
        } else if (data.status == 101) {
          $scope.hintText = data.message;
          $scope.hintShow = true;
          hintHide();
        }
      }).catch(function(err) {
        $scope.hintText = err.message;
        $scope.hintShow = true;
        hintHide();
      })

    function hintHide() {
      $timeout(function() {
        $scope.hintShow = false;
      }, 1000);
    }
  })
  .controller('addChargCtrl', function($scope, $ionicPopup, $stateParams, $ionicPopover, $state, $http, $timeout, getDataService) { //添加充电桩、充电桩信息
    $scope.charg = { pslotid: '' }; //充电桩信息
    $scope.deletConditions = { id: '' }; //删除条件
    $scope.hintShow = false;
    $scope.has = false;
    if ($stateParams.chargeType === 'add') { //添加车位
      $scope.add = true;
      $scope.chargTitle = '添加充电桩';
      $scope.stakeType = '充电桩类型(必选)';
      $scope.selectStartTime = '选择开始时间';
      $scope.selectEndTime = '选择结束时间';
      $scope.charg.slotid = '';
      $scope.charg.staketype = '';
      $scope.charg.stakename = '';
      $scope.charg.power = '';
      $scope.charg.start = '';
      $scope.charg.end = '';
      $scope.charg.servfee = '';
      $scope.charg.chgfee = '';
    } else { //车位信息
      $scope.add = false;
      $scope.chargTitle = '充电桩信息';
      getDataService.hasHeaderRequest('post', 'get/offices/id', { id: $stateParams.chargeId })
        .then(function(data) {
          var result = data.data[0];
          if (data.status == 102) {
            if (result.staketype == 0) {
              $scope.stakeType = '其它';
            } else if (result.staketype == 1) {
              $scope.stakeType = '直流充电桩';
            } else {
              $scope.stakeType = '交流充电桩';
            }
            $scope.selectStartTime = result.start;
            $scope.selectEndTime = result.end;
            $scope.charg.id = result.id;
            $scope.charg.slotid = result.slotid;
            $scope.charg.staketype = result.staketype;
            $scope.charg.power = result.power;
            $scope.charg.pslotid = result.pslotid;
            $scope.charg.start = result.start;
            $scope.charg.stakename = result.stakename;
            $scope.charg.end = result.end;
            $scope.charg.servfee = result.servfee;
            $scope.charg.chgfee = result.chgfee;
            $scope.deletConditions.id = result.id;
          } else {
            $scope.hintText = data.message;
            $scope.hintShow = true;
            hintHide();
          }
        }).catch(function(err) {
          if (err.status == 103) {
            $scope.hintText = err.message;
            $scope.hintShow = true;
          };
          hintHide();
        })
    };

    $scope.checkSlotid = function() { //验证车位
      if ($scope.charg.slotid) {
        getDataService.hasHeaderRequest('post', 'get/sc/scstake/ssid', { slotid: $scope.charg.slotid })
          .then(function(data) {
            if (data.status == 101) {
              $scope.charg.pslotid = data.pslotid;
            } else if (data.status == 401 || data.status == 402 || data.status == 403) {
              $state.go('login')
            } else {
              $scope.has = true;
              $scope.hintText = data.message;
              $scope.hintShow = true;
              hintHide();
            }
          }).catch(function(err) {
            $scope.hintText = err.message;
            $scope.hintShow = true;
            hintHide();
          })
      }
    }

    // const calendarStart = new lCalendar(); //选择开始时间
    // const calendarEnd = new lCalendar(); //选择结束时间
    // calendarStart.init({
    //   'trigger': '#carportStartTime',
    //   'type': 'datetime'
    // });
    // calendarEnd.init({
    //   'trigger': '#carportEndTime',
    //   'type': 'datetime'
    // });

    $scope.staketypes = [
      { id: 1, name: '直流充电桩' },
      { id: 2, name: '交流充电桩' },
      { id: 0, name: '其它' }
    ];
    $scope.OwnTypePopover = $ionicPopover.fromTemplateUrl('ownTypePopover', { //选择类型
      scope: $scope
    }).then(function(popop) {
      $scope.OwnTypePopover = popop;
    });
    $scope.choicestaketype = function(event) { //打开选择框
      $scope.OwnTypePopover.show(event);
    };
    $scope.closestaketype = function() { //关闭选择框 
      $scope.OwnTypePopover.hide();
    };
    $scope.surestaketype = function(option) { //确认选择框
      $scope.charg.staketype = option.id;
      $scope.stakeType = option.name;
      $scope.OwnTypePopover.hide();
    };

    $scope.subCarport = function() {
      var nowTime = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''); //当前系统时间
      $scope.charg.start = nowTime;
      $scope.charg.end = nowTime;
      // var startTime = document.getElementById('carportStartTime').value;
      // var endTime = document.getElementById('carportEndTime').value;
      // if (startTime) {
      //   $scope.charg.start = startTime;
      // } else {
      //   $scope.charg.start = nowTime;
      // };
      // if (endTime) {
      //   $scope.charg.end = endTime;
      // } else {
      //   $scope.charg.end = nowTime;
      // };
      if (!$scope.charg.slotid) {
        $scope.hintText = '车位编号不能为空';
        $scope.hintShow = true;
      } else if (!$scope.charg.staketype) {
        $scope.hintText = '充电类型不能为空';
        $scope.hintShow = true;
      } else if (!$scope.charg.power) {
        $scope.hintText = '充电功率不能为空';
        $scope.hintShow = true;
      } else {
        if (!$scope.has) {
          for (i in $scope.charg) {
            if (!$scope.charg[i]) {
              $scope.charg[i] = 0;
            }
          };
          if ($stateParams.chargeType === 'add') {
            getDataService.hasHeaderRequest('post', 'post/sc/scstake', $scope.charg)
              .then(function(data) {
                if (data.status == 101) {
                  $state.go('chargMan');
                } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                  $state.go('login')
                } else {
                  $scope.hintText = data.message;
                  $scope.hintShow = true;
                  hintHide();
                }
              }).catch(function(err) {
                if (err.status == 103) {
                  $scope.hintText = err.message;
                  $scope.hintShow = true;
                };
                hintHide();
              })
          } else {
            getDataService.hasHeaderRequest('post', 'put/sc/scstake', $scope.charg)
              .then(function(data) {
                if (data.status == 101) {
                  $state.go('chargMan');
                } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                  $state.go('login')
                } else {
                  $scope.hintText = data.message;
                  $scope.hintShow = true;
                  hintHide();
                }
              }).catch(function(err) {
                if (err.status == 103) {
                  $scope.hintText = err.message;
                  $scope.hintShow = true;
                };
                hintHide();
              })
          }
        } else {
          $scope.hintText = '该车位已被占用或不存在';
          $scope.hintShow = true;
          hintHide();
        };
      };
      hintHide();
    };

    $scope.deletCharg = function() { //删除充电桩
      $ionicPopup.confirm({
        cssClass: 'goOut',
        template: "<div>确定删除该充电桩？</div>",
        buttons: [{
            text: "取消"
          },
          {
            text: '确定',
            onTap: function(e) {
              getDataService.hasHeaderRequest('post', 'destroy/sc/scstake', $scope.deletConditions)
                .then(function(data) {
                  if (data.status == 101) {
                    $state.go('chargMan');
                  } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                    $state.go('login')
                  } else {
                    $scope.hintText = data.message;
                    $scope.hintShow = true;
                    hintHide();
                  }
                }).catch(function(err) {
                  $scope.hintText = err.message;
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
  .controller('mMySetCtrl', function($scope, getDataService, $state, $timeout, $rootScope, $ionicPopup, $stateParams, $cordovaImagePicker, $cordovaCamera, $ionicActionSheet) { //管理端我的设置
    $scope.userMess = JSON.parse(localStorage.getItem('userMessage')); //存储在本地的用户信息
    $scope.email = $scope.userMess.email;
    $scope.phone = $scope.userMess.phone;
    $scope.officename = $scope.userMess.officename;
    $scope.no = $scope.userMess.no;
    $scope.name = $scope.userMess.name;
    let loginName = $scope.userMess.mobile;
    if (loginName) {
      $scope.userName = loginName.substring(0, 3) + '****' + loginName.substring(7, 11);
    }
    if (!$scope.userMess.photo) {
      $scope.userPhoto = 'img/useravatar.png';
    } else {
      $scope.userPhoto = $scope.userMess.photo;
    };

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
                  if (data.status == 101) {
                    localStorage.removeItem('userMessage');
                    $state.go('login');
                  } else if (data.status == 401 || data.status == 402 || data.status == 403) {
                    $state.go('login')
                  } else {
                    $scope.hintText = data.message;
                    $scope.hintShow = true;
                    hintHide();
                  }
                }).catch(function(data) {
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
