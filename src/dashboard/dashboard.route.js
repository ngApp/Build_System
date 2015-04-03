(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), '/');
    }

    function getStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    templateUrl: 'dashboard/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                }
            },
            {
                state: 'dashboard.table',
                config: {
                    url: '/',
                    templateUrl: 'dashboard/dashboard.table.html',
                    title: 'Dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard',
                        loginRequired: true
                    }
                }
            },
            {
                state: 'dashboard.chart',
                config: {
                    url: 'chart',
                    templateUrl: 'dashboard/dashboard.chart.html',
                    title: 'Chart',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-dashboard"></i> Chart',
                        loginRequired: true
                    }
                }
            }
        ];
    }
})();
