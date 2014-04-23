var map_core = new (function () {
	
	var self = this;
	
	// Stores the map
	self.map = undefined;

	// Keeps references to all points on the map
	self.points = [];

	// Keeps reference to all points objects in the map
	self.map_points = [];

	// Adds a point to the array and places a marker on the map  
	self.add_point = function (point) {
		// add to map
		if (typeof(map) !== undefined) {
			self.add_point_to_map(point);
		}
		// store point
		self.points.push(point);
	};

	// Helper function to add points to map
	self.add_point_to_map = function (point) {
		var marker_center = new google.maps.LatLng(point.lat, point.lng);
		var marker = new google.maps.Marker({
			map: self.map,
			position: marker_center
		});
		self.map_points.push(marker);
	};

	// Removes all the points from the map and clears the points array
	self.clear_points = function () {
		_.each(self.map_points, function (map_point) {
			map_point.setMap(null);
		});
		self.map_points = [];
		self.points = [];
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
		// add all already existing points
		_.each(self.points, self.add_point_to_map);
	};
});