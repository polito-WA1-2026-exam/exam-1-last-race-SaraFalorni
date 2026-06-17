import sqlite from 'sqlite3';
import db from "./db.js"

export default function EventDao() {

    this.getAllEvents = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM events';
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };
}