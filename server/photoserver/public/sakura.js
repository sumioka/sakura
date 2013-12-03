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
	var done = {};
	$.ajaxSetup( {
		cache : false
	});
	$(function() {
		setInterval(function() {
			// http://10.25.238.90:3000/1/data
				$
						.getJSON(
								"http://localhost:3000/1/data",
								function(data) {
									console.log(JSON.stringify(data));
									images.images = data.images;
									images.images
											.forEach(function(element) {
												if (!done[element.lat + "_"
														+ element.lng]
//														&& data.modified
					   									) {
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
													console.log("マーカを表示します。");
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
													$(function() {
														setTimeout(
																function() {
																	console
																			.log("マーカを消します。");
																	marker
																			.setMap(null);
																	done[element.lat
																			+ "_"
																			+ element.lng] = false;
																}, 10000);
													});
												}
											});
								});
			}, 2000);
	});
}
google.maps.event.addDomListener(window, 'load', initialize);
