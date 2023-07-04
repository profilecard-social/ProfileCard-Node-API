import fs from 'fs';
import md5 from "md5";
import {getUsersWithToken} from "../db/UserQueries.js";
import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {updateUserParam} from "../db/UserUpdates.js";

import config from "../../config.json" assert { type: "json" };

const uploadDirectory = config.upload_directory;
const accessPath = config.access_path;

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

    const nameHash = md5(user.name.toLowerCase());
    const profilePicturePath = `${uploadDirectory}/${nameHash}.png`;
    const backgroundImagePath = `${uploadDirectory}/bg_${nameHash}.png`;

    let profilePicture;
    let backgroundImage

    if (fs.existsSync(profilePicturePath)) {
        profilePicture = `${accessPath}/${nameHash}.png`;
    } else if (fs.existsSync(`${uploadDirectory}/${user.id}.png`)) {
        profilePicture = `${accessPath}/${user.id}.png`;
    } else {
        profilePicture = `${accessPath}/default.png`;
    }

    if (fs.existsSync(backgroundImagePath)) {
        backgroundImage = `${accessPath}/bg_${nameHash}.png`;
    }  else {
        backgroundImage = `${accessPath}/bg_default.png`;
    }

    const data = {
        "icon": `${profilePicture}`,
        "bgImage": `${backgroundImage}`,
    };

    const dataToTransfer = [ "name", "email", "status", "buttoncolor", "textcolor", "bgcolor", "theme", "lang", "last_seen_at", "icon", "bgImage" ];
    for (let [key, value] of Object.entries(user)) {
        if (dataToTransfer.includes(key)) {
            data[key] = value;
        }
    }

    success(callback, { body: data });
}

