'use strict';

angular.module('docs').controller('SettingsRegisterRequest', function($scope, $http) {
    $scope.requests = [];

    // 加载所有注册请求
    $scope.loadRequests = function() {
        $http.get("../api/user/register_request/list").then(function(response) {
            $scope.requests = response.data.requests;  // ✅ 取数组
        }).catch(function() {
            alert("无法加载注册请求");
        });
    };

    // 批准请求
    $scope.approveRequest = function(id) {
        $http.post("../api/user/register_request/" + id + "/approve").then(function() {
            alert("已批准该请求");
            $scope.loadRequests();
        }).catch(function() {
            alert("批准失败");
        });
    };

    // 拒绝请求
    $scope.rejectRequest = function(id) {
        $http.post("../api/user/register_request/" + id + "/reject").then(function() {
            alert("已拒绝该请求");
            $scope.loadRequests();
        }).catch(function() {
            alert("拒绝失败");
        });
    };

    // 初始化加载
    $scope.loadRequests();
});
