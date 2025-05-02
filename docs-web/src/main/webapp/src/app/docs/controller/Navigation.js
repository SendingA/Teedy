'use strict';

/**
 * Navigation controller.
 */
angular.module('docs').controller('Navigation', function($scope, $state, $stateParams, $rootScope,$http, User) {
  User.userInfo().then(function(data) {
    $rootScope.userInfo = data;
    if (data.anonymous) {
      if($state.current.name !== 'login') {
        $state.go('login', {
          redirectState: $state.current.name,
          redirectParams: JSON.stringify($stateParams),
        }, {
          location: 'replace'
        });
      }
    }
  });

  /**
   * User logout.
   */
  $scope.logout = function($event) {
    User.logout().then(function() {
      User.userInfo(true).then(function(data) {
        $rootScope.userInfo = data;
      });
      $state.go('main');
    });
    $event.preventDefault();
  };


  // ✅ 添加这部分代码：
  $scope.registerRequest = {};

  $scope.openRegisterRequestModal = function () {
    console.log("打开注册弹窗");
    document.getElementById("registerRequestModal").style.display = "block";
  };

  $scope.closeRegisterRequestModal = function () {
    document.getElementById("registerRequestModal").style.display = "none";
  };

  $scope.submitRegisterRequest = function () {
    $http({
      method: "POST",
      url: "../api/user/register_request",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: $.param({
        username: $scope.registerRequest.username,
        email: $scope.registerRequest.email,
        message: $scope.registerRequest.message
      })
    }).then(function () {
      alert("注册请求已提交，等待管理员审批");
      $scope.closeRegisterRequestModal();
      $scope.registerRequest = {};
    }).catch(function () {
      alert("提交失败，请稍后再试");
    });
  };
});