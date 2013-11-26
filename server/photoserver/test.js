var express = require('express')
, fs = require('fs')
, mediaPath = __dirname + "/"
, app = express();

app.use(express.bodyParser());

app.post('/upload_media', function(req, res) {
    //req.files.mediaはアップロードする画像の要素名
    var media = req.files.media;
    fs.rename(media.path, mediaPath + 'media.png' , function(err) {
        if (err) {
            res.send(500);
        } else {
            res.send(200);
        }
    });
});
app.listen(8080);