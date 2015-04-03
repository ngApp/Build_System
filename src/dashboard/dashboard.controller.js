(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [ 'logger', 'orderService', 'socketService', '$filter', '$scope', '$state'];

    /* @ngInject */
    function DashboardController(logger, orderService, socketService, $filter, $scope, $state) {
        var vm = this;

        vm.orders = null;
        vm.status = {
         "New": "Pending",
         "Placed": "Running",
         "Executed": "Completed"
        }
        vm.deleteAll = deleteAll;
        vm.go = go;
        vm.refresh = refresh;
        vm.submitBuild = submitBuild;
        vm.progressWidthPlaced = [];
        vm.progressWidthExecuted = [];
        vm.loadCanvas = function(quantity,totalQuantity,index,type){
            if(type == "quantityPlaced"){
                vm.progressWidthPlaced[index] = parseInt(quantity/totalQuantity * 100) + "%";
            }else{
                vm.progressWidthExecuted[index] = parseInt(quantity/totalQuantity * 100) + "%";
            }
        }

        setEvents();
        activate();

        function activate() {
            return getOrders().then(function() {
                logger.info('Activated Dashboard View');
            });
        }

        function deleteAll() {
            orderService.deleteAll();
            vm.progressWidthPlaced = [];
            vm.progressWidthExecuted = [];
        }

        function getOrders() {
            return orderService.getAll().then(function(data) {
                vm.orders = data.data;
                return vm.orders;
            });
        }

        function go(state) {
            $state.go(state);
        }

        function refresh() {
            getOrders();
            logger.info('Orders refreshed');
        }

        function setEvents() {

            angular.element('#tradeModal').on('hidden.bs.modal', clearTradeForm);

            socketService.remove();
            socketService.on('allOrdersDeletedEvent', allOrdersDeletedEvent);
            socketService.on('executionCreatedEvent', executionCreatedEvent);
            socketService.on('orderCreatedEvent', orderCreatedEvent);
            socketService.on('placementCreatedEvent', placementCreatedEvent);

            function allOrdersDeletedEvent() {
                vm.orders = [];
                logger.log('allOrdersDeletedEvent');
            }
            function clearTradeForm() {
                vm.qty = null;
                angular.element('input[name="qty"]').val(null);
            }
            function executionCreatedEvent(data) {

                var index = $filter('getIndexBy')('id', data.orderId, vm.orders),
                    item = vm.orders[index];

                item.quantityExecuted += data.quantityExecuted;
                item.executionPrice = data.executionPrice;
                item.status = data.status;

                $scope.$apply();
                var progressValue = parseInt(item.quantityExecuted/item.quantity * 100);
                $("#quantityExecuted"+index).find("#progress-bar").css("width", progressValue + "%")
                  .attr("aria-valuenow", progressValue)
                  .text(progressValue + "%");

                logger.log('executionCreatedEvent #' + data.orderId, data.quantityExecuted);
            }
            function orderCreatedEvent(data) {

                vm.orders.push(data);

                logger.log('orderCreatedEvent');
            }
            function placementCreatedEvent(data) {

                var index = $filter('getIndexBy')('id', data.orderId, vm.orders),
                    item = vm.orders[index];

                item.quantityPlaced += data.quantityPlaced;
                item.status = data.status;

                $scope.$apply();
                var progressValue = parseInt(item.quantityPlaced/item.quantity * 100);

                $("#quantityPlaced"+index).find("#progress-bar").css("width", progressValue + "%")
                  .attr("aria-valuenow", progressValue)
                  .text(progressValue + "%");
                logger.log('placementCreatedEvent #' + data.orderId, data.quantityPlaced);
            }

        }

        function submitBuild() {
            orderService.createOrder(vm.qty);
            angular.element('#tradeModal').modal('hide');
        }
    }
})();
