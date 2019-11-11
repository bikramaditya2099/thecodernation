var app = angular.module('codernation', ['ngRoute','ui.bootstrap']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl : "/corner/pages/signin.html"
    })
    .when("/dashboard", {
      templateUrl : "/corner/index.html"
    })
   
  });
app.service('urlService', function() {
    this.host = function () {
      return "http://ec2-54-214-109-157.us-west-2.compute.amazonaws.com:8081/";
    }
    this.registerUrl=function(){
        return "register";
    }

    this.loginUrl=function(){
        return "authenticate";
    }
    this.userDetails=function(){
        return "getUserDetails";
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

   if(userService.getToken()==undefined){
    $window.location.href ="/corner/pages/login";
   }
   else{
    var requrl=urlService.host()+urlService.userDetails();
    var token=userService.getToken();
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
    });
   }

});  

app.controller('loginController', function($scope,$http,urlService,$uibModal,userService,$window) {
    $scope.formmodel={};
$scope.signIn=function(){
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
        if(response.data.status!="FAIL"){
        userService.setToken(response.data);
           console.log(response);
           $window.location.href = "#!dashboard";
        }
    }, 
    function(response) { // optional
           console.log(response);
    });


}

});   
app.controller('registrationController', function($scope,$http,urlService,$uibModal) {
  
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