import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import { getCardHitsByID } from "../db/CardHitQuerries.js";
import authedChannel from "./generic/authedChannel.js";

export default (socket, body, callback) => {
    authedChannel(socket, body, callback, async (user) => {

        if (!body.timespan) {
            fail(callback, Codes.ServerError)
            return;
        }

        let timespan = body.timespan;
        let user_id = user.id;

        switch (timespan) {
            case 'today': {

                const hits = await getCardHitsByID(user_id, 'today');
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

                break;
            }

            case 'last_24_hours': {

                const hits = await getCardHitsByID(user_id, 'last_24_hours');
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

                break;
            }

            case 'last_hour': {

                const hits = await getCardHitsByID(user_id, 'last_hour');
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

                break;
            }

            case 'last_30_days': {

                const hits = await getCardHitsByID(user_id, 'last_30_days');
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

                break;
            }
            case 'month': {

                const hits = await getCardHitsByID(user_id, 'month');
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

                break;
            }

            case 'week': {

                const hits = await getCardHitsByID(user_id, 'week');
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

                break;
            }
        }
    });
}