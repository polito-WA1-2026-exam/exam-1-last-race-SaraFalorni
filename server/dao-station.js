import db from "./db.js";
import {Station} from "./models.js";

export default function StationDao() {

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