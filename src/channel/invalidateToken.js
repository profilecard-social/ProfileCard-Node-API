import {getUsersWithToken} from "../db/UserQueries.js";
import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {updateUserParam} from "../db/UserUpdates.js";
import {generateNewToken} from "../util/Encryption.js";
import authedChannel from "./generic/authedChannel.js";

export default (socket, body, callback) => {

    authedChannel(socket, body, callback, async (user) => {

        const newToken = generateNewToken();

        await updateUserParam("token", body.token, "token", newToken);
        success(callback, Codes.Success);

    });

}