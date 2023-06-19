import {mysql} from "../Server.js";
import {fail} from "../response/Response.js";
import Codes from "../response/Codes.js";

export async function getPunishments(target, type, callback = () => {}) {
    return new Promise((resolve, reject) => {
        mysql.query("SELECT * FROM punishments WHERE target = ? and type = ?", [target, type], function (err, results) {
            if (err) {
                reject(err)
                fail(callback, Codes.ServerError)
                console.error(err);
                return;
            }

            resolve(results);
        });
    });
}