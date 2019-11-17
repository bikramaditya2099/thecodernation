var app = angular.module('codernation', ['ngRoute','ui.bootstrap']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl : "/user/login.html"
    })
    .when("/dashboard", {
      templateUrl : "/user/dashboard.html"
    })
    .when("/register", {
        templateUrl : "/user/register.html"
      })
      .when("/error", {
        templateUrl : "/500.html"
      })
      .when("/login", {
        templateUrl : "/user/login.html"
      })
   
  });
app.service('urlService', function() {
    this.host = function () {
      return "https://myzkdddw4f.execute-api.us-west-2.amazonaws.com/dev/";
    }
    this.registerUrl=function(){
        return "register";
    }

    this.loginUrl=function(){
        return "authenticate";
    }
    this.userDetails=function(){
        return "getuserdetails";
    }

  });
  app.controller('Nav', function($scope) {
});

app.factory('userService',['$rootScope',function($rootScope){
    var user = {};
    return {
  
    getToken : function () {
      return user.token;
    },
  
    setToken : function (token) {
      user.token = token;
    }
  
  }
  }]);

  app.controller('userController', function($rootScope,$scope,$http,urlService,$uibModal,userService,$window) {

    require(['c3', 'jquery'], function(c3, $) {
        $(document).ready(function(){
          var chart = c3.generate({
            bindto: '#chart-donut', // id of chart wrapper
            data: {
              columns: [
                  // each columns data
                ['data1', 80],
                ['data2', 20]
              ],
              type: 'donut', // default type of chart
              colors: {
                'data1': tabler.colors["blue-darker"],
                'data2': tabler.colors["blue-light"]
              },
              names: {
                  // name of each serie
                'data1': 'Present',
                'data2': 'Absent'
              }
            },
            axis: {
            },
            legend: {
                      show: false, //hide legend
            },
            padding: {
              bottom: 0,
              top: 0
            },
          });
        });
      });

      require(['c3', 'jquery'], function(c3, $) {
        $(document).ready(function(){
          var chart = c3.generate({
            bindto: '#chart-pie', // id of chart wrapper
            data: {
              columns: [
                  // each columns data
                ['data1', 60],
                ['data2', 20],
                ['data3', 10],
                ['data4', 10]
              ],
              type: 'pie', // default type of chart
              colors: {
                'data1': tabler.colors["blue-darker"],
                'data2': tabler.colors["blue"],
                'data3': tabler.colors["blue-light"],
                'data4': tabler.colors["blue-lighter"]
              },
              names: {
                  // name of each serie
                'data1': 'Python',
                'data2': 'Groovy On Grails',
                'data3': 'Oracle',
                'data4': 'Jenkins'
              }
            },
            axis: {
            },
            legend: {
                      show: false, //hide legend
            },
            padding: {
              bottom: 0,
              top: 0
            },
          });
        });
      });

    console.log(sessionStorage.token);
   if(sessionStorage.token==undefined || sessionStorage.token=="undefined"){
    $window.location.href ="/user/";
   }
   else{
    var requrl=urlService.host()+urlService.userDetails();
    var token=JSON.parse(sessionStorage.token);
    $http({
        url: requrl,
        method: "GET",
        headers: {
            'token': 'Bearer ' +token.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
       if(response.data.status!="FAIL"){
       $scope.userDetails=response.data;
       console.log($scope.userDetails);
        }
    }, 
    function(response) { // optional
           console.log(response);
           $window.location.href="#!error";
    });
   }

  
    $scope.logout=function(){
    sessionStorage.token=undefined;
    $window.location.href="/user/";
   }

});  

app.controller('loginController', function($scope,$http,urlService,$uibModal,userService,$window) {
    $("#spinner").hide();
    $scope.formmodel={};
    $scope.validuser=true;
    $scope.signIn=function(){
        $("#spinner").show();
    $scope.validuser=true;
    var json={};
    json.username=$scope.formmodel.username;
    json.password=$scope.formmodel.password;
    var requrl=urlService.host()+urlService.loginUrl();
    $http({
        url: requrl,
        method: "POST",
        data: json
    })
    .then(function(response) {
        $("#spinner").hide();
        if(response.data.status!="FAIL"){
            $scope.validuser=true;
        userService.setToken(response.data);
        sessionStorage.token=JSON.stringify(response.data);
           console.log(response);
           $window.location.href = "#!dashboard";
        }
        else{
            $scope.validuser=false;
        }
    }, 
    function(response) { // optional
        $("#spinner").hide();
           console.log(response);
           $window.location.href="#!error";
    });


}

});   
app.controller('registrationController', function($scope,$http,urlService,$uibModal) {
  
        $("#spinner").hide();
  
   
  $scope.createAccount=function(){
    
    $scope.json={};
    $scope.json.fname=$scope.fname;
    $scope.json.mname=$scope.mname;
    $scope.json.lname=$scope.lname;
    $scope.json.email=$scope.email;
    $scope.json.phoneNumber=$scope.phoneNumber;
    $scope.json.password=$scope.password;
    console.log(JSON.stringify($scope.json));
    var requrl=urlService.host()+urlService.registerUrl();
    $http({
        url: requrl,
        method: "POST",
        data: $scope.json
    })
    .then(function(response) {
        $scope.showModal();
        
           console.log(response);
    }, 
    function(response) { // optional
           console.log(response);
    });
  }

  $scope.name = 'Hurrey!! Your Registration is Complete';
      
      $scope.showModal = function() {

        
        $scope.opts = {
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        templateUrl : 'reg_succ_modal.html',
        controller : ModalInstanceCtrl,
        resolve: {} // empty storage
          };
          
        
        $scope.opts.resolve.item = function() {
            return angular.copy({name:$scope.name}); // pass name to Dialog
        }
        
          var modalInstance = $uibModal.open($scope.opts);
          
          modalInstance.result.then(function(){
            //on ok button press 
          },function(){
            //on cancel button press
            console.log("Modal Closed");
          });
       };   

});

var ModalInstanceCtrl = function($scope, $uibModalInstance, item,$window) {
    
    $scope.item = item;
   
     $scope.ok = function () {
       $uibModalInstance.close();
       $window.location.href = "/corner/pages/login";
     };
     
     $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}