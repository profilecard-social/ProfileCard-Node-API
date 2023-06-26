import authedChannel from "./generic/authedChannel.js";
import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import {createLink, deleteLink, updateLinkByUsername} from "../db/LinkUpdates.js";

export default (socket, body, callback) => {
    authedChannel(socket, body, callback, async (user) => {

        if (!body.id || !body.action) {
            fail(callback, Codes.ServerError)
            return;
        }

        let action = body.action;

        switch (action) {
            case 'create': {

                if (!user.name || !body.name || !body.url) {
                    fail(callback, Codes.ServerError);
                    return;
                }

                await createLink(user.name, body.name, body.url, callback);
                success(callback, Codes.Success);

                break;
            }
            case 'delete': {

                if (!user.name || !body.id) {
                    fail(callback, Codes.ServerError);
                    return;
                }

                await deleteLink(user.name, body.id);
                success(callback, Codes.Success);

                break;
            }
            case 'edit': {

                if (!user.name || !body.id || !body.name || !body.url || !body.sortId) {
                    fail(callback, Codes.ServerError);
                    return;
                }

                await updateLinkByUsername(user.name, body.id, body.sortId, body.name, body.url, callback);
                success(callback, Codes.Success);

                break;
            }
        }

    });
};