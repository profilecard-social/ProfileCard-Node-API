import {mysql} from "../Server.js";
import {fail} from "../response/Response.js";
import Codes from "../response/Codes.js";

export async function getCardHitsByID(user_id, callback = () => {}) {
    return new Promise((resolve, reject) => {
        mysql.query(`SELECT * FROM hits WHERE user_id = ?`, [user_id], function (err, results) {
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
