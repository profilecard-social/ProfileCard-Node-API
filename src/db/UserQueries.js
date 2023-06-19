import {mysql} from "../Server.js";
import {fail} from "../response/Response.js";
import Codes from "../response/Codes.js";

export async function getUsersByParam(paramName, paramValue, callback = () => {}) {
    return new Promise((resolve, reject) => {
        mysql.query(`SELECT * FROM users WHERE ${paramName} = ?`, [paramValue], function (err, results) {
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

export async function getUsersWithToken(token, callback = () => {}) {
    return getUsersByParam("token", token, callback);
}

export async function getUsersWithName(name, callback = () => {}) {
    return getUsersByParam("name", name, callback);
}

export async function getUsersWithEmail(email, callback = () => {}) {
    return getUsersByParam("email", email, callback);
}
