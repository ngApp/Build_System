(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('d3', window.d3)
        .constant('api', 'http://localhost:8080');
})();
