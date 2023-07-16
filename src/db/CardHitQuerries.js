import {mysql} from "../Server.js";
import {fail} from "../response/Response.js";
import Codes from "../response/Codes.js";

function getTimeDifference(strTime) {
    switch (strTime) {
      default:
      case "total":
        return 0;
      case "last_minute":
        return Math.floor(Date.now() / 1000) - 60;
      case "last_five_minutes":
        return Math.floor(Date.now() / 1000) - 300;
      case "last_fifteen_minutes":
        return Math.floor(Date.now() / 1000) - 900;
      case "last_hour":
        return Math.floor(Date.now() / 1000) - 3600;
      case "last_7_days":
        return Math.floor(Date.now() / 1000) - 604800;
      case "last_24_hours":
        return Math.floor(Date.now() / 1000) - 86400;
      case "today":
        return Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
      case "week":
        const monday = new Date();
        monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
        return Math.floor(monday.setHours(0, 0, 0, 0) / 1000);
      case "month":
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);
        return Math.floor(firstDayOfMonth / 1000);
      case "year":
        const firstDayOfYear = new Date();
        firstDayOfYear.setMonth(0, 1);
        firstDayOfYear.setHours(0, 0, 0, 0);
        return Math.floor(firstDayOfYear / 1000);
      case "last_30_days":
        return Math.floor(Date.now() / 1000) - 2592000;
    }
  }

export async function getCardHitsByID(user_id, timespan, callback = () => {}) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM hits WHERE user_id = ?';
      const params = [user_id];
  
      if (timespan) {
        const until = getTimeDifference(timespan);
        sql += ' AND created_at > ?';
        params.push(until);
      }
  
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