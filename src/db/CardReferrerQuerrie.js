import { mysql } from "../Server.js";
import { fail } from "../response/Response.js";
import Codes from "../response/Codes.js";

export async function getCardReferrerByID(user_id, callback = () => { }) {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM referrer WHERE cardid = ?';
    const params = [user_id];

    mysql.query(sql, params, function (err, results) {
      if (err) {
        reject(err);
        console.error(err);
        fail(callback, Codes.ServerError);
        return;
      }

      resolve(results);
    });
  });
}