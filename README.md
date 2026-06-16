# Exam #N: "Last Race"
## Student: s353341 Falorni Sara

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST

- POST `/api/something`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `users` - contains userId, username,  hashedPassword, salt, bestResult
- Table `connections` - contains connectionId,station1, station2, line 
- Table `events`- contains eventId, name, effect
- Table `stations` - contains stationId, name


## Data models

function User(userId, username, hashedPwd, salt, bestResult ) {
  this.userId = userId;
  this.username = name;
  this.hashedPwd = hashedPwd;
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



## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
