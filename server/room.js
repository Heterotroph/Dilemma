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
    "interval": 20000
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
  this.steps = [];
  
  this.timestamp = new Date().getTime();

  /**
   *  Добавляет пользователя в комнату
   */
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
  
  /**
   *  Перевход. (Если есть новый ws, но у юзера старый uuid)
   */
  this.reJoin = function(user) {
    //search by uuid and replace in users list
  }
  
  /**
   *  Вызов говорит о получении от пользователя данных о взаимодействии с другими игроками для текущего шага.
   */
  this.interact = function(data, user) {
    if (this.currentStep != data.step) return;
  }
  
  /**
   *  Запускает комнату
   */
  this.start = function() {
    log("room " + this.uuid + " starts...");
    
    if (!this.isFull) {
      log("room is not full; completeness: " + this.users.count() + "/" + this.type.players);
      return;
    }
    
    Room.removeFromPrepared(this);
    
    this.send(this.users, JSON.stringify(Response.start(this.uuid)));
    this.state = "active";
    
    (function(that) {
      this.stepInterval = setInterval(function() {
        that.step();
      }, that.type.interval);
    })(this);
  }
  
  /**
   *  Запускает расчёт игрового хода и рассылает результат юзерам. Запускается setInterval'ом из местного кода.
   */
  this.step = function() {
    log("step " + this.currentStep + "; room: " + this.uuid, true);
    
    // * * * GAME LOGIC * * *
    
    this.send(this.users, JSON.stringify(Response.step(this.currentStep, "STEP DATA")));
    this.currentStep ++;
  }
  
  /**
   *  Останавливает, но не убивает комнату
   */
  this.stop = function() {
    clearInterval(this.stepInterval);
  }
  
  /**
   *  Посылает списку юзеров в recipients значение содержащееся в response
   */
  this.send = function(recipients, response) {
    var node = recipients.head();
    do {
      node.value().ws.send(response);
      node = node.next();
    } while (node != recipients.head())
  }
  
  /**
   *  Поиск изюера в связанном списке. Нативный find на зацикленный спсиок не работает, индус обещал починить.
   */
  this.find = function(value) {
    var node = this.users.head();
    if (!node) return null;
    do {
      if (node.value() == value) return node;
      node = node.next();
    } while (node != this.users.head() && node);
    return null;
  }
  
  /**
   *
   */
  this.pushStepData = function(user, data) {
    if (!this.steps[this.currentStep]) this.steps[this.currentStep] = {};
    this.steps[this.currentStep][user.uuid] = data;
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