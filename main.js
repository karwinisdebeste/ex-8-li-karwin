// lucs@sabayon ~/tmp/ProberRequestNodeJs $ npm install --save request
var request = require("request");
var dal = require('./storage.js');

// http://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



var BASE_URL = "https://web-ims.thomasmore.be/datadistribution/API/2.0";
var Settings = function (url) {
	this.url = BASE_URL + url;
	this.method = "GET";
	this.qs = {format: 'json'};
	this.headers = {
		authorization: "Basic aW1zOno1MTJtVDRKeVgwUExXZw=="
	};
};

//var Drone = function (name, mac) {
//	this.name = name;
//	this.mac = mac;
//};
var Drone = function (id, name, mac_adress, location, last_packet,files, files_count) {
	this.id = id;
	this.name = name;
        this.mac_adress = mac_adress;
        this.location = location;
        this.last_packet = last_packet;
        this.files = files;
        this.files_count = files_count;
};

var dronesSettings = new Settings("/drones?format=json");

request(dronesSettings, function (error, response, dronesString) {
	var drones = JSON.parse(dronesString);
	console.log(drones);
	console.log("***************************************************************************");
	drones.forEach(function (drone) {
		var droneSettings = new Settings("/drones/" + drone.id + "?format=json");
		request(droneSettings, function (error, response, droneString) {
			var drone = JSON.parse(droneString);
			dal.insert_Drone(new Drone(
                               drone.id,
                               drone.name,
                               drone.location,
                               drone.last_packet,
                               drone.files,
                               drone.files_count
                            ));
			console.log(drone);
			console.log("***************************************************************************");
		});
	});
});

console.log("Hello World!");