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


    //db population with seed data

    //events
    const insertEvent = db.prepare(`INSERT INTO events (name, effect) VALUES (?,?)`);

    const events = [
        ['Express Train Available', 4],
        ['Perfect Transfer', 3],
        ['Green Signal Wave', 3],
        ['Empty Carriage', 2],
        ['Platform Shortcut Open', 2],
        ['Fast Escalator', 1],
        ['Train Arrives Early', 1],
        ['Regular Stop', 0],
        ['Minor Platform Delay', -1],
        ['Crowded Platform', -1],
        ['Slow Train', -2],
        ['Missed Connection', -2],
        ['Signal Failure', -3],
        ['Track Maintenance', -3],
        ['Station Temporarily Closed', -4]
    ];

    events.forEach(([name, effect]) => insertEvent.run(name, effect));
    insertEvent.finalize();


    //stations
    const insertStation = db.prepare(`INSERT INTO stations (name) VALUES (?)`);

    const stations = [
        'Anellini Alley',
        'Pici Path',
        'Fusilli Crossing',
        'Rigatoni Road',
        'Spaghetti Plaza',
        'Fettuccine Avenue',
        'Timballo Terrace',
        'Ziti Terminal',
        'Vermicelli Court',
        'Ditali Dock',
        'Cappelletti Corner',
        'Penne Lane',
        'Mezzelune Park',
        'Ravioli Junction',
        'Gnocchi Gate',
        'Tagliatelle Terrace',
        'Tortelli Station',
        'Mezze Maniche Terminal',
        'Tortellini Tower',
        'Bucatini Gate',
        'Orecchiette Square',
        'Agnolotti Arcade',
        'Lasagna Hall',
        'Cannelloni Court',
        'Caserecce Plaza',
        'Farfalle Garden',
        'Maccheroni Market',
        'Linguine Bridge',
        'Conchiglie Airport'
    ];

    stations.forEach((station) => insertStation.run(station));
    insertStation.finalize();

    //connection

    const insertConnection = db.prepare(`INSERT INTO connections (station1, station2, line) 
                                        VALUES ((SELECT stationId FROM stations WHERE name = ?),
                                                (SELECT stationId FROM stations WHERE name = ?) ,?)`);
    const connections = [
        // Egg line
        ['Anellini Alley', 'Pici Path', 'Egg'],
        ['Pici Path', 'Fusilli Crossing', 'Egg'],
        ['Fusilli Crossing', 'Rigatoni Road', 'Egg'],
        ['Rigatoni Road', 'Spaghetti Plaza', 'Egg'],
        ['Spaghetti Plaza', 'Fettuccine Avenue', 'Egg'],
        ['Fettuccine Avenue', 'Timballo Terrace', 'Egg'],
        ['Timballo Terrace', 'Ziti Terminal', 'Egg'],

        // Flour line
        ['Vermicelli Court', 'Ditali Dock', 'Flour'],
        ['Ditali Dock', 'Cappelletti Corner', 'Flour'],
        ['Cappelletti Corner', 'Penne Lane', 'Flour'],
        ['Penne Lane', 'Mezzelune Park', 'Flour'],
        ['Mezzelune Park', 'Ravioli Junction', 'Flour'],
        ['Ravioli Junction', 'Spaghetti Plaza', 'Flour'],
        ['Spaghetti Plaza', 'Gnocchi Gate', 'Flour'],
        ['Gnocchi Gate', 'Tagliatelle Terrace', 'Flour'],
        ['Tagliatelle Terrace', 'Tortelli Station', 'Flour'],

        // Salt line
        ['Mezze Maniche Terminal', 'Tortellini Tower', 'Salt'],
        ['Tortellini Tower', 'Bucatini Gate', 'Salt'],
        ['Bucatini Gate', 'Fusilli Crossing', 'Salt'],
        ['Fusilli Crossing', 'Orecchiette Square', 'Salt'],
        ['Orecchiette Square', 'Ravioli Junction', 'Salt'],
        ['Ravioli Junction', 'Agnolotti Arcade', 'Salt'],
        ['Agnolotti Arcade', 'Lasagna Hall', 'Salt'],

        // Olive Oil line
        ['Cannelloni Court', 'Caserecce Plaza', 'Olive Oil'],
        ['Caserecce Plaza', 'Farfalle Garden', 'Olive Oil'],
        ['Farfalle Garden', 'Penne Lane', 'Olive Oil'],
        ['Penne Lane', 'Maccheroni Market', 'Olive Oil'],
        ['Maccheroni Market', 'Linguine Bridge', 'Olive Oil'],
        ['Linguine Bridge', 'Conchiglie Airport', 'Olive Oil']
    ];

    connections.forEach(([station1, station2, line]) => {insertConnection.run(station1, station2, line);});
    insertConnection.finalize();

    //users
    function hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.scryptSync(password, salt, 32).toString('hex');

        return { hashedPassword, salt };
    }

    const insertUser = db.prepare(`INSERT INTO users (username, hashedPassword, salt, bestResult) VALUES (?,?,?,?)`)

    const users = [
        { username: 'sara', password: 'password', bestResult: 10 },
        { username: 'marco', password: 'password', bestResult: 5 },
        { username: 'giulia', password: 'password', bestResult: 0 },
        { username: 'luca', password: 'password', bestResult: null }
    ];

    users.forEach((user) => {
        const { hashedPassword, salt } = hashPassword(user.password);
        insertUser.run(user.username, hashedPassword, salt, user.bestResult);
    });
    insertUser.finalize();
});

db.close();


