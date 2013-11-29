
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require("fs");



var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}

//app.get('/', routes.index);
//app.get('/users', user.list);

//app.get('/photo/upload', requestHandler.upload);
//app.get('/photo/show', requestHandler.show);


var hostname = "10.25.253.116:3000";
var data = require("./data.json");
var modified = false;

/**
  * androidから写真をアップロード
  * /upload?lat=35.1421&lng=135.3472 みたいなPOSTを想定
  * （可能？）
  */
app.post('/upload_media', function(req, res) {
    //req.files.mediaはアップロードする画像の要素名
	
//	console.dir(req);
	
    var media = req.files.picture;
	var now = (+ new Date());
    fs.rename(media.path, __dirname + "/public/images/" + now + '.jpg' , function(err) {
        if (err) {
            res.send(500);
        } else {
            res.send(200);
        }

		data[0].lat = req.query.lat;
		data[0].lng = req.query.lng;
		data[0].img = now + ".jpg";
		modified = true;
	});
});

	
app.get("/1/data",function(req,res){

	// ---- 入力
	var sessionId = req.query.sessionId;
	var numRecv = req.query.num;
	
	// ---- 出力
	var result = {};
	
	// modified
	result.modified = modified;
	modified = false;
	
	// {lat, lng, img}を num個
	var numSend = 1;
	numSend = (numRecv > numSend) ? numRecv : 1;
	numSend = (numSend > data.length) ? data.length : numSend;

	var subData = []; 
	for(var i=0; i< numSend; i++){
		var tmpdata = {};
		tmpdata.lat = data[i].lat;
		tmpdata.lng = data[i].lng;
		tmpdata.img = "http://" + hostname + "/" + data[i].img;
		subData.push(tmpdata);
	}
	result.images = subData;
	

	res.send(result);

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
