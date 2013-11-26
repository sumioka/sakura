var request = require("request");
var fs = require("fs");
var querystring = require("querystring");
var async = require('async');

//var lines = ["JR五能線","JR仙山線","JR仙石線","JR八戸線","JR利府線","JR北上線","JR只見線","JR大湊線","JR大船渡線","JR奥羽本線","JR山田線","JR岩泉線","JR左沢線","JR常磐線","JR東北本線","JR気仙沼線","JR水郡線","JR津軽線","JR海峡線","JR田沢湖線","JR男鹿線","JR石巻線","JR磐越東線","JR磐越西線","JR米坂線","JR羽越本線","JR花輪線","JR釜石線","JR陸羽東線","JR陸羽西線","いわて銀河鉄道線","三陸鉄道北リアス線","三陸鉄道南リアス線","仙台市南北線","会津鉄道会津線","山形新幹線","山形鉄道フラワー長井線","弘南鉄道大鰐線","弘南鉄道弘南線","東北新幹線","津軽鉄道","由利高原鉄道鳥海山ろく線","福島交通飯坂線","秋田内陸縦貫鉄道","秋田新幹線","野岩鉄道会津鬼怒川線","阿武隈急行","青い森鉄道線","仙台空港鉄道","青函トンネル竜飛斜坑線","JR大船渡BRT線"];

var lines = ["青森県","秋田県","岩手県","宮城県","山形県","福島県"];


// http://express.heartrails.com/api/json?method=getStations&line=JR%E4%BA%94%E8%83%BD%E7%B7%9A

var myData =[];

var count = 0;

async.each(lines, function(line, callback){
	console.log(line);
    // 処理
	var lineUrlEncode = querystring.stringify({line: line});
	console.log(lineUrlEncode);

	// http://geoapi.heartrails.com/api/json?method=getTowns&prefecture=%E6%9D%B1%E4%BA%AC%E9%83%BD
	var url = "http://geoapi.heartrails.com/api/json?method=getTowns&prefecture=&" + lineUrlEncode;
	
	console.log(url);

	
	request({url:url, json:true}, function (error, response, body) {
		var stations = body.response.station;
		for(var station in stations){
			data = {x:stations[station].x,y:stations[station].y};
			myData.push(data); 
			count++;
		}
//		Array.prototype.push.apply(myData, body.response.station);
		callback();
	});

}, function(err){
	fs.writeFile("eki.json", JSON.stringify(myData), function(err) {
    	if(err) {
     		 console.log(err);
   		 } else {
  	   	 	console.log("JSON saved to ");
	   	 }
	}); 

	console.log(count);
});



