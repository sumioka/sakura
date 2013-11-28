function initialize() {
	var myLatlng = new google.maps.LatLng(35.560981, 139.718344); // アロマスクエア
	var images = {
		modified : true,
		images : [ {
			lat : 35.560981,
			lng : 139.718344,
			img : "photo-600.jpg"
		}, // アロマスクエア
				{
					lat : 35.562479,
					lng : 139.716051,
					img : "photo-600.jpg"
				}, // JR蒲田
				{
					lat : 35.560685,
					lng : 139.723731,
					img : "photo-600.jpg"
				} // 京急蒲田
		]
	}
	var mapOptions = {
		center : myLatlng,
		zoom : 17,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);
	var image = 'sakura_L.png';
	var styles = [ {
		stylers : [ {
			saturation : -50
		} ]
	} ];
	map.setOptions( {
		styles : styles
	});
	// TODO リストの要素が増えたタイミングで増えたものについて実行
	images.images.forEach(function(element) {
		var infowindow = new google.maps.InfoWindow( {
			content : '<img src=\'' + element.img + '\'/>'
		});
		var marker = new google.maps.Marker( {
			position : new google.maps.LatLng(element.lat, element.lng),
			icon : image
		});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, marker);
		});
		marker.setMap(map);
	});
}
google.maps.event.addDomListener(window, 'load', initialize);
$(function() {
	setInterval(function() {
		console.log("定期実行");
		$.get("photos.json", function(data) {
			console.log("データ：" + data);
		});
	}, 10000);
});