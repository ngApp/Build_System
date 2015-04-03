// Usage
// <div data-at-barchart assets="vm.orders"></div>

(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('atBarchart', barchartDirective);

    barchartDirective.$inject = ['BarChart', '$window'];

    /* @ngInject */
    function barchartDirective(BarChart, $window) {

        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                chartdata: '='
            }
        };
        return directive;

        function link(scope, element) {
            var tableRowHeight = 37; // TODO: take out hard coding

            // initialize the chart
            var svgElement = element.html('<svg>').children()[0];
            var barChart = new BarChart(svgElement);
            barChart.barHeight(tableRowHeight);

            // Redraw whenever chartdata changes
            scope.$watch('chartdata', drawChart, true);

            // Redraw whenever window resizes, adding some debounce
            angular.element($window).on('resize', $window._.debounce(resizeChart, 250));

            // Remove the redraw handler when the scope is destroyed
            // This prevents redrawing when the view containing the barchart is destroyed
            scope.$on('$destroy', function() {
                angular.element($window).off('resize', resizeChart);
            });

            function drawChart() {

                var chartdata = scope.chartdata;

                // This can happen when the server has not yet returned the chartdata
                if (!chartdata) { return; }

                barChart
                    .width(element.width())
                    .draw(chartdata);
            }

            function resizeChart() {

                barChart
                    .width(element.width())
                    .resize();
            }
        }
    }
})();
