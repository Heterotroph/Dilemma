var mysql = require('mysql');
var connection;

module.exports.createConnection = function() {
	connection = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});
	
	module.exports.mysql = mysql;
	module.exports.connection = connection;
	module.exports.connect = connection.connect;
	module.exports.end = connection.end;
}