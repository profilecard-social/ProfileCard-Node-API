import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {getUsersWithToken} from "../db/UserQueries.js";
import {getLinksByUsername} from "../db/LinkQuerries.js";
import authedChannel from "./generic/authedChannel.js";

export default (socket, body, callback) => {

    authedChannel(socket, body, callback, async (user) => {

        const links = await getLinksByUsername(user.name);

        const data = []

        for (let link of links) {
            const linkObj = {
                id: link.id,
                sortId: link.sort_id,
                name: link.name,
                url: link.url
            };
            data.push(linkObj);
        }

        success(callback, { body: { links: data } });

    });

};