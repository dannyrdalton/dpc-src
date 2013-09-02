var request = require('request'),
	async = require('async'),
	_ = require('underscore');

exports.crawlForVideosOnYoutube = function(Video) {
	var channelsBaseUrl = 'https://www.googleapis.com/youtube/v3/channels',
		playlistItemsBaseUrl = 'https://www.googleapis.com/youtube/v3/playlistItems',
		videosBaseUrl = 'https://www.googleapis.com/youtube/v3/videos',
		ApiKey = 'AIzaSyCNVhTbydq4uBvnC8LvmRR2cIFegjReevM',
		channelNames = ['LibraryUk'];

	var youtubePageToken = '';

	var queue = async.queue(function(task, callback) {
		console.log('starting ' + task.name);
		callback(task.body, task.reqUrl);
	}, 1);

	var processYoutubePage = function(body, reqUrl) {
		//console.log(body);
		_.each(body.items, function(playlistItem) {
			console.log(playlistItem.contentDetails.videoId);
		});
		if (body.nextPageToken) {
			fullReqUrl = reqUrl + '&pageToken=' + body.nextPageToken;
			//console.log(fullReqUrl);
			request(fullReqUrl, function(error, response, body) {
				if (error) {
					console.log('error getting playlist items');
				} else {
					body = JSON.parse(body);
					queue.push({ name: body.nextPageToken, body: body, reqUrl: reqUrl }, processYoutubePage);
				}
			});
		}
	};

	
	_.each(channelNames, function(channelName) {
		var channelsReqUrl = channelsBaseUrl + '?key=' + ApiKey + '&forUsername=' + channelName + '&part=contentDetails';

		//req to get channel
		request(channelsReqUrl, function(error, response, body) {
			if (error) {
				console.log('error getting channel');
			} else {
				var playlistId = JSON.parse(body).items[0].contentDetails.relatedPlaylists.uploads;

				var playlistItemsReqUrl = playlistItemsBaseUrl + '?key=' + ApiKey + '&playlistId=' + playlistId + '&part=id,contentDetails';

				//req to get playlistItems
				request(playlistItemsReqUrl, function(error, response, body) {
					if (error) {
						console.log('error getting playlist items');
					} else {
						body = JSON.parse(body);
						queue.push({ name: body.nextPageToken, body: body, reqUrl: playlistItemsReqUrl }, processYoutubePage);
					}
				});
			}
		});
	});
};