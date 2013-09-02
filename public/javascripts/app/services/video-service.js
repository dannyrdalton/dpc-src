app.service('Video', ['$http', function($http) {
	
	this.getAll = function() {
		return $http.get('api/videos');
	};
}]);