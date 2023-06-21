import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {getUsersWithEmail} from "../db/UserQueries.js";
import {comparePassword} from "../util/Encryption.js";

export default async (socket, body, callback) => {

    const email = body.email;
    const password = body.password;

    if (!email || !password) {
        fail(callback, Codes.InsufficientCredentials);
        return;
    }

    if (!email || !password) {
        fail(callback, Codes.InsufficientCredentials);
        return;
    }

    const users = await getUsersWithEmail(email, callback);

    if (users.length <= 0) {
        fail(callback, Codes.InvalidCredentials);
        return;
    }

    if (!(comparePassword(password, users[0].passwordHash))) {
        fail(callback, Codes.InvalidCredentials);
        return;
    }

    success(callback, { body: { token: users[0].token } })


}
