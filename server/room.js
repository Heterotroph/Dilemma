const List = require('linkedlist-js').List;

Room.count = 0;

function Room() {
  this.uuid = require("node-uuid").v1();
  this.maxUsers = 3; //3 - default users count
  this.users = new List();
  this.isFull = false;
  
  
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
  
}

Room.create = function() {
  Room.count ++;
  var room = new Room();
  return room;
}

Room.kill = function(room) {
  Room.count --;
  //
}

module.exports = Room;