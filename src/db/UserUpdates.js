import {mysql} from "../Server.js";
import {fail} from "../response/Response.js";
import Codes from "../response/Codes.js";

export function updateUserParam(idParamName, idParamValue, paramName, paramValue, callback) {
    return new Promise(function(resolve, reject) {
        mysql.query(`UPDATE users SET ${paramName} = ? WHERE ${idParamName} = ? LIMIT 1`, [paramValue, idParamValue], function(err) {
            if (err) {
                reject(err)
                fail(callback, Codes.ServerError);
            }
            resolve()
        });
    });
}

export async function createUser(username, email, token, passwordHash, status, callback) {
    return new Promise(function(resolve, reject) {
        mysql.query(
            "INSERT INTO users (name, email, token, passwordHash, status) VALUES (?, ?, ?, ?, ?)",
            [username, email, token, passwordHash, status],
            function(err) {
                if (err) {
                    reject(err)
                    return fail(callback, Codes.ServerError);
                }
                resolve()
            }
        );
    })
}