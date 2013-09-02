exports.getAll = function(Video) {
	return function(req, res) {
		Video.find({}, function(error, videos) {
			res.json({ videos: videos });
		});
	};
};