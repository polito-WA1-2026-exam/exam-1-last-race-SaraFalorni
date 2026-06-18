import sqlite from 'sqlite3';
import db from "./db.js";
import {Event} from "./models.js"

export default function EventDao() {

    this.getAllEvents = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM events';
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const events = rows.map(row => new Event(row.eventId, row.name, row.effect));
                    resolve(events);
                }
            });
        });
    };
}