import db from "./db.js";
import {Station} from "./models.js";

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
                    resolve(new Station(row.stationId, row.name));
                }
            });
        });
    };

    this.getAllStations =() => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM stations';
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const stations = rows.map(row => new Station(row.stationId, row.name));
                    resolve(stations);
                }
            });
        });
    };
}