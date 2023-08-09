import { fail, success } from "../response/Response.js";
import Codes from "../response/Codes.js";
import { getCardHitsByID } from "../db/CardHitQuerries.js";
import authedChannel from "./generic/authedChannel.js";

export default (socket, body, callback) => {
  authedChannel(socket, body, callback, async (user) => {
    if (!body.timespan) {
      fail(callback, Codes.WrongArguments);
      return;
    }

    const timespan = body.timespan;
    const user_id = user.id;
    const hits = await getCardHitsByID(user_id, timespan);

    let countPerMonthAndYear = {};
    const locale = "en-US";

    for (let hit of hits) {
        const date = new Date(hit.created_at * 1000);
        let dateStr = "";

        if(timespan == "total") {
            dateStr = date.toLocaleString(locale, { year: 'numeric', month: 'short' });
        } else {
            dateStr = new Intl.DateTimeFormat(locale, {weekday: 'short'}).format(date);
        }
  
        countPerMonthAndYear[dateStr] = (countPerMonthAndYear[dateStr] || 0) + 1;
      }
  
      const dataForChart = Object.entries(countPerMonthAndYear).map(([date, count]) => ({
        date,
        count,
      }));
  
      dataForChart.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (dataForChart.length > 0) {
      success(callback, { body: { hits: dataForChart } });
    } else {
      fail(callback, Codes.NoData);
    }
  });
};
