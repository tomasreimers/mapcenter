$(document).ready(function () {
	// begin by initializing the map
	var map_el = $("#mapcanvas")[0];
	map_core.init_map(map_el);
	// fetch and add data to the map
	data_core.update(function () {
		_.each(data_core.data, map_core.add_point);
	});
});
