// Filter a value from a collection for the specified Key.
// Usage:
//     $filter('getBy')('id', id, users);
//  => "Username"

(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('getBy', getBy);

    getBy.$inject = [];
    /* @ngInject */
    function getBy() {
        return function(keyFind, valueFind, collection) {
            var i = 0, len = collection.length;
            for (; i < len; i++) {
                if (collection[i][keyFind] === valueFind) {
                    return collection[i];
                }
            }
            return null;
        };
    }

})();
