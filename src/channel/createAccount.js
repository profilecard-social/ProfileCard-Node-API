import {getUsersWithEmail, getUsersWithName} from "../db/UserQueries.js";
import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {getPunishments} from "../db/PunishmentQuerries.js";
import {binToHex, generateNewToken, generatePasswordHash, generateRandomBytes} from "../util/Encryption.js";
import {createUser, updateUserParam} from "../db/UserUpdates.js";
import {ctype_alnum} from "locutus/php/ctype/index.js";
import config from "../../config.json" assert { type: "json" };

export default async (socket, body, callback) => {

    const email = body.email;
    const password = body.password;
    const username = body.username;

    if (!email || !password || !username) {
        fail(callback, Codes.InsufficientCredentials);
        return;
    }

    if ((await getPunishments(username, 2, callback)).length > 0) {
        fail(callback, Codes.UsernameBanned);
        return;
    }

    if ((await getUsersWithEmail(username, callback)).length > 0) {
        fail(callback, Codes.EmailTaken);
        return;
    }

    if ((await getUsersWithName(username, callback)).length > 0) {
        fail(callback, Codes.UsernameTaken);
        return;
    }

    if (!ctype_alnum(username)) {
        fail(callback, Codes.InvalidSymbols);
        return;
    }

    let token = generateNewToken();
    let passwordHash = generatePasswordHash(password);

    await createUser(username, email, token, passwordHash, config.default_status, callback);

    await updateUserParam("name", username, "theme", 1, callback);
    await updateUserParam("name", username, "lang", "en", callback);
    success(callback, { body: { token: token } });

}