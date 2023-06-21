import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {getUsersWithToken} from "../db/UserQueries.js";
import {getLinksByUsername} from "../db/LinkQuerries.js";

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

    var user = usersWithToken[0];

    var links = getLinksByUsername(user[0].name);

    const data = []

    for (let link in links) {
        const link = {
            name: link.name,
            url: link.url
        }
        data.push(link);
    }

    success(callback, { body: { links: data } });
};