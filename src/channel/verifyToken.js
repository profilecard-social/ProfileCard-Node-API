import {getUsersWithToken} from "../db/UserQueries.js";
import Codes from "../response/Codes.js";
import {fail, success} from "../response/Response.js";
import {updateUserParam} from "../db/UserUpdates.js";

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

    success(callback, Codes.Success);

    console.log("Verified user: " + usersWithToken[0].name);

    await updateUserParam("token", body.token, "last_seen_at", Math.floor(Date.now() / 1000))
}
