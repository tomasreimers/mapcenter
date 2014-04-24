var cluster_core = new (function () {
	
	var self = this;

	self.THRESHOLD = 0.001;

	// implements k-means clustering and returns array of centers
	self.cluster = function (points) {
		if (points.length == 0)
			return [];

	    var k = 0;
	    var parties = [];
	    do {
	    	k++;
	    	parties = self.cluster_with_k(k, points);  
	    } while (!self.all_within_threshold(parties));
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

  	// calculates centers of k parties and returns objects with the points assigned 
  	self.cluster_with_k = function (k, points) {
		// find create k initial parties and hold them in an 'parties' array
		parties = [];
		for (var i = 0; i < k; i++) {
		  	new_party = {
		    	lat: points[i].lat,
		    	lng: points[i].lng,
		    	points: []
			};
			parties.push(new_party);
		}

		// 'i' now references the index of the unclustered points.
		// walk through the remains of the points array and cluster them

		for (var i = 0; i < points.length; i++) {
			// check to see which cluster is closest to the current point
			var closest_party = parties[0];
			var closest_dist = self.distance_between(closest_party,points[i]);
			for (var p = 1; p < parties.length; p++) {
				dist = self.distance_between(parties[p], points[i]);
				if (dist < closest_dist) {
					closest_dist = dist;
					closest_party = parties[p];
				}
			}
			// add point to the closest party and adjust the mean
			closest_party.points.push(points[i]);
			self.adjust_center(closest_party);
		}
		// Now reapportion the points to the parties based on new means
		self.reapportion(parties, 10);
		// Return final list of parties
		return parties;
 	};

    // recursively reassign points to new parties
    self.reapportion = function (parties, limit) {
		if (limit > 0) {
			// Walk through each point in each party and double check its position
			for (var p = 0; p < parties.length; p++) {
				var party = parties[p];
				for (var i = 0; i < party.points.length; i++) {
					var point = party.points[i];
					// Check the distance of this point to each center
					var cur_dist = self.distance_between(party, point);
					// Compare with each other party
					for (var p2 = 0; p2 < parties.length; p2++) {
						if (p2 != p) {
							var other_dist = self.distance_between(parties[p2], point);
							if (other_dist < cur_dist) {
								// The point needs to change parties
								point.dist = other_dist;
								party.points.splice(i,1); // removes from party
								parties[p2].points.push(point); // add to closer party
								self.adjust_center(party); // recalcuate mean
								self.adjust_center(parties[p2]); // and again
								self.reapportion(parties, limit-1) // recurse
							}
						}
					}
				}
			}
		}
	}

	self.distance_between = function (p1, p2) {
		var width = p1.lng - p2.lng;
		var height = p1.lat - p2.lat;
		var dist = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
		return dist;
	}

	self.adjust_center = function (party) {
		var latSum = _.reduceRight(party.points, function(acc, p) {return acc + p.lat}, 0);
		var lngSum = _.reduceRight(party.points, function(acc, p) {return acc + p.lng}, 0);
		party.lat = latSum / party.points.length;
		party.lng = lngSum / party.points.length;
	}

});