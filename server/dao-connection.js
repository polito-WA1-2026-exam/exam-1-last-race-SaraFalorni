import sqlite from 'sqlite3';
import {Connection} from "models.js";
import db from "./db.js"

export default function ConnectionDao() {

    this.getAllConnections = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM connections';
            db.get(query, [], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'Connections not found.'});
                } else {
                    resolve(row);
                }
            });
        });
    };

    this.getConnectionsByIds = (connectionIds) => {
    return new Promise((resolve, reject) => {
        if (connectionIds.length === 0) {
            resolve([]);
            return;
        }

        const placeholders = connectionIds.map(() => '?').join(',');
        const query = `SELECT * FROM connections WHERE connectionId IN (${placeholders})`;

        db.all(query, connectionIds, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const connections = rows.map(row =>
                    new Connection(row.connectionId, row.station1, row.station2, row.line)
                );

                const connectionMap = new Map(
                    connections.map(connection => [connection.connectionId, connection])
                );

                const orderedConnections = connectionIds.map(id => connectionMap.get(id));

                resolve(orderedConnections);
            }
        });
    });
};
}