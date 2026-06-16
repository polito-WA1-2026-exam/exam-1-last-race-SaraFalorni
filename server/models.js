function User(userId, username, hashedPassword, salt, bestResult ) {
  this.userId = userId;
  this.username = username;
  this.hashedPassword = hashedPassword;
  this.salt = salt;
  this.bestResult = bestResult;
}

function Connection(connectionId, station1, station2, line) {
  this.connectionId = connectionId;
  this.station1 = station1;
  this.station2 = station2;
  this.line = line;
}

function Event(eventId, name, effect) {
  this.eventId = eventId;
  this.name = name;
  this.effect = effect;
}

function Station(stationId, name) {
  this.stationId = stationId;
  this.name = name;
}

export {User, Station, Connection, Event} ;