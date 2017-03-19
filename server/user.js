User.map = {}

function User(uuid, ws) {
  this.uuid = uuid;
  this.ws = ws;
  this.rooms = [];
}

User.create = function(uuid, ws) {
  var user = new User(uuid, ws);
  User.map[uuid] = user;
  return user;
}

module.exports = User;