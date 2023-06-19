import {fail} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {getUsersWithEmail} from "../db/UserQueries.js";

export default async (socket, msg, callback) => {

    const email = msg.email;
    const password = msg.password;

    if (!email || !password) {
        fail(callback, Codes.InsufficientCredentials);
        return;
    }

    var users = (async () => getUsersWithEmail(email, callback));



}
