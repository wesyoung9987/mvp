var app = angular.module('photoShare', ['ui.router']);

app.factory('posts', ['$http', function($http){
  var postsObject = {
    posts: []
  }

  postsObject.getAll = function(){
    return $http.get('/posts').success(function(data){
      angular.copy(data, postsObject.posts);
    });
  };

  postsObject.create = function(post){
    return $http.post('/posts', post).success(function(data){
      postsObject.posts.push(data);
    });
  };

  postsObject.like = function(post){
    return $http.put('/posts' + post._id + '/like')
      .success(function(data){
        post.likes += 1;
      });
  };

  postsObject.get = function(id){
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };

  postsObject.addComment = function(id, comment){
    return $http.post('/posts/', id, '/comments', comment);
  };

  postsObject.likeComment = function(post, comment){
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/like')
      .success(function(data){
        comment.likes += 1;
      });
  };
  return postsObject;
}]);

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function(posts){
            return posts.getAll();
          }]
        }
      })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts){
            return posts.get($stateParams.id);
          }]
        }
      })

    $urlRouterProvider.otherwise('home');
}]);

app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
  $scope.posts = posts.posts;

  $scope.addPost = function(){
    if(!$scope.title || $scope.title === ''){
      return;
    }
    if(!$scope.link || $scope.link === ''){
      return;
    }
    posts.create({ title: $scope.title, link: $scope.link });
    $scope.title = '';
    $scope.link = '';
  };

  $scope.incrementLikes = function(post){
    post.like(post);
  };

}]);

app.controller('PostsCtrl', ['$scope', 'posts', 'post', function($scope, posts, post){
    $scope.post = post;

    $scope.addComment = function(){
      if($scope.body === ''){
        return;
      }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user'
      }).success(function(comment){
        $scope.post.comments.push(comment);
      })
      $scope.body = '';
    };

    $scope.incrementLikes = function(comment){
      posts.likeComment(post, comment);
    };

}])








