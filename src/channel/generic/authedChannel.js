import {fail} from "../../response/Response.js";
import Codes from "../../response/Codes.js";
import {getUsersWithToken} from "../../db/UserQueries.js";

export default async (socket, body, callback, authedCallback) => {

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
    authedCallback(user);
}
