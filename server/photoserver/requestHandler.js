var fs = require("fs");

 function start(res){
 	console.log("Request handler 'start' was called.");

 	var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<h1>ファイルをアップロードしてください</h1>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload" />'+
    '</form>'+
    '</body>'+
    '</html>';

    res.writeHead(200, {"Content-Type":"text/html"});
    res.write(body);
    res.end();
 }


 function upload(res, req){
    console.log("Request handler 'upload' was called.");
    //req.files.mediaはアップロードする画像の要素名
    var media = req.files.media;
    fs.rename(media.path, mediaPath + 'media.png' , function(err) {
                fs.unlink("img/test.jpg");
                fs.rename(files.upload.path, "img/test.jpg");
	 });
	res.writeHead(200, {"Content-Type":"text/html; charset=UTF-8"});
       res.write("送信された画像ですよー↓<br/>");
       res.write("<img src='/show' />");
       res.end();
 
 }

 function show(res){
     console.log("Request handler 'show' was called.");
     fs.readFile("img/test.jpg", function(error, file){
        if(error){
            res.writeHead(500, {"Content-Type": "text/plain; charset=UTF-8"});
            res.write("OH MY GOD\n"+error+"\n");
            res.end();
        }else{
            res.writeHead(200, {"Content-Type":"image/jpg"});
            res.write(file);
            res.end();
        }
     });
 }

 exports.start = start;
 exports.upload = upload;
 exports.show = show;