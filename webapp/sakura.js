function initialize() {
	var myLatlng = new google.maps.LatLng(35.560981, 139.718344); // アロマスクエア
	var images = {};
	var mapOptions = {
		center : myLatlng,
		zoom : 17,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		mapTypeControl : false,
		streetViewControl : false
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
	var done = {};
	$.ajaxSetup( {
		cache : false
	});
	$(function() {
		setInterval(function() {
			// http://10.25.238.90:3000/1/data
				$
						.getJSON(
								"http://kumano.zetta.flab.fujitsu.co.jp/sakura/photos.json",
								function(data) {
									console.log(JSON.stringify(data));
									images.images = data.images;
									images.images
											.forEach(function(element) {
												if (!done[element.lat + "_"
														+ element.lng]) {
													done[element.lat + "_"
															+ element.lng] = true;
													var infowindow = new google.maps.InfoWindow(
															{
																content : '<img src=\'' + element.img + '\'/>'
															});
													var marker = new google.maps.Marker(
															{
																position : new google.maps.LatLng(
																		element.lat,
																		element.lng),
																map : map,
																icon : image
															});
													google.maps.event
															.addListener(
																	marker,
																	'click',
																	function() {
																		infowindow
																				.open(
																						map,
																						marker);
																	});
												}
											});
								});
			}, 2000);
	});
}
google.maps.event.addDomListener(window, 'load', initialize);
