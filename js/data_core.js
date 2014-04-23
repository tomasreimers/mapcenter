var data_core = new (function () {
	
	var self = this;

	// array of points
	self.data = [];

	// new point event callback
	self.on_new_point = undefined;

	// lifespan of a point (in milliseconds)
	self.lifespan = 60000;

	// adds a point to the data
	self.add_point = function (lat, lng) {
		var point = {
			lat: lat,
			lng: lng,
			timestamp: (new Date()).getTime()
		};

		self.data.push(point);

		if (typeof(self.on_new_point) != "undefined") {
			self.on_new_point(point);
		}
	};

	// remove expired points
	self.clean_points = function () {
		var current_time = (new Date()).getTime();
		self.data = _.filter(self.data, function (point) {
			return (current_time - point.timestamp <= self.lifespan);
		});
	};

});