import sqlite from 'sqlite3';
import {Station} from "models.js";
import db from "./db.js"

export default function StationDao() {

    //get Station given the stationId
    this.getStationById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM stations WHERE stationId=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                else if (row === undefined) {
                    resolve({error: 'Station not found.'});
                } else {
                    resolve(row);
                }
            });
        });
    };

    this.getAllStations =() => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM stations';
            db.get(query, [], (err, row) => {
                if (err) {
                    reject(err);
                }
                else if (row === undefined) {
                    resolve({error: 'Stations not found.'});
                } else {
                    resolve(row);
                }
            });
        });
    };
}