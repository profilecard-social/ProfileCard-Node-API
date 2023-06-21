import {getUsersWithToken} from "../db/UserQueries.js";
import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {comparePassword, generateNewToken, generatePasswordHash} from "../util/Encryption.js";
import {updateUserParam} from "../db/UserUpdates.js";

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

    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;

    if (!currentPassword || !newPassword) {
        fail(callback, Codes.InsufficientCredentials);
        return;
    }

    if (!comparePassword(currentPassword, user.passwordHash)) {
        fail(callback, Codes.WrongCurrentPassword);
        return;
    }

    const newPasswordHash = generatePasswordHash(newPassword);

    if (comparePassword(currentPassword, newPasswordHash)) {
        fail(callback, Codes.PasswordsCantMatch);
        return;
    }

    await updateUserParam("token", body.token, "passwordHash", newPasswordHash);
    success(callback, Codes.Success);
}