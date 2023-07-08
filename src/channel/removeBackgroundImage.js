import fs from "fs";
import md5 from "md5";
import {getUsersWithToken} from "../db/UserQueries.js";
import Codes from "../response/Codes.js";
import {fail, success} from "../response/Response.js";

import config from "../../config.json" assert { type: "json" };

const documentRoot = config.upload_directory;

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
    const user = usersWithToken[0];
    const username = user.name;

    fs.unlink(`${documentRoot}/bg_${md5(username.toLowerCase())}.png`, imageFile, err => {
        if (err) {
            fail(callback, Codes.ServerError)
            console.error(err);
            return;
        }

        success(callback, Codes.Success)
    });

}

