/*
    The barchart factory simply returns a class called BarChart
    that is responsible for rendering the chart using D3. It knows
    nothing about AngularJS.
*/

(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('BarChart', barchartFactory);

    barchartFactory.$inject = ['d3'];

    /* @ngInject */
    function barchartFactory(d3) {

        function BarChart(svgElement) {
            this.base = d3.select(svgElement);

            this.margin = {top: 50, right: 100, bottom: 30, left: 20};
            this.axisMargin = 5;

            this.x = d3.scale.linear();

            this.y = d3.scale.ordinal();

            this.xAxis = d3.svg.axis()
                .scale(this.x)
                .orient('top')
                .ticks(3)
                .tickFormat(function(d) { return d + '%'; });

            // chart base
            this.base
                .attr('class', 'chart');

            // x-axis base
            this.xAxisBase = this.base.append('g')
                .attr('class', 'x axis');

            // plot base
            this.plotBase = this.base.append('g')
                .attr('class', 'plot')
                .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        }

        BarChart.prototype.width = function(newWidth) {
            this.w = newWidth;
            this.plotWidth = this.w - this.margin.left - this.margin.right;
            this.base.attr('width', this.w);
            this.x.range([0, this.plotWidth]);
            return this;
        };

        BarChart.prototype.barHeight = function(newBarHeight) {
            this.bh = newBarHeight;
            return this;
        };

        BarChart.prototype.draw = function(data) {
            // Compute y-dimensions based on bar height
            this.plotHeight = this.bh * data.length;
            this.h = this.plotHeight + this.margin.top + this.margin.bottom;
            this.base.attr('height', this.h);
            this.y.rangeBands([0, this.plotHeight], 0.05, 0);
            this.xAxisBase.attr(
                'transform',
                'translate(' + (this.margin.left * 2) + ',' + (this.margin.top - this.axisMargin) + ')'
            );

            // Set the domains for the scales from the supplied data
            this.x.domain([0, 100]);
            this.y.domain(data.map(function(d) { return d.quantity; }));

            // Create the 'update selection' by selecting the bars and joining with data.
            // Update selection contains the DOM elements that were successfully bound to data
            // plus references to enter and exit selections.
            this.updateSelection = this.plotBase.selectAll('.bar')
                .data(data);

            // Remove the exiting bars (this is the 'exit selection')
            this.updateSelection.exit()
                .remove();

            // Get the 'enter selection'
            // Contains placeholder DOM nodes for each data element that was not bound
            var enterSelection = this.updateSelection.enter();

            // Add a group for each entering element - these are the entering bars
            var barsEnter = enterSelection
                .append('g')
                .attr('class', 'bar')
                .attr('x', 0);

            var self = this;

            if (data.length === 0 && this.plotBase.select('text.no_order')[0][0] === null) {

                this.plotBase
                    .append('text')
                    .attr({
                        'class': 'no_order',
                        'x': this.plotWidth / 2,
                        'y': this.margin.top / 2
                    })
                    .text('No orders available');

            } else if (data.length > 0) {
                this.plotBase.select('text.no_order').remove();
            }

            barsEnter
                .append('text')
                .attr({
                    'x': this.margin.left / 2,
                    'y': function(d) { return self.y(d.quantity) + self.y.rangeBand() / 2; },
                    'style': 'text-anchor: end'
                })
                .text(function(d) { return d.id; });
            barsEnter
                .append('rect')
                .attr({
                    'class': 'qty',
                    'x': this.margin.left,
                    'y': function(d) { return self.y(d.quantity); },
                    'height': this.y.rangeBand()
                });
            barsEnter
                .append('rect')
                .attr({
                    'class': 'qty_placed',
                    'x': this.margin.left,
                    'y': function(d) { return self.y(d.quantity); },
                    'height': this.y.rangeBand()
                });
            barsEnter
                .append('rect')
                .attr({
                    'class': 'qty_executed',
                    'x': this.margin.left,
                    'y': function(d) { return self.y(d.quantity); },
                    'height': this.y.rangeBand()
                });
            barsEnter
                .append('text')
                .attr({
                    'class': 'qty_text',
                    'y': function(d) { return self.y(d.quantity) + self.y.rangeBand() / 2; }
                })
                .text(function(d) { return d.quantity; });
            barsEnter
                .append('line')
                .attr({
                    'class': 'qty_line',
                    'y1': function(d) { return self.y(d.quantity) + self.y.rangeBand(); },
                    'y2': function(d) { return self.y(d.quantity) + self.y.rangeBand(); }
                });

            this.resize();
        };

        BarChart.prototype.getMaxScale = function(d) {
            return d3.scale.linear()
                .domain([0, d])
                .range([0, this.plotWidth]);
        };

        BarChart.prototype.resize = function() {
            var self = this;

            this.plotBase
                .select('text.no_order')
                .attr('x', function() { return self.margin.left + (self.plotWidth / 2) - (this.getBBox().width / 2); });

            // Draw the axes
            this.xAxisBase.call(this.xAxis);

            // Draw the bars
            this.updateSelection.select('rect.qty')
                .attr('width', self.plotWidth);

            this.updateSelection.select('rect.qty_placed')
                .attr('width', function(d) { return self.getMaxScale(d.quantity)(d.quantityPlaced);});

            this.updateSelection.select('rect.qty_executed')
                .attr('width', function(d) { return self.getMaxScale(d.quantity)(d.quantityExecuted);});

            this.updateSelection.select('text.qty_text')
                .attr('x', this.plotWidth + this.margin.right);

            this.updateSelection.select('line.qty_line')
                .attr({
                    'x1': this.plotWidth + this.margin.left,
                    'x2': this.plotWidth + this.margin.right
                });
        };

        return BarChart;
    }
})();
