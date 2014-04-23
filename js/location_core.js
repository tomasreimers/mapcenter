var location_core = new (function () {
	
	var self = this;

	// a point storing location
	self.location = undefined; 

	// updates location from server and invoke callback
	self.update = function (callback) {
		navigator.geolocation.getCurrentPosition(function (position) {
			self.location = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
				timestamp: 0
			};
			callback();
		});
	};

});