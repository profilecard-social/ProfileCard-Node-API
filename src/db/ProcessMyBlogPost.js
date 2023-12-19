import { mysql } from "../Server.js";
import { fail } from "../response/Response.js";
import Codes from "../response/Codes.js";

export function updatePostParam(
  idParamName,
  idParamValue,
  paramName,
  paramValue,
  callback
) {
  return new Promise(function (resolve, reject) {
    mysql.query(
      `UPDATE myblog_posts SET ${paramName} = ? WHERE ${idParamName} = ? LIMIT 1`,
      [paramValue, idParamValue],
      function (err) {
        if (err) {
          reject(err);
          fail(callback, Codes.ServerError);
        }
        resolve();
      }
    );
  });
}

export async function createMyBlogPost(cardID, timestamp, text, hidden, callback) {
  return new Promise(function (resolve, reject) {
    mysql.query(
      "INSERT INTO myblog_posts (cardID, timestamp, text, hidden) VALUES (?, ?, ?, ?)",
      [cardID, timestamp, text, hidden],
      function (err) {
        if (err) {
          reject(err);
          return fail(callback, Codes.ServerError);
        }
        resolve();
      }
    );
  });
}

export async function deleteMyBlogPost(id, callback) {
  return new Promise(function (resolve, reject) {
    mysql.query("DELETE FROM myblog_posts WHERE id = ?", [id], function (err) {
      if (err) {
        reject(err);
        return fail(callback, Codes.ServerError);
      }
      resolve();
    });
  });
}

export async function getMyBlogPostsByUserID(id, callback = () => { }) {
  return new Promise((resolve, reject) => {
      mysql.query(`SELECT * FROM myblog_posts WHERE cardID  = ? ORDER by id DESC`, [id], function (err, results) {
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
