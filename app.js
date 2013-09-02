
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

//instantiate db driver
var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'dpc');

//instantiate models
var VideoSchema = require('./models/video.js').VideoSchema;
var Video = db.model('videos', VideoSchema)

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//view routes
app.get('/', routes.index(Video));
app.get('/partials/:name', routes.partials);

//video api routes
var videos = require('./routes/video');
app.get('/api/videos', videos.getAll(Video));

//solves angular html5mode routing error
app.use(function(req, res) {
	res.sendfile(__dirname + '/views/index.html');
});

//start crawler
var videoCrawler = require('./server/video-crawler.js');
videoCrawler.crawlForVideosOnYoutube(Video);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
