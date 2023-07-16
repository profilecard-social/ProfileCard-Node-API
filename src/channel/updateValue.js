import {getUsersWithToken} from "../db/UserQueries.js";
import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {updateUserParam} from "../db/UserUpdates.js";
import authedChannel from "./generic/authedChannel.js";

export default async (socket, body, callback) => {

    authedChannel(socket, body, callback, async (user) => {

        const key = body.key;
        const value = body.value;

        if (!key || !value) {
            fail(callback, Codes.WrongArguments);
            return;
        }

        const allowedKeys = [ "status", "buttoncolor", "textcolor", "bgcolor", "theme", "lang" ];

        if (!allowedKeys.includes(key)) {
            fail(callback, Codes.Forbidden);
            return;
        }

        await updateUserParam("token", body.token, key, value);
        success(callback, Codes.Success);

    });

}