var app = angular.module('photoShare', ['ui.router']);

app.factory('posts', [function(){
  var postsObject = {
    posts: []
  }
  return postsObject;
}])

app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
  $scope.posts = posts.posts;

  $scope.addPost = function(){
    if(!$scope.title || $scope.title === ''){
      return;
    }
    if(!$scope.link || $scope.link === ''){
      return;
    }
    $scope.posts.push({title: $scope.title, link: $scope.link, likes: 0});
    $scope.title = '';
    $scope.link = '';
  };

  $scope.incrementLikes = function(post){
    post.likes += 1;
  };

}])