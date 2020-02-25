$("#spinner").hide();
var app = angular.module("adminApp", ['ui.router','ui.bootstrap']);

app.service('urlService', function() {
    this.host = function () {
    return "https://myzkdddw4f.execute-api.us-west-2.amazonaws.com/dev/";
    //return "http://localhost:8081/";
    }
    this.adminLoginUrl=function(){
        return "adminlogin";
    }
    this.adminUserInfo=function(){
        return "getadminuser";
    }
    this.validateMFACode=function(){
        return "validateMFACode";
    }
    this.sendsms=function(){
        return "sendsms";
    }
    this.importUrl=function(){
        return "import";
    }
    this.getregisteredusers=function(){
        return "getregisteredusers";
    }
});

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl,adminToken){
        var fd = new FormData();
        fd.append('file', file);
        $http({
            url: uploadUrl,
            method: "POST",
            data: fd,
            headers: {'Content-Type': undefined,'token':adminToken}
      })
      .then(function(response) {
       return response;
      }, 
      function(response) { // optional
             console.log(response);
            // $window.location.href="#!error";
      });



        // $http.post(uploadUrl, fd, {
        //     transformRequest: angular.identity,
        //     headers: {'Content-Type': undefined,'token':adminToken}
        // })
        // .then(function(response){
        //     console.log(response);
        // })
        // .error(function(response){
        //     console.log(response)
        // });
    }
}]);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('/', {
        url: '/',
        templateUrl: 'login.html'
    })
    .state('homepage', {
        url: '/homepage',
        templateUrl: 'home.html'
    })
   
});



app.controller('loginController', function($scope,$http,urlService,$window) {
    $("#spinner").hide();
   $scope.loginValidated=false;
   $scope.loginError=false;
   $scope.form={};
   $scope.mfaError=false;
   $scope.showSMS=true;

   $scope.validateMFA=function(){
    $scope.mfaError=false;

    $("#spinner").show();
    var requrl="https://myzkdddw4f.execute-api.us-west-2.amazonaws.com/dev/"+urlService.validateMFACode();
    var json={};
    json.email=$scope.form.username;
    json.code=$scope.form.code;
    $http({
        url: requrl,
        method: "POST",
        data: json
  })
  .then(function(response) {
    $("#spinner").hide();
     if(response.data.status=="SUCCESS"){
         var userInfo={};
         userInfo.email=$scope.form.username;
         userInfo.adminToken=$scope.adminToken;
         sessionStorage.userInfo = JSON.stringify(userInfo);
        $window.location.href ="#!homepage";
        
      }
      else{
        $scope.mfaError=true;
      }
  }, 
  function(response) { // optional
    $("#spinner").hide();
         console.log(response);
        // $window.location.href="#!error";
  });
   }
$scope.validateLogin=function(){
    $scope.loginValidated=false;
   $scope.loginError=false;
    $("#spinner").show();
    var json={};
    json.username=$scope.form.username;
    json.password=$scope.form.password;

    var requrl=urlService.host()+urlService.adminLoginUrl();
    $http({
        url: requrl,
        method: "POST",
        data: json
  })
  .then(function(response) {
    $("#spinner").hide();
     if(response.data.status!="FAIL"){
        $scope.loginValidated=true;
        $scope.adminToken=response.data.data;
      }
      else{
        $scope.loginError=true;
      }
  }, 
  function(response) { // optional
    $("#spinner").hide();
         console.log(response);
        // $window.location.href="#!error";
  });
}
  });

  app.controller('adminController', function($scope,$http,urlService,$window,fileUpload) {
    $scope.showSMS=false;
    $scope.showEVENT=false;
    $scope.form={};
    $scope.activeSMS=function(){
        $scope.showEVENT=false;
        $scope.showSMS=true; 
    }
    $scope.exportExcel = function () {
        $("#tblCustomers").table2excel({
            filename: "Table.xls"
        });
    }
    $scope.activeEVENT=function(){
        $scope.showSMS=false; 
        $scope.showEVENT=true; 
        var requrl=urlService.host()+urlService.getregisteredusers();
        $http({
            url: requrl,
            method: "GET",
            headers: {
                'token': $scope.userInfo.adminToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
           if(response.data.status!="FAIL"){
           $scope.registeredUsers=response.data;
           console.log($scope.registeredUsers);
            }
        }, 
        function(response) { // optional
               console.log(response);
               $window.location.href="#!error";
        });
    }

    $scope.uploadFile = function(){
        $("#spinner").show();
        var file = $scope.form.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = urlService.host()+urlService.importUrl();
            var fd = new FormData();
            fd.append('file', file);
            $http({
                url: uploadUrl,
                method: "POST",
                data: fd,
                headers: {'Content-Type': undefined,'token': $scope.userInfo.adminToken}
          })
          .then(function(response) {
            $("#spinner").hide();
            $scope.form.numbers=response.data.data.toString();
          }, 
          function(response) { // optional
            $("#spinner").hide();
                 console.log(response);
                // $window.location.href="#!error";
          });
    };
    $scope.sendsms=function(){
        $("#spinner").show();
        var numbers=$scope.form.numbers;
        var result=numbers.split(",");
        var json={};
        json.numbers=result;
        json.text=$scope.form.smstext;
        json.senderId="SMSTST";
        var requrl=urlService.host()+urlService.sendsms();
    
        $http({
            url: requrl,
            method: "POST",
            headers: {
                'token': $scope.userInfo.adminToken
            },
            data:json
        })
        .then(function(response) {
            $("#spinner").hide();
            console.log(response);
            if(response.data.ErrorCode=="000"){
                alert("SMS Sent Successfully");
                $scope.form.numbers="";
                $scope.form.smstext="";

            }
        }, 
        function(response) { // optional
               console.log(response);
               $window.location.href="#!error";
        });

    }
    $scope.logout=function(){
        sessionStorage.userInfo="undefined";

        $window.location.href="/";
    }

    $scope.showAdminUsers=true;
    $scope.showAdmin=false;
    $scope.showAdminList=function(){
        $scope.showAdmin=true;
        $scope.showAdminUsers=false;
    }
$scope.createAdminPanel=function(){
    $scope.showAdmin=false;
        $scope.showAdminUsers=true;
}
if(sessionStorage.userInfo=="undefined")
$window.location.href="/";
    $scope.userInfo = JSON.parse(sessionStorage.userInfo);
    console.log($scope.userInfo);

    var requrl=urlService.host()+urlService.adminUserInfo();
    
    $http({
        url: requrl,
        method: "GET",
        headers: {
            'token': $scope.userInfo.adminToken,
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
});