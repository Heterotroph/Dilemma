var fs = require('fs');

module.exports.home = function(request, response) {
	//<title><%= title %></title>
	//response.render(process.env.PUBLIC_PATH + "home.html", {"title": "test"});
	response.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
  fs.createReadStream(process.env.PUBLIC_PATH + "home.html").pipe(response);
}

module.exports.game = function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
  fs.createReadStream(process.env.PUBLIC_PATH + "game.html").pipe(response);
}

module.exports.game = function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
  fs.createReadStream(process.env.PUBLIC_PATH + "game.html").pipe(response);
}