var map_core = new (function () {
	
	var self = this;
	
	// Stores the map
	self.map = undefined;

	// Keeps reference to all points objects in the map
	self.map_points = [];

	// Creates an icon to represent you 
	self.point_symbol = function (opacity) {
		return {
			strokeColor: "#FF0000",
			fillColor: "#FF6666",
			fillOpacity: opacity,
			path: google.maps.SymbolPath.CIRCLE,
			scale: 4,
			strokeWeight: 1,
			strokeOpacity: opacity
		};
	};

	// Adds a point to the array and places a marker on the map  
	self.add_point = function (point) {
		var lifespan = (data_core.lifespan + point.timestamp - (new Date()).getTime()) / data_core.lifespan;
		var marker_center = new google.maps.LatLng(point.lat, point.lng);
		var marker = new google.maps.Marker({
			map: self.map,
			position: marker_center,
			icon: self.point_symbol(lifespan)
		});
		self.map_points.push(marker);
	};

	// Removes all the points from the map and clears the points array
	self.clear_points = function () {
		_.each(self.map_points, function (map_point) {
			map_point.setMap(null);
		});
		self.map_points = [];
	};

	// Centers the map on a latitude and longitude
	self.center_map = function (lat, lng) {
		var center = new google.maps.LatLng(lat, lng);
		self.map.setCenter(center);
	};

	// Creates a map, stores a reference to it in the map var, and appends it to the specified DOMElement 
	self.init_map = function (el) {
		// create the map
		self.map = new google.maps.Map(el, {
			zoom: 16,
			center: new google.maps.LatLng(42.374481,-71.117218)
		});
	};

	// Responds to clicks on the map
	self.bind_click = function (callback) {
		google.maps.event.addListener(self.map, 'click', function(e) {
            callback(e.latLng.lat(), e.latLng.lng());
        });
	};

});