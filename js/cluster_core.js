var cluster_core = new (function () {
	
	var self = this;

	self.THRESHOLD = 0.0001; // in latlng distance
	self.ITERATIONS = 20 // amount of times to iterate to get approx

	// implements k-means clustering and returns array of centers
	self.cluster = function (points) {
		if (points.length == 0)
			return [];

	    var k = 0;
	    var parties = [];
	    // count up while there aren't sufficient parties
	    do {
	    	k++;
	    	parties = self.cluster_with_k(k, points);  
	    } while (!self.all_within_threshold(parties));

	    // if there are too many parties (problem with approximating the k in k means,
	   	// then try again with different randomly chosen centers)
	    while (self.clusters_too_close(parties)){
	    	k--;
	    	parties = self.cluster_with_k(k, points);  
	    }
	    
	    return parties;
	}; 

	// picks a certain number of points to be centroids from an array of points randomly
	self.pick_starting_centers = function (num_centers, points) {
		parties = [];
		points_copy = points.slice(0);

		while (num_centers > 0 && points_copy.length > 0) {
			var i = Math.floor(Math.random()*points_copy.length);
		  	new_party = {
		    	lat: pointsCopy[i].lat,
		    	lng: pointsCopy[i].lng,
		    	points: []
			};
			parties.push(new_party);
			num_centers--;
			points_copy.splice(i,1);
		}
		return parties;
	};

	// checks if all the parties are within a threshold
	self.all_within_threshold = function (parties) {
		for (var i = 0; i < parties.length; i++) {
	      	for (var k = 0; k < parties[i].points.length; k++) {
	        	var dist = self.distance_between(parties[i], parties[i].points[k]);
	        	if (dist > self.THRESHOLD)
	            	return false;
	      	}
	    }
	    return true;
	};

	// check if two parties are within the threshold (i.e. there are too many parties)
	self.clusters_too_close = function (parties) {
		for (var p1 = 0; p1 < parties.length; p1++) {
			for (var p2 = 0; p2 < parties.length; p2++) {
				if (p1 != p2 && self.distance_between(parties[p1], parties[p2]) < self.threshold)
					return true;
			}
		}
		return false;
	}

  	// calculates centers of k parties and returns objects with the points assigned 
  	self.cluster_with_k = function (k, points) {
		
		// get starting centers
		var parties = self.pick_starting_centers(k, points);

		// reassign iteratively
		for (var i = 0; i < self.ITERATIONS; i++) {
			var new_centers = self.clean_centers(parties);
			parties = self.assign_to_parties(points, new_centers);
		}

		// Now reapportion the points to the parties based on new means
		return parties;
		
 	};

 	// assigns points to closest party 
 	self.assign_to_parties = function (points, parties) {
 		// assign everything a party to start
		_.each(points, function (point) {
			var closest_party = undefined;
			var closest_dist = 0;
			_.each(parties, function (party) {
				var dist = self.distance_between(party, point);
				if (dist < closest_dist || typeof(closest_party) == "undefined") {
					closest_dist = dist;
					closest_party = party;
				}
			});
			// add point to the closest party and adjust the mean
			closest_party.points.push(point);
			self.adjust_center(closest_party);
		});
		return parties;
 	};

 	// duplicates the centers array and removes previous points from it
 	self.clean_centers = function (parties) {
 		var new_parties = [];
 		_.each(parties, function (party) {
 			new_parties.push({
		    	lat: party.lat,
		    	lng: party.lng,
		    	points: []
			});
 		});
 		return new_parties;
 	};

 	// finds the distance between two points
 	
 	// we understand that globally using lat/lng as distance is a terrible idea -
 	// but within a small city (i.e. cambridge) the curvature of the earth should
 	// not affect distance too much.
	self.distance_between = function (p1, p2) {
		var width = p1.lng - p2.lng;
		var height = p1.lat - p2.lat;
		var dist = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
		return dist;
	};

	// computes the weighted center of a party based on it's points
	self.adjust_center = function (party) {
		// weight mean based of of time remaining for each point
		var totalTime = 0;
		var latSum = 0;
		var lngSum = 0;
		_.each(party.points, function (point) {
			var time = point.time_remaining();
			if (time > 0) {
				totalTime += time;
				latSum += point.lat * time;
				lngSum += point.lng * time;
			}
		});
		party.lat = latSum / totalTime;
		party.lng = lngSum / totalTime;
	};

});