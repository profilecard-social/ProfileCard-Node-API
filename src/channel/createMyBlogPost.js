import authedChannel from "./generic/authedChannel.js";
import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import { createMyBlogPost, deleteMyBlogPost } from "../db/ProcessMyBlogPost.js";

export default (socket, body, callback) => {

    authedChannel(socket, body, callback, async (user) => {

        if (!body.action) {
            fail(callback, Codes.WrongArguments)
            return;
        }

        const timestamp = Math.floor(Date.now() / 1000);

        let action = body.action;

        switch (action) {
            case 'create': {

                if (!user.name || !body.text) {
                    fail(callback, Codes.WrongArguments);
                    return;
                }

                await createMyBlogPost(user.id, timestamp, body.text, 0, callback);
                success(callback, Codes.Success);

                break;
            }
            case 'delete': {
                if(!body.id){
                    fail(callback, Codes.WrongArguments);
                    return;
                }
                await deleteMyBlogPost(body.id, callback);
                success(callback, Codes.Success);
                break;
            }
            case 'edit': {
                break;
            }
        }

    });
};