var data_core = new (function () {
	
	var self = this;

	// array of points
	self.data = [];

	// updates data from the server and invokes the callback
	self.update = function (callback) {
		$.ajax({
			url: "api/data.json",
			method: "GET",
			dataType: "json",
			success: function (data) {
				self.data = data;
				if (typeof(callback) != "undefined") {
					callback();
				}
			}
		});
	};

});