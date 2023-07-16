import { fail, success } from "../response/Response.js";
import authedChannel from "./generic/authedChannel.js";
import { getCardReferrerByID } from "../db/CardReferrerQuerrie.js";

export default (socket, body, callback) => {
    authedChannel(socket, body, callback, async (user) => {

        let user_id = user.id;

        const referrers = await getCardReferrerByID(user_id);
        const data = []
        for (let referrer of referrers) {
            const refObj = {
                id: referrer.id,
                cardid: referrer.cardid,
                ref: referrer.ref,
                ref_host: referrer.ref_host,

            };
            data.push(refObj);
        }

        success(callback, { body: { referrers: data } });

    });
}