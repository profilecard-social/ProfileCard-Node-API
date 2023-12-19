import { createServer } from "https";
import { Server } from "socket.io";
import { createPool } from 'mysql2';
import fs from 'fs';

// Import api modules
import profilePicture from "./channel/setProfilePicture.js";
import createAccount from "./channel/createAccount.js";
import verifyToken from "./channel/verifyToken.js";
import userData from "./channel/userData.js";
import updateValue from "./channel/updateValue.js";
import getRememberToken from "./channel/getRememberToken.js";
import updatePassword from "./channel/updatePassword.js";
import invalidateToken from "./channel/invalidateToken.js";
import setBackgroundImage from "./channel/setBackgroundImage.js";
import removeBackgroundImage from "./channel/removeBackgroundImage.js";
import getCardHits from "./channel/getCardHits.js";

import getLinks from "./channel/getLinks.js";
import modifyLink from "./channel/modifyLink.js";
import getReferrer from "./channel/getReferrer.js";

// Config loading
import config from "../config.json" assert { type: "json" };
import getLinkHitsByID from "./channel/getLinkHitsByID.js";
import getLinkHits from "./channel/getLinkHits.js";
import updateUsername from "./channel/updateUsername.js";
import getLineChartHits from "./channel/getLineChartHits.js";
import createMyBlogPost from "./channel/createMyBlogPost.js";
import getMyBlogPosts from "./channel/getMyBlogPosts.js";

// Init database
export const mysql = createPool(config.mysql);

// Read SSL certificates
const privateKey = fs.readFileSync('/etc/letsencrypt/live/beta.pfcard.link/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/beta.pfcard.link/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Init socket server
const httpsServer = createServer(credentials);
const io = new Server(httpsServer, {
  cors: {
    origin: '*',
  },
  maxHttpBufferSize: 100 * 1024 * 1024,
});

// Init socket.io channels
io.on('connect', socket => {
  console.log(`New connection! (socket id: ${socket.id})`);

  socket.on('disconnect', () => {
    console.log(`Connection closed! (socket id: ${socket.id})`);
  });

  socket.on('createAccount', (body, callback) => createAccount(socket, body, callback));
  socket.on('getRememberToken', (body, callback) => getRememberToken(socket, body, callback));
  socket.on('verifyToken', (body, callback) => verifyToken(socket, body, callback));
  socket.on('userData', (body, callback) => userData(socket, body, callback));
  socket.on('getLinks', (body, callback) => getLinks(socket, body, callback));
  socket.on('modifyLink', (body, callback) => modifyLink(socket, body, callback));
  socket.on('updateValue', (body, callback) => updateValue(socket, body, callback));
  socket.on('invalidateToken', (body, callback) => invalidateToken(socket, body, callback));
  socket.on('updatePassword', (body, callback) => updatePassword(socket, body, callback));
  socket.on('setProfilePicture', (body, callback) => profilePicture(socket, body, callback));
  socket.on('setBackgroundImage', (body, callback) => setBackgroundImage(socket, body, callback));
  socket.on('removeBackgroundImage', (body, callback) => removeBackgroundImage(socket, body, callback));
  socket.on('getCardHits', (body, callback) => getCardHits(socket, body, callback));
  socket.on('getReferrer', (body, callback) => getReferrer(socket, body, callback));
  socket.on('getLinkHitsByID', (body, callback) => getLinkHitsByID(socket, body, callback));
  socket.on('getLinkHits', (body, callback) => getLinkHits(socket, body, callback));
  socket.on('updateUsername', (body, callback) => updateUsername(socket, body, callback));
  socket.on('getLineChartHits', (body, callback) => getLineChartHits(socket, body, callback));
  socket.on('createMyBlogPost', (body, callback) => createMyBlogPost(socket, body, callback));
  socket.on('getMyBlogPosts', (body, callback) => getMyBlogPosts(socket, body, callback));

});

httpsServer.listen(4251, () => {
  console.log('Socket.IO server started with SSL');
});
