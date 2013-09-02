app.config(function($httpProvider) {
  return $httpProvider.defaults.transformRequest.push(function(data, headersGetter) {
    var d, utf8_data;
    utf8_data = data;
    if (!angular.isUndefined(data)) {
      d = angular.fromJson(data);
      d["_utf8"] = "☃";
      utf8_data = angular.toJson(d);
    }
    return utf8_data;
  });
});