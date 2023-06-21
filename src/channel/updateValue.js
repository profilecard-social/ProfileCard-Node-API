import {getUsersWithToken} from "../db/UserQueries.js";
import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {updateUserParam} from "../db/UserUpdates.js";

export default async (socket, body, callback) => {

    console.log("a")

    if (!body.token) {
        fail(callback, Codes.InvalidToken);
        return;
    }

    const usersWithToken = await getUsersWithToken(body.token);

    if (usersWithToken <= 0) {
        fail(callback, Codes.InvalidToken);
        return;
    }

    const key = body.key;
    const value = body.value;

    if (!key || !value) {
        fail(callback, Codes.ServerError);
        return;
    }

    const allowedKeys = [ "status", "buttoncolor", "textcolor", "bgcolor", "theme", "lang" ];

    if (!allowedKeys.includes(key)) {
        fail(callback, Codes.Forbidden);
        return;
    }

    await updateUserParam("token", body.token, key, value);
    success(callback, Codes.Success);
}