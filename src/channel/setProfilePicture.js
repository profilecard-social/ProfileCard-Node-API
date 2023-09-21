import fs from "fs";
import md5 from "md5";
import {getUsersWithToken} from "../db/UserQueries.js";
import Codes from "../response/Codes.js";
import {fail, success} from "../response/Response.js";

import config from "../../config.json" assert { type: "json" };
import authedChannel from "./generic/authedChannel.js";

const documentRoot = config.upload_directory;

export default async (socket, body, callback) => {

    authedChannel(socket, body, callback, async (user) => {

        const username = user.name;

        if (!body.image) {
            fail(callback, Codes.WrongArguments)
            return;
        }

        const imageData = body.image;
        const imageFile = Buffer.from(imageData, 'base64');

        fs.writeFile(`${documentRoot}/${md5(username.toLowerCase())}.webp`, imageFile, err => {
            if (err) {
                fail(callback, Codes.ServerError)
                console.error(err);
                return;
            }

            success(callback, Codes.Success)
        });

    });

}

