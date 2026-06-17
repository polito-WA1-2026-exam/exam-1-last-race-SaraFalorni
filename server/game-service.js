import UserDao from "./dao-user.js";
import StationDao from "./dao-station.js";
import ConnectionDao from "./dao-connection.js";
import EventDao from "./dao-event.js";

import dayjs from 'dayjs';

const GAME_DURATION_MS = 90000; //milliseconds
const GAME_DURATION_S = 90; //seconds
const INITIAL_COINS = 20;
const MIN_DISTANCE = 3;

export default function GameService(stationDao, connectionDao, eventDao, userDao) {
    this.startNewGame = async() => {
        const stations = await stationDao.getAllStations();
        const connections = await connectionDao.getAllConnections();
        
        const { startStation, destinationStation } = chooseRandomStartAndDestination(stations, connections);
    
        const stationById = new Map(stations.map(station => [station.stationId, station]));

        const availableConnections = connections.map(connection => ({
            connectionId: connection.connectionId,
            station1: connection.station1,
            station1Name: stationById.get(connection.station1).name,
            station2: connection.station2,
            station2Name: stationById.get(connection.station2).name,
            line: connection.line
        }));

        const gameSession = {startStationId: startStation.stationId, 
                             destinationStation: destinationStation.stationId,
                             startedAt: dayjs().valueOf() };
        
        const clientGame = {startStation, 
                            destinationStation, 
                            availableConnections, 
                            durationSeconds: GAME_DURATION_S};
        
        return {gameSession, clientGame};
    };

    this.submitRoute = async (userId, currentGame, connectionIds ) => {
        if(!currentGame) {
            return {
                valid: false,
                reason: 'No active current game',
                finalScore: 0
            };
        }

        //checks if the submission was made after the deadline (due to network latency etc.)
        const GRACEPERIOD_MS = 2000;
        if(dayjs.diff(currentGame.startedAt) > GAME_DURATION_MS + GRACEPERIOD_MS) {
            await userDao.updateBestResult(userId, 0); //game is played, score is 0
            return {
                valid: false,
                reson: 'Time expired',
                finalScore: 0
            };
        }

        if(connectionIds.length === 0) {
            await userDao.updateBestResult(userId,0); //the game is considered played

            return {
                valid: false,
                reason: 'No route selected',
                finalScore: 0
            };
        }

        //check server side
        const hasDuplicates = new Set(connectionIds).size !== connectionIds.length;

        if(hasDuplicates) {
            await userDao.updateBestResult(userId, 0);

            return {
                valid: false,
                reason: "A connection can't be used more than once",
                finalScore: 0
            };
        }

        const connections = await connectionDao.getConnectionsByIds(connectionIds);
        if(connections.some(connection => connection === undefined)) {
            await userDao.updateBestResult(userId,0); 

            return {
                valid: false,
                reason: "At least a connection doesn't exists",
                finalScore: 0
            };
        }

        const validation = validateRoute(connections, currentGame.startStationId, currentGame.destinationStationId);

        if(!validation.valid) {
            await userDao.updateBestResult(userId,0); 

            return {
                valid: false,
                reason: validation.reason,
                finalScore: 0
            };
        }

        let coins = INITIAL_COINS;
        const stepsTaken = [];

        const events = await eventDao.getAllEvents();
        if(events.length === 0)
            throw new Error('No events available');

        for(let i = 0; i < connections.length; i++) {
            const connection = connections[i];
            const orientedStep = validation.orientedSteps[i];

            const event = events[Math.floor(Math.random() * events.length)];

            coins += event.effect;

            stepsTaken.push({
                connectionId: connection.connectionId,
                fromStation: orientedStep.fromStation,
                toStation: orientedStep.toStation,
                line: connection.line,
                event,
                coinsAfterStep: coins
            });
        }

        const finalScore = Math.max(0, coins);

        await userDao.updateBestResult(userId, finaleScore);

        return {
            valid: true,
            initialCoins: INITIAL_COINS,
            stepsTaken,
            finalScore
        };
    };   
}

//utils functions
function chooseRandomStartAndDestination(stations, connections) {
    const graph = buildGraph(connections);
    const stationById = new Map(stations.map(station => [station.stationId, station]));

    const candidateStations = [];

    for(const startStation of stations) {
        const distances = computeDistances(startStation.stationId, graph);

        for(const [destinationStationId, distance] of distances.entries()) {
            if(destinationStationId !== startStation.stationId && distance >= MIN_DISTANCE) {
                candidateStations.push({
                    startStation,
                    destinationStation: stationById.get(destinationStationId)
                });
            }
        }
    }

    if(candidateStations.length === 0) {
        throw new Error('No valid start destination station pair found');
    }

    const randomIndex = Math.floor(Math.random() * candidateStations.length);
    return candidateStations[randomIndex];
}

function buildGraph(connections) {
    const graph = new Map();

    for(const connection of connections) {
        if(!graph.has(connection.station1)) {
            graph.set(connection.station1, []);
        }

        if(!graph.has(connection.station2)) {
            graph.set(connection.station2, []);
        }

        graph.get(connection.station1).push(connection.station2);
        graph.get(connection.station2).push(connection.station1);
    }

    return graph;
}

function computeDistances(startStationId, graph) {
    const distances = new Map();
    const stationQueue = [startStationId];

    distances.set(startStationId,0);

    let queueHead = 0;
    while(queueHead < stationQueue.length) {
        const currentStationId = stationQueue[queueHead++];
        const currentDistance = distances.get(currentStationId);

        const neighbors = graph.get(currentStationId) || [];

        for(const neighbor of neighbors) {
            if(!distances.has(neighbor)) {
                distances.set(neighbor, currentDistance + 1);
                stationQueue.push(neighbor);
            }
        }
    }

    return distances;
}


function validateRoute(connections, startStation, destinationStation) {
    let currentStation = startStation;

    const orientedSteps = [];

    for(const connection of connections) {
        let nextStation;

        if(connection.station1 === currentStation) {
            nextStation = connection.station2;
        }
        else if(connection.station2 === currentStation) {
            nextStation = connection.station1;
        }
        else {
            return {
                valid: false,
                reason: "Route isn't continuous"
            };
        }

        orientedSteps.push({
            connectionId: connection.connectionId,
            fromStation: currentStation,
            toStation: nextStation
        });

        currentStation = nextStation; //next step
    }

    //check that it arrived at the end
    if(currentStation !== destinationStation) {
        return {
                valid: false,
                reason: "Route isn't complete"
            };
    }

    //route is valid
    return {
        valid: true,
        orientedSteps
    };
}
