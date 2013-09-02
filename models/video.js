var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

exports.VideoSchema = new Schema({
	youtubeId: String,
	youtubeChannelId: String,
	title: String,
	artist: String,
	publishedAt: Date
});