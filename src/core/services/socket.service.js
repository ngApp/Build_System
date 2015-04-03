(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('socketService', socketService);

    socketService.$inject = ['$rootScope', 'api'];

    /* $ngInject */
    function socketService($rootScope, api) {

        var socket = window.io(api),
            service = {
                on: on,
                remove: removeSocket
            };

        return service;

        function on(eventName, callback) {
            socket.on(eventName, callback);
        }

        function removeSocket() {
            socket.removeAllListeners();
        }
    }

})();