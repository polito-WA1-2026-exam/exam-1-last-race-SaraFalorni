import sqlite from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite.Database('./lastRace.sqlite', (err) => {if (err) throw err;});

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS users`);
    db.run(`DROP TABLE IF EXISTS stations`);
    db.run(`DROP TABLE IF EXISTS connections`);
    db.run(`DROP TABLE IF EXISTS events`);

    // users
    db.run(`CREATE TABLE users(
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        hashedPassword TEXT NOT NULL, 
        salt TEXT NOT NULL, 
        bestResult INTEGER
        )`
    );

    //stations
    db.run(`CREATE TABLE stations(
        stationId INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
        )`    
    );

    //events
    db.run(`CREATE TABLE events(
        eventId INTEGER  PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        effect INTEGER NOT NULL
        )`
    );

    //connections
    db.run(`CREATE TABLE connections(
        connectionId INTEGER PRIMARY KEY AUTOINCREMENT,
        station1 INTEGER NOT NULL,
        station2 INTEGER NOT NULL,
        line TEXT NOT NULL,
        FOREIGN KEY (station1) REFERENCES stations(stationId),
        FOREIGN KEY (station2) REFERENCES stations(stationId) 
        )`
    );
});

//db population with seed data
const insertEvent = db.prepare(`INSERT INTO events (name, effect) VALUES (?,?)`);
insertEvent.run();

const insertStation = db.prepare(`INSERT INTO stations (name) VALUES (?)`);
insertStation.run("");

const insertConnection = db.prepare(`INSERT INTO connections (station1, station2, line) VALUES (?,?,?)`);
insertConnection.run();

//capire come hashare la pwd

const insertUser = db.prepare(`INSERT INTO users (username, hashedPassword, salt) VALUES (?,?,?)`)



db.close();


