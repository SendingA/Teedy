// 'use strict';
//
// /**
//  * Audit log directive.
//  */
// angular.module('docs').directive('auditLog', function() {
//   return {
//     restrict: 'E',
//     templateUrl: 'partial/docs/directive.auditlog.html',
//     replace: true,
//     scope: {
//       logs: '='
//     }
//   }
// });


'use strict';

angular.module('docs').directive('auditLog', function($filter) {
  return {
    restrict: 'E',
    // templateUrl: 'partial/docs/directive.auditlog.html',
    replace: true,
    scope: {
      logs: '='
    },
    template: `
   <div>
  <input type="text" class="form-control input-sm" placeholder="搜索用户名、内容、操作类型..." ng-model="search" style="margin-bottom:10px;">

  <div ng-repeat="(username, data) in groupedLogs">
    <h4>
      <span class="fas fa-user"></span> {{ username }}
      <span class="badge">{{ data.filtered.length }}</span>
    </h4>
    <ul class="timeline">
      <li ng-repeat="log in data.filtered | orderBy:'-create_date' | limitTo: itemsPerPage : (data.currentPage - 1) * itemsPerPage">
        <span class="time text-muted">{{ log.create_date | date:'yyyy-MM-dd HH:mm:ss' }}</span>
        <div class="content">
<span class="label"
  ng-class="{
    'label-success': log.type === 'CREATE',
    'label-info': log.type === 'UPDATE',
    'label-danger': log.type === 'DELETE'
  }">
  {{ log.type }}
</span>

<strong>{{ log.username }}</strong>

<span translate="directive.auditlog.{{ log.class }}"></span>

<span ng-switch="log.type">
  <span ng-switch-when="CREATE">{{ 'directive.auditlog.log_created' | translate }}</span>
  <span ng-switch-when="UPDATE">{{ 'directive.auditlog.log_updated' | translate }}</span>
  <span ng-switch-when="DELETE">{{ 'directive.auditlog.log_deleted' | translate }}</span>
</span>

<!-- message 显示：默认前缀“：”，然后按 class 判断是否为链接 -->
<span ng-switch="log.class">
  <span ng-switch-when="Document">
    ：<a ng-href="#/document/view/{{ log.target }}">{{ log.message }}</a>
  </span>
  <span ng-switch-when="File">
    ：<a ng-if="log.message" ng-href="#/document/file/{{ log.target }}">{{ log.message }}</a>
    <a ng-if="!log.message" ng-href="#/document/file/{{ log.target }}">打开</a>
  </span>
  <span ng-switch-when="Comment">
    ：<a ng-href="#/document/view/{{ log.message }}">查看评论</a>
  </span>
  <span ng-switch-when="Acl">
    ：<span class="label label-default">{{ 'acl.' + log.message | translate }}</span>
  </span>
  <span ng-switch-when="Tag">
    ：<a ng-href="#/tag">{{ log.message }}</a>
  </span>
  <span ng-switch-when="User">
    ：<a ng-href="#/user/{{ log.message }}">{{ log.message }}</a>
  </span>
  <span ng-switch-when="Group">
    ：<a ng-href="#/group/{{ log.message }}">{{ log.message }}</a>
  </span>
  <span ng-switch-when="RouteModel">
    ：<a ng-href="#/settings/workflow/edit/{{ log.target }}">{{ log.message }}</a>
  </span>
  <span ng-switch-when="Route">
    ：<a ng-href="#/document/view/{{ log.message }}">查看</a>
  </span>
  <span ng-switch-default>
    ：{{ log.message }}
  </span>
</span>

        </div>
      </li>
    </ul>

    <!-- 分页控件 -->
    <div class="pagination-controls" ng-if="data.filtered.length > itemsPerPage">
      <button class="btn btn-default btn-sm"
              ng-disabled="data.currentPage === 1"
              ng-click="prevPage(username)">上一页</button>
      <span style="margin: 0 10px;">
        第 {{ data.currentPage }} 页 / 共 {{ totalPages(data.filtered.length) }} 页
      </span>
      <button class="btn btn-default btn-sm"
              ng-disabled="data.currentPage >= totalPages(data.filtered.length)"
              ng-click="nextPage(username)">下一页</button>
    </div>
    <hr>
  </div>
</div>

    `,
    link: function(scope) {
      scope.itemsPerPage = 5;

      // 分页函数
      scope.totalPages = function(totalItems) {
        return Math.ceil(totalItems / scope.itemsPerPage) || 1;
      };

      scope.prevPage = function(username) {
        if (scope.groupedLogs[username].currentPage > 1) {
          scope.groupedLogs[username].currentPage--;
        }
      };

      scope.nextPage = function(username) {
        const group = scope.groupedLogs[username];
        if (group.currentPage < scope.totalPages(group.filtered.length)) {
          group.currentPage++;
        }
      };

      scope.groupByUser = function(logs) {
        const grouped = {};
        angular.forEach(logs, function(log) {
          const username = log.username || '匿名用户';
          if (!grouped[username]) {
            grouped[username] = {
              filtered: [],
              currentPage: 1
            };
          }
          grouped[username].filtered.push(log);
        });
        return grouped;
      };

      scope.groupedLogs = {};

      scope.$watchGroup(['logs', 'search'], function() {
        const filteredLogs = $filter('filter')(scope.logs, scope.search);
        const newGrouped = scope.groupByUser(filteredLogs);

        // 维持每个分组的页码状态
        angular.forEach(newGrouped, function(group, username) {
          if (scope.groupedLogs[username]) {
            group.currentPage = scope.groupedLogs[username].currentPage || 1;
          }
        });

        scope.groupedLogs = newGrouped;
      });
    }
  };
});
