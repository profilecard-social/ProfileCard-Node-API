import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import { getCardHitsByID } from "../db/CardHitQuerries.js";
import authedChannel from "./generic/authedChannel.js";

export default (socket, body, callback) => {
    authedChannel(socket, body, callback, async (user) => {

        if (!body.timespan) {
            fail(callback, Codes.WrongArguments)
            return;
        }

        let timespan = body.timespan;
        let user_id = user.id;

        const allowedTimes = ['total', 'last_minute', 'last_five_minutes', 'last_fifteen_minutes', 'last_hour', 'last_7_days', 'last_24_hours', 'today', 'week', 'month', 'year', 'last_30_days'];

        if (allowedTimes.includes(timespan)) {
            const hits = await getCardHitsByID(user_id, timespan);
            const data = []
            for (let hit of hits) {
                const hitObj = {
                    id: hit.id,
                    user_id: hit.user_id,
                    hashed_ip: hit.hashed_ip,
                    created_at: hit.created_at
                };
                data.push(hitObj);
            }

            success(callback, { body: { hits: data } });
        } else {
            fail(callback, Codes.WrongArguments)
        }
        
    });
}