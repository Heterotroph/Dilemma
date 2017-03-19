module.exports = function() {
	
	var pages = require("./pages");

	var express = require("express");
	var app = express();
	
	app.use(express.static(process.env.PUBLIC_PATH));
	
	app.get("/", function (request, response) { response.redirect("home") })
	app.get("/home", pages.home);
	app.get("/game", pages.game);
	app.get("/scoreboard", pages.scoreboard);

	app.listen(process.env.PORT, process.env.IP, function() {
		console.log(process.env.PORT);
	})

};