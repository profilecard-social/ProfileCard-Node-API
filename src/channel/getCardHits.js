import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {getUsersWithToken} from "../db/UserQueries.js";
import { getCardHitsByID } from "../db/CardHitQuerries.js";

export default async (socket, body, callback) => {

    if (!body.token) {
        fail(callback, Codes.InvalidToken);
        return;
    }

    const usersWithToken = await getUsersWithToken(body.token);

    if (usersWithToken <= 0) {
        fail(callback, Codes.InvalidToken);
        return;
    }

    const user = usersWithToken[0];

    const cardhits = await getCardHitsByID(user.id);

    const data = []

    for (let hit of cardhits) {
        const hitObj = {
            id: hit.id,
            user_id: hit.user_id,
            hashed_ip: hit.hashed_ip,
            created_at: hit.created_at
        };
        data.push(hitObj);
    }

    success(callback, { body: { hits: data } });
};