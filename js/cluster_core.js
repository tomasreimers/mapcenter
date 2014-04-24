var cluster_core = new (function () {
	
	var self = this;

	// implements k-means clustering and returns array of centers
	self.cluster = function (points) {
    var MAX_DIST = .1;
    // Get N clusters, check against threshold, then try again
    var k = 1
    var parties;
    while (k <= points.length()) {
      var points_within_range = true;
      parties = self.cluster_with_k(k, points);  
      for (var p = 0; p < parties.length(); p++) {
        for (var i = 0; i < parties[p].points.length(); i++) {
          if (parties[p].points[i].dist > MAX_DIST)
            points_within_range = false;
        }
      }
      if (points_within_range = true)
        break;
    }
    return parties;
	}; 

  // calculates centers of k parties and returns objects with the points assigned 
  self.cluster_with_k = function (k, points) {
    // Account for chance of calling function while looking for zero parties
    if (k < 1 || points < 1) {
      console.log("CALLED 'cluster_with_k' with " + k + 
        " clusters and " + points.length() " points");
      return;
    }

    // find create k initial parties and hold them in an 'parties' array
    parties = [];
    var i = 0;
    for (i; i < k && i < points.length(); i++) {
      new_party = {
        lat: points[i].lat,
        lng: points[i].lng,
        points: [points[i]]
      }
      parties.push(new_party)
    }

    // 'i' now references the index of the unclustered points.
    // walk through the remains of the points array and cluster them

    for (i; i < points.length; i++) {
      // check to see which cluster is closest to the current point
      var closest_party = parties[0];
      var closest_dist = self.distance_between(closest_party,points[i]);
      for (var p = 1; p < parties.length(); p++) {
        dist = self.distance_between(parties[p], points[i]);
        if (dist < closest_dist) {
          closest_dist = dist;
          closest_party = parties[p];
        }
      }
      // add point to the closest party and adjust the mean
      point.dist = closest_dist;
      closest_party.points.push(point);
      self.adjust_center(closest_party);
    }
    // Now reapportion the points to the parties based on new means
    self.reapportion(parties, 3);
    // Return final list of parties
    return parties;
  };

  self.reapportion = function (parties, limit) {
    if (limit > 0) {
      // Walk through each point in each party and double check its possition
      for (var p = 0; p < parties.length(); p++) {
        var party = parties[p];
        for (var i = 0; i < party.points.length(); i++) {
          var point = party.points[i];
          // Check the distance of this point to each center
          var cur_dist = self.distance_between(party, point);
          // Compare with each other party
          for (var p2 = 0; p2 < parties.length(); p2++) {
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
    party.lat = latSum / party.points.length()
    party.lng = lngSum / party.points.length()
  }

  self.furthest_from_party () {

  };
});