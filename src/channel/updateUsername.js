import { fail, success } from "../response/Response.js";
import Codes from "../response/Codes.js";
import { comparePassword, generateNewToken, generatePasswordHash } from "../util/Encryption.js";
import { updateUserParam } from "../db/UserUpdates.js";
import fs from "fs";
import authedChannel from "./generic/authedChannel.js";
import { getLinksByUsername } from "../db/LinkQuerries.js";
import { updateUsernameByLinkID } from "../db/LinkUpdates.js";
import config from "../../config.json" assert { type: "json" };
import md5 from "md5";
import { getUsersWithName } from "../db/UserQueries.js";

const documentRoot = config.upload_directory;
export default (socket, body, callback) => {

    authedChannel(socket, body, callback, async (user) => {

        const currentPassword = body.currentPassword;
        let newName = body.newName;
        const username = user.name;

        newName = newName.replaceAll(' ', '');

        if (!currentPassword) {
            fail(callback, Codes.InsufficientCredentials);
            return;
        }

        if (!comparePassword(currentPassword, user.passwordHash)) {
            fail(callback, Codes.WrongCurrentPassword);
            return;
        }

        if ((await getUsersWithName(newName, callback)).length > 0) {
            fail(callback, Codes.UsernameTaken);
            return;
        }
        
        const links = await getLinksByUsername(user.name);

        for (let link of links) {
            await updateUsernameByLinkID(newName, link.id, callback);
        }

        fs.stat(`${documentRoot}/${md5(username.toLowerCase())}.webp`, function(err, stat) {
            if (err == null) {
                fs.rename(`${documentRoot}/${md5(username.toLowerCase())}.webp`,  `${documentRoot}/${md5(newName.toLowerCase())}.webp`, err => {
                    if (err) {
                        fail(callback, Codes.ServerError)
                        console.error(err);
                        return;
                    }        
                });
            }
          });

      

        await updateUserParam("token", body.token, "name", newName);
        success(callback, Codes.Success);

    });

}