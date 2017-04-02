module.exports = function(value, CRLF) {
	if (CRLF) console.log("");
	var hrt = process.hrtime();
	console.log("[" + hrt[0] + "]	" + value);
}