const List = require('linkedlist-js').List;
const Response = require("./response");
const NodeUUID = require("node-uuid");
const log = require("./utils/logger.js")

Room.prepared = {
  count: 0
};
Room.map = {
  count: 0
};
Room.types = {
  "SMALL": {
    "players": 3,
    "resuorces": 300,
    "interval": 20
  }
}

function Room() {
  
  this.type = Room.types.SMALL;
  this.uuid = NodeUUID.v1();
  
  this.users = new List();
  this.data = {};
  this.isFull = false;
  this.state = "prepare"; //"prepare"/"active"/"completed"/etc..
  
  this.stepInterval;
  this.currentStep = 0;


  this.join = function(user) {
    log("join attemp...")
    if (this.isFull) return null;
    log("*")
    if (this.find(user)) return this;
    log("*")
    //if (this.findUserByUUID(user)) return this.reJoin(user);
    this.users.push(user);
    log("joined; room: " + this.uuid + "; user: " + user.uuid + "; completeness: " + this.users.count() + "/" + this.type.players);
    this.isFull = this.users.count() == this.type.players;
    if (!this.isFull) return this;
    
    //looping users list
    this.users.tail().setNext(this.users.head());
    this.users.head().setPrevious(this.users.tail());
    
    return this;
  };

  this.reJoin = function(user) {
    //search by uuid and replace in users list
  }

  this.start = function() {
    log("room " + this.uuid + " starts...");
    
    Room.removeFromPrepared(this);
    
    this.send(this.users, JSON.stringify(Response.start(this.uuid)));
    this.state = "active";
    
    this.stepInterval = setInterval(this.step, this.type.interval);
  }
  
  this.step = function() {
    log("step: " + this.uuid);
    //Response.step()....
  }
  
  this.stop = function() {
    clearInterval(this.stepInterval);
  }

  this.send = function(recipients, response) {
    var node = recipients.head();
    do {
      node.value().ws.send(response);
      node = node.next();
    } while (node != recipients.head())
  }
  
  this.find = function(value) {
    var node = this.users.head();
    if (!node) return null;
    do {
      if (node.value() == value) return node;
      node = node.next();
    } while (node != this.users.head() && node);
    return null;
  }

}

Room.getRoom = function() {
  log("..need a room, we have " + Room.prepared.count);
  if (!Room.prepared.count) return Room.create();
  var key = Object.keys(Room.prepared)[1];
  log("it will be " + key);
  return Room.prepared[key];
}

Room.create = function() {
  var room = new Room();
  log("new room: " + room.uuid);
  
  Room.map[room.uuid] = room;
  Room.map.count++;

  Room.prepared[room.uuid] = room;
  Room.prepared.count++;

  return room;
}

Room.kill = function(room) {
  Room.map.count--;
  delete Room.map[room.uuid];
  if (Room.prepared[room.uuid]) {
    delete Room.prepared[room.uuid];
    Room.prepared.count--;
  }
}

Room.removeFromPrepared = function(room) {
  delete Room.prepared[room.uuid];
  Room.prepared.count--;
}

module.exports = Room;