import { fail, success } from "../response/Response.js";
import Codes from "../response/Codes.js";
import authedChannel from "./generic/authedChannel.js";
import { getLinkHitsByID, getLinksByUsername } from "../db/LinkQuerries.js";

export default (socket, body, callback) => {

    authedChannel(socket, body, callback, async (user) => {

        const links = await getLinksByUsername(user.name);

        let count = 0;

        for (let link of links) {
            const hitsCount = await getLinkHitsByID(link.id);
            count += hitsCount;
        }
        
        success(callback, { body: { links: count } });
    });

};