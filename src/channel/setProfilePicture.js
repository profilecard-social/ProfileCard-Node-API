import fs from "fs";
import md5 from "md5";
import {getUsersWithToken} from "../db/UserQueries.js";
import Codes from "../response/Codes.js";
import {fail, success} from "../response/Response.js";

export default (socket, msg, callback) => {
    const rememberToken = msg.rememberToken;
    const imageData = msg.image;

    getUsersWithToken(rememberToken, callback).then(users => {
        if (users.length === 0) {
            fail(callback, { code: 415, message: "" })
            return;
        }

        const tokenData = users[0];
        const username = tokenData.name;
        const imageFile = Buffer.from(imageData, 'base64');

        fs.writeFile(`/var/www/profilecard.social/uploads/${md5(username.toLowerCase())}.png`, imageFile, err => {
            if (err) {
                fail(callback, Codes.ServerError)
                console.error(err);
                return;
            }

            success(callback, Codes.Success)
        });1

    });

}

