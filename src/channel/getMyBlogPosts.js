import {fail, success} from "../response/Response.js";
import Codes from "../response/Codes.js";
import authedChannel from "./generic/authedChannel.js";
import { getMyBlogPostsByUserID } from "../db/ProcessMyBlogPost.js";

export default (socket, body, callback) => {

    authedChannel(socket, body, callback, async (user) => {

        const posts = await getMyBlogPostsByUserID(user.id);

        const data = []

        for (let post of posts) {
            const postObj = {
                id: post.id,
                timestamp: post.timestamp,
                text: post.text,
            };
            data.push(postObj);
        }

        success(callback, { body: { posts: data } });

    });

};