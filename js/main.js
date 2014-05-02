$(document).ready(function () {
	
	var UPDATE_INTERVAL = 5000; // in ms

	// begin by initializing the map
	var map_el = $("#mapcanvas")[0];
	map_core.init_map(map_el);
	map_core.bind_click(data_core.add_point);

	// redraw
	var update = function () {
		// clean points
		data_core.clean_points();
		map_core.clear_points();
		// do parties
		var centers = cluster_core.cluster(data_core.data);
		_.each(centers, function (party) {
			map_core.add_party(party);
		});
	};

	setInterval(update, UPDATE_INTERVAL);

	// bind updating
	data_core.on_new_point = update;
});
