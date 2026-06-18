import sqlite from 'sqlite3';
import db from "./db.js";
import {Connection} from "./models.js";

export default function ConnectionDao() {

    this.getAllConnections = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM connections';
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const connections = rows.map(row => new Connection(row.connectionId, row.station1, row.station2, row.line));
                    resolve(connections);
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
                        const connectionMap = new Map(
                            rows.map(row => [row.connectionId, new Connection(row.connectionId, row.station1, row.station2, row.line)])
                        );

                        const orderedConnections = connectionIds.map(id => connectionMap.get(id));

                        resolve(orderedConnections);
                    }
            });
        });
    };
}