$( document ).ready(function() {

    $("li").click(function(){
        $("li").css('background-color', 'white');
        $("li").css('color','black');
        $(this).css('background-color', 'rgb(247, 7, 25)');
        $(this).css('color', 'white');
  });
    $("#add_data_btn").click(function(){
        $("footer").css('position', 'relative');
    });
    $("#list_data_btn").click(function(){
        $("footer").css('position', 'fixed');
    });
    $(".edit_btn").click(function(){
        $("footer").css('position', 'relative');
    });
});

var recordCtrlApp = angular.module('RecordCtrlApp', []);
recordCtrlApp.controller('RecordCtrl', function($scope,$http) {
        // Historical data
        $scope.history = [];
        $scope.tab = false;
        $scope.edit = false;
        var key;

// default data loaded from json
        $http.get('angular.json').success(function(data){
            $scope.records = $scope.records || data;
        });

        // Total prices
    $scope.Totals = function () {
      var priceTotal = 0;
            var taxTotal = 0;
            // Loop through main records and calculate aggregate prices and taxes if include is true
      angular.forEach($scope.records, function (record) {
            if (record.include) {
          priceTotal += record.price;
                taxTotal += record.tax;
            }
      });
            // Return aggregate data
            return { price: priceTotal , tax: taxTotal };
    };
        // Delete data
        $scope.Delete = function (index) {
            // Remove first / oldest element from history if it reaches maximum capacity of 10 records
            if ($scope.history.length === 10)
                $scope.history.shift();
            // Add deleted record to historical records
            $scope.history.push($scope.records[index]);
            // Remove from main records (using index)
            $scope.records.splice(index, 1);
        };
        // Reset new data model
        $scope.Reset = function () {
            $scope.newState = '';
            $scope.newPrice = '';
            $scope.newTax = '';
        }
        $scope.Reset();
        // Add new data
        $scope.Add = function () {
            // Do nothing if no state is entered (blank)
            // console.log($scope.records)
            // console.log($scope.newState)
            if (!$scope.records.newState)
                return;
            // Add to main records
            $scope.records.push({
                state: $scope.records.newState,
                price: $scope.records.newPrice,
                tax: $scope.records.newTax,
                include: false
            });
            $scope.tab = false;
            // See $Scope.Reset...
            $scope.Reset();
        }
        // Undo action (delete)
        $scope.Undo = function () {
            // Add last / most recent historical record to the main records
            $scope.records.push($scope.history[ $scope.history.length - 1 ]);
            // Remove last / most recent historical record
            $scope.history.pop();
        }
        $scope.Edit = function (index) {
            $scope.tab = true;
            $scope.edit = true;
            key=index;
            $scope.records.newState = this.record.state;
            $scope.records.newPrice = this.record.price;
            $scope.records.newTax = this.record.tax;
            
        }
        $scope.Update = function () {
            $scope.edit = false;
            $scope.records[key].state = $scope.records.newState;
            $scope.records[key].price = $scope.records.newPrice;
            $scope.records[key].tax = $scope.records.newTax;
            $scope.Reset();
            $scope.tab = false;
        }
        $scope.Show = function () {
            $scope.tab = true;
            $scope.edit = false;
            $scope.records.newState = '';
            $scope.records.newPrice = '';
            $scope.records.newTax = '';
        }
        $scope.Hide = function () {
            $scope.tab = false;
            $scope.edit = false;
            $scope.records.newState = '';
            $scope.records.newPrice = '';
            $scope.records.newTax = '';
        }
  });

