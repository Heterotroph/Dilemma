const List = require('linkedlist-js').List;

Room.prepared = {count: 0};
Room.map = {count: 0};
Room.size = {
  "default": 3,
  "small": 3,
  "standart": 5,
  "big": 7
}

function Room() {
  this.uuid = require("node-uuid").v1();
  this.maxUsers = Room.size.default; //3 - default users count
  this.users = new List();
  this.isFull = false;
  this.state = "prepare"; //"prepare"/"active"/"completed"/etc..


  this.join = function(user) {
    if (this.isFull) return false;
    users.push(user);
    if (users.count() == this.maxUsers) {
      //looping users list
      users.tail().setNext(users.head());
      users.head().setPrevious(users.tail());

      this.isFull = true;
    }
    return true;
  };

  this.reJoin = function(user) {
    //search by uuid and replace in users list
  }
  
  this.start = function() {
    delete Room.prepared[uuid];
    Room.prepared.count--;
    //bla-bla-bla
  }

}

Room.getPreparedRooms = function() {
  return Room.prepared;
}

Room.create = function() {
  var room = new Room();
  
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