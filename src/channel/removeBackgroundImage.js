import fs from "fs";
import md5 from "md5";
import Codes from "../response/Codes.js";
import { fail, success } from "../response/Response.js";
import config from "../../config.json" assert { type: "json" };
import authedChannel from "./generic/authedChannel.js";

const documentRoot = config.upload_directory;

export default (socket, body, callback) => {

    authedChannel(socket, body, callback, async (user) => {
        const username = user.name;
        fs.unlink(`${documentRoot}/bg_${md5(username.toLowerCase())}.png`, err => {
            if (err) {
                fail(callback, Codes.ServerError);
                console.error(err);
                return;
            }

            success(callback, Codes.Success);
        });
    });

}

