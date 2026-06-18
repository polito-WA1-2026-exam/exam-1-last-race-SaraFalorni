import sqlite from 'sqlite3';
import crypto from "crypto";
import db from "./db.js";
import {User} from "./models.js";

export default function UserDao() {

    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE userId=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                else if (row === undefined) {
                    resolve({error: 'User not found.'});
                } else {
                    resolve(new User(row.userId, row.username, row.bestResult));
                }
            });
        });
    };

     this.getUserByCredentials = (username, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username=?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {
                    const user = new User(row.userId, row.username, row.bestResult);
                    
                    crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { 
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.hashedPassword, 'hex'), hashedPassword)) 
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    };

    this.updateBestResult = (userId, score) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users SET bestResult = ? 
                           WHERE userId = ? AND (bestResult IS NULL OR bestResult < ?)`;

            db.run(query, [score, userId, score], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    };

    this.getRanking = () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT userId, username, bestResult
                FROM users
                WHERE bestResult IS NOT NULL
                ORDER BY bestResult DESC, username ASC`;

            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const ranking = rows.map((row, index) => ({
                        position: index + 1,
                        username: row.username,
                        bestResult: row.bestResult
                    }));

                    resolve(ranking);
                }
            });
        });
    };

}



