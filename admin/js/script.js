var app = angular.module("myApp", ["ui.router","oc.lazyLoad"]);
app.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("", "/home");
    $stateProvider

    .state('home', {
        url: "/home",
        templateUrl: "pages/dashboard.html",
        data: {pageTitle: 'Ofresh | Dashboard'},
     //   controller: "GeneralController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'myApp',
                    files: [
                        
                        'js/demo/chart-area-demo.js',
                        'js/demo/chart-pie-demo.js'
                    ] 
               }]);
           }]
       }
    })
    .state('charts', {
        url: "/charts",
        templateUrl: "pages/Charts.html",
        data: {pageTitle: 'Ofresh | Charts'},
      //  controller: "chartController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
              //      name: 'myApp',
                    files: [
                        'vendor/chart.js/Chart.min.js',
                         'js/demo/chart-area-demo.js',
                         'js/demo/chart-pie-demo.js'
                    ] 
               }]);
           }]
       }
    })
    .state('viewitem', {
        url: "/viewitem",
        templateUrl: "pages/viewitem.html",
        data: {pageTitle: 'Ofresh | View Items'},
       controller: "viewController"
    })
    .state('additem', {
        url: "/additem",
        templateUrl: "/additem.html",
        data: {pageTitle: 'Ofresh | Add Item'},
        controller: "addItemController"
    })

    
}]);

app.controller('applicationController', function($scope,$ocLazyLoad) {
    $scope.toglDrpDwn=false;
   $scope.toggleDropDown=function(docId){
       if($scope.docId!=docId){
       if($scope.docId!=undefined){
        document.getElementById($scope.docId).nextSibling.nextSibling.style.display="none";
        $scope.toglDrpDwn=!$scope.toglDrpDwn;
        $scope.docId=docId;
       }
       else{
        $scope.docId=docId;
       }
    }
    $scope.toglDrpDwn=!$scope.toglDrpDwn;
    if($scope.toglDrpDwn){
        document.getElementById(docId).nextSibling.nextSibling.style.display="block";
    }
    else
    document.getElementById(docId).nextSibling.nextSibling.style.display="none";
   }
});

app.controller('addItemController', function($scope) {
  $scope.itemList=[];
  $scope.addItemObject=function(){
      var json={};
      json.itemname=$scope.formitemname;
      json.quantity=$scope.formquantity;
      json.fixprice=$scope.formfixprice;
      $scope.itemList.push(json);
      $scope.clearForm();
  }

  $scope.clearForm=function(){
    $scope.formitemname="";
    $scope.formfixprice="";

  }
  $scope.editItem=function(index){
    $scope.formitemname= $scope.itemList[index].itemname;
    $scope.formfixprice= $scope.itemList[index].fixprice;
    var item=$scope.itemList[index];
    $scope.itemList.splice($scope.itemList.indexOf(item),1);
  }
 $scope.deleteItem=function(index){
     var delitem=$scope.itemList[index]
     $scope.itemList.splice($scope.itemList.indexOf(delitem),1);
 }
 $scope.save=function(){
      var addItem=$scope.itemList.value;
    alert(addItem);
}
 
});


app.controller("viewController", function($scope) {
    $scope.records = [
    {       "id":1,
            "itemname":"chiken",
             "quantity":"100gm",
             "fixprice":"200kg"
        },
         {    "id":2,
             "itemname":"fish",
              "quantity":"200gm",
              "fixprice":"200kg"
          },
          {   "id":3,
              "itemname":"prawn",
              "quantity":"300gm",
              "fixprice":"200kg"
           },
          {   "id":4,
              "itemname":"leg piece",
              "quantity":"400gm",
              "fixprice":"200kg"
          },   
           {   "id":5,
               "itemname":"bonepiece",
               "quantity":"500gm",
               "fixprice":"200kg"
           },
           {   "id":5,
               "itemname":"bonepiece",
               "quantity":"500gm",
               "fixprice":"200kg"
           },
           {   "id":5,
               "itemname":"bonepiece",
               "quantity":"500gm",
               "fixprice":"200kg"
           },
           {   "id":5,
               "itemname":"bonepiece",
               "quantity":"500gm",
               "fixprice":"200kg"
           },         {   "id":5,
               "itemname":"bonepiece",
               "quantity":"500gm",
               "fixprice":"200kg"
           }
    ]
  });
  app.controller("alertCenter", function($scope) {
    $scope.alerts = [
        {
            "date":"December 12, 2019",
            "content":"A new monthly report is ready to download!"
        },
        {
            "date":"December 7, 2019",
            "content":"$290.29 has been deposited into your account!"
        },
        {
            "date":"December 2, 2019",
            "content":"Spending Alert: We've noticed unusually high spending for your account."
        }
    
    ]
  });
  app.controller("messageAlert" ,  function($scope){
      $scope.messages = [
          {
              "msgcontent":"Hi there! I am wondering if you can help me with a problem I've been having.",
              "person":"Emily Fowler · 58m",
               "image":"https://source.unsplash.com/fn_BT9fwg_E/60x60"
          },
          {
            "msgcontent":"I have the photos that you ordered last month, how would you like them sent to you?",
            "person":"Jae Chun · 1d",
            "image":"https://source.unsplash.com/AU4VPcFN4LE/60x60"
        },
        {
            "msgcontent":"Last month's report looks great, I am very happy with the progress so far, keep up the good work!",
            "person":"Morgan Alvarez · 2d",
             "image":"https://source.unsplash.com/CS2uCrpNzJY/60x60"
        },
        {
            "msgcontent":"Am I a good boy? The reason I ask is because someone told me that people say this to all dogs, even if they aren't good...",
            "person":"Chicken the Dog · 2w",
             "image":"https://source.unsplash.com/Mv9hjnEUHR4/60x60"
        }

      ]
  });
    // .when("/", {
    //     templateUrl : "pages/dashboard.html"
    // })
    // .when("/404", {
    //     templateUrl : "404.html"
    // })
    // .when("/blank", {
    //     templateUrl : "blank.htm"
    // })
    // .when("/blue", {
    //     templateUrl : "blue.htm"
    // });

