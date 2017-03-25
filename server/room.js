const List = require('linkedlist-js').List;
const Response = require("./response");
const NodeUUID = require("node-uuid");

Room.prepared = {
  count: 0
};
Room.map = {
  count: 0
};
Room.size = {
  "SMALL": 3,
  "STANDART": 5,
  "BIG": 7
}

function Room() {
  
  this.uuid = NodeUUID.v1();
  this.maxUsers = Room.size.SMALL;
  this.users = new List();
  this.isFull = false;
  this.state = "prepare"; //"prepare"/"active"/"completed"/etc..


  this.join = function(user) {
    if (this.isFull) return null;
    if (this.find(user)) return this.reJoin(user);
    this.users.push(user);
    console.log("join: " + this.uuid + " " + user.uuid + " " + this.users.count() + "/" + this.maxUsers);
    this.isFull = this.users.count() == this.maxUsers;
    if (this.isFull) { //looping users list
      this.users.tail().setNext(this.users.head());
      this.users.head().setPrevious(this.users.tail());
    }
    return this;
  };

  this.reJoin = function(user) {
    //search by uuid and replace in users list
  }

  this.start = function() {
    delete Room.prepared[this.uuid];
    Room.prepared.count--;
    this.send(this.users, JSON.stringify(Response.start(this.uuid)));
    this.state = "active";
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
    } while (node != this.users.head());
    return null;
  }

}

Room.getRoom = function() {
  console.log("getRoom: " + Room.prepared.count);
  if (!Room.prepared.count) return Room.create();
  var key = Object.keys(Room.prepared)[1];
  return Room.prepared[key];
}

Room.create = function() {
  var room = new Room();
  console.log("room: " + room.uuid);
  
  Room.map[room.uuid] = room;
  Room.map.count++;

  Room.prepared[room.uuid] = room;
  Room.prepared.count++;

  return room;
}

Room.kill = function(room) {
  Room.map.count--;
  if (room.state == "prepare") {
    //clean all links!
    //Room.prepared.count--;
    //delete Room.prepared[uuid];
  }
  //clean all links!
  //delete Room.map[uuid];
}

module.exports = Room;