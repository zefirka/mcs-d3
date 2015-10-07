'use strict';

let request = require('request');
let key = '57ee3318536b23ee81d6b27e36997cde';
let extend = require('util')._extend;

function get (method, ops) {
	var data = extend({
		api_key: key,
		method: method,
	}, ops);
	console.log('DATA IS NOW', data);
	var r = request.get('http://ws.audioscrobbler.com/2.0/', {data: data});

	return {
		success: function (fn){
			r.on('response', fn);
		},
		error: function (fn){
			r.on('error', fn);
		},
	};

}

module.exports = get;


var userMethods = ['getArtistTracks', 'getBannedTracks', 'getEvents', 'getFriends', 'getInfo', 'getLovedTracks', 'getNeighbours', 'getNewReleases', 'getPastEvents', 'getPersonalTags', 'getPlaylists', 'getRecentStations', 'getRecentTracks', 'getRecommendedArtists', 'getRecommendedEvents', 'getShouts', 'getTopAlbums', 'getTopArtists', 'getTopTags', 'getTopTracks', 'getWeeklyAlbumChart', 'getWeeklyArtistChart', 'getWeeklyChartList', 'getWeeklyTrackChart', 'shout', 'signUp', 'terms']