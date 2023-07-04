import {mysql} from "../Server.js";
import {fail} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {getHighestSortIdByUsername} from "./LinkQuerries.js";

export async function updateLinkByUsername(username, id, sortId, name, url, callback = () => {}) {
    return new Promise((resolve, reject) => {
        mysql.query(`UPDATE links SET sort_id = ?, name = ?, url = ? WHERE id = ? AND username = ? LIMIT 1`, [sortId, name, url, id, username], function (err) {
            if (err) {
                reject(err)
                console.error(err);
                fail(callback, Codes.ServerError);
                return;
            }

            resolve();
        })
    });
}

export async function createLink(username, name, url, callback = () => {}) {
    return new Promise((resolve, reject) => {
        mysql.query(
            `INSERT INTO links (username, name, url, prevOwner, sort_id)
       SELECT ?, ?, ?, ?, MAX(sort_id) + 1
       FROM links
       WHERE username = ?`,
            [username, name, url, username, username],
            function (err) {
                if (err) {
                    console.error(err);
                    reject(err);
                    fail(callback, Codes.ServerError);
                    return;
                }

                resolve();
            }
        );
    });
}

export async function deleteLink(username, id, callback = () => {}) {
    return new Promise((resolve, reject) => {
        mysql.query(`DELETE FROM links WHERE username = ? AND id = ? LIMIT 1`, [username, id], function (err) {
            if (err) {
                reject(err)
                console.error(err);
                fail(callback, Codes.ServerError);
                return;
            }

            resolve();
        })
    });
}