import sqlite from 'sqlite3';
import {Event} from "models.js";
import db from "./db.js"

export default function EventDao() {

    this.getRandomEvent = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM events ORDER BY RANDOM() LIMIT 1';
            db.get(query, [], (err, row) => {
                if (err) {
                    reject(err);
                }
                else if (row === undefined) {
                    resolve({error: 'Event not found.'});
                } else {
                    resolve(row);
                }
            });
        });
    };
}