import {mysql} from "../Server.js";
import {fail} from "../response/Response.js";
import Codes from "../response/Codes.js";

export async function getLinksByUsername(username, callback = () => {}) {
    return new Promise((resolve, reject) => {
        mysql.query(`SELECT * FROM links WHERE username = ?`, [username], { charset: 'utf8mb4' }, function (err, results) {
            if (err) {
                reject(err)
                console.error(err);
                fail(callback, Codes.ServerError);
                return;
            }

            resolve(results);
        })
    });
}
