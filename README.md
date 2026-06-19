# Exam #N: "Last Race"
## Student: s353341 Falorni Sara

## React Client Application Routes

- Route `/`: home page (displays the game rules, login button)
- Route `/login`: login page
- Route `/ranking`: ranking page
- Route `/game`: 
- Route `*` : page not found


## API Server

## Authentication

### `GET /api/sessions/current`

- Response body:

```json
{
  "userId": 1,
  "username": "sara",
  "bestResult": "24",
}
```
- Status codes: `200 OK`, `401 Unauthorized`, `500 Internal Server Error`

### `POST /api/sessions/current`

- Request body:

```json
{
  "username": "sara",
  "password": "password"
}
```

- Response body:

```json
{
  "userId": 1,
  "username": "sara",
  "bestResult": "24",
}
```

- Status codes: `200 OK`, `404 Not Found` , `500 Internal Server Error`, `422 Unprocessable Entity` 

### `DELETE /api/sessions/current`

- Request body: none
- Response body: none

- Status codes: `200 OK`, `500 Internal Server Error`

## Game

### `POST /api/games`

starts a new game for a logged in user (assigns random start and destination stations and returns all available connections in the network)

- Request body: none
- Response bod: 

```json
{
  "startStation": { "stationId": 1, "name": "Anellini Alley" },
  "destinationStation": { "stationId": 4, "name": "Rigatoni Road" },
  "availableConnections": [
    {
      "connectionId": 1,
      "station1": 1,
      "station1Name": "Anellini Alley",
      "station2": 2,
      "station2Name": "Pici Path",
      "line": "Egg"
    }
  ],
  "durationSeconds": 90
}
```
- Status codes: `200 OK`, `401 Unauthorized`, `500 Internal Server Error`

### `POST /api/games/current/route`

submits user's route, the server validates it and applies the random events, finally computes the score

- Request body: the ordered list of selected segment ids

```json
{
  "connectionIds": [1, 2, 3]
}
```

- Response body (valid route):

```json
{
  "valid": true,
  "initialCoins": 20,
  "stepsTaken": [
    {
      "connectionId": 1,
      "fromStation": 1,
      "toStation": 2,
      "line": "Egg",
      "event": { "eventId": 7, "name": "Train Arrives Early", "effect": 1 },
      "coinsAfterStep": 21
    }
  ],
  "finalScore": 21
}
```

- Response body (invalid route):

```json
{
  "valid": false,
  "reason": "A connection can't be used more than once",
  "finalScore": 0
}
```

- Status codes: `200 OK`, `401 Unauthorized`, `422 Unprocessable Entity` (invalid body), `500 Internal Server Error`

## Ranking

### `GET /api/ranking`
returns the ranking in descending order, including only users that played at least one game (user.bestResult == NULL means no game has been played yet)

- Response body:

```json
[
  { "position": 1, "username": "sara", "bestResult": 24 },
  { "position": 2, "username": "marco", "bestResult": 5 }
]
```

- Status codes: `200 OK`, `401 Unauthorized`, `500 Internal Server Error`


## Database Tables

- Table `users` - contains userId, username,  hashedPassword, salt, bestResult
- Table `connections` - contains connectionId,station1, station2, line 
- Table `events`- contains eventId, name, effect
- Table `stations` - contains stationId, name


## Data models

```js
function User(userId, username, bestResult ) {
  this.userId = userId;
  this.username = name;
  this.bestResult = bestResult;
}
```

```js
function Connection(connectionId, station1, station2, line) {
  this.connectionId = connectionId;
  this.station1 = station1;
  this.station2 = station2;
  this.line = line;
}
```

```js
function Event(eventId, name, effect) {
  this.eventId = eventId;
  this.name = name;
  this.effect = effect;
}
```

```js
function Station(stationId, name) {
  this.stationId = stationId;
  this.name = name;
}
```



## Main React Components

# design stage (modify after implementation)
to add descriptions
- `LoginForm`
  - `LoginForm`
  - `DoLoginButton`
- `Navbar` : received props user.userId 
- `HomePage`
  - `GameInstructions`
  - `LoginButton`
- `RankingPage`
- `ConnectionList`
- `GamePage`
- `SetUpPhase`
  - `Map`
  - `StartGameButton`
- `PlanningPhase` 
  - `NetworkMap`
  - `Timer`
- `ExecutionPhase` 
  - `some button`
- `SummaryPhase`
  - `FinalScore`
  - `some button`


(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.

- Database population
- Game rules description in `Homepage`


### check TO DO
- errors in user authentication if user inserts wrong password
- controlli al serialize and deserialize della sessione, check se la sessione esiste sempre in dserialize etc.
- middleware checks for all the apis
