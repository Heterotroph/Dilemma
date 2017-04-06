module.exports = function(value, CRLF) {
	if (CRLF) console.log("");
	console.log("[" + (new Date()).toUTCString() + "]	" + value);
}