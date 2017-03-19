(function() {
	if (!window.WebSocket) {
		document.body.innerHTML = "window.WebSocket?";
		return;
	}
	
	var socket = new WebSocket("ws://dilemma-heterotroph.codeanyapp.com:3000");
	
	document.forms.request.onsubmit = function() {
		var request = JSON.stringify({
			"action": this.action.value,
			"data": this.data.value,
			"uuid": this.uuid.value,
			"timestamp": new Date().getTime()
		})
		socket.send(request);
		showMessage("request: " + request);

		this.data.value = "";
		return false;
	};

	socket.onopen = function(event) {
		showMessage("open;");
	};

	socket.onclose = function(event) {
		showMessage("close;");
	};

	socket.onmessage = function(event) {
		var message = event.data;
		//var object = JSON.parse(message);
		showMessage("response: " + message);
	};

	socket.onerror = function(event) {
		showMessage("error");
	};

	function showMessage(message) {
		var logDiv = document.getElementById("log");
		var item = document.createElement("div");
		item.appendChild(document.createTextNode(message));
		logDiv.insertBefore(item, logDiv.firstChild);
	}
})();