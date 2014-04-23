$(document).ready(function () {
	// begin by initializing the map
	var map_el = $("#mapcanvas")[0];
	map_core.init_map(map_el);
	map_core.bind_click(data_core.add_point);

	// redraw
	var update = function () {
		// clean points
		data_core.clean_points();
		// draw
		map_core.clear_points();
		_.each(data_core.data, function (point) {
			map_core.add_point(point);
		});
	};

	setInterval(update, 1000);

	// bind updating
	data_core.on_new_point = update;
});
