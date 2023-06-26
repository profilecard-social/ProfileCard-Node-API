// Import libraries
import { createServer } from "http";
import { Server } from "socket.io";
import { createConnection } from 'mysql';

// Import api modules
import profilePicture from "./channel/setProfilePicture.js";
import createAccount from "./channel/createAccount.js";
import verifyToken from "./channel/verifyToken.js";
import userData from "./channel/userData.js";
import updateValue from "./channel/updateValue.js";
import getRememberToken from "./channel/getRememberToken.js";
import updatePassword from "./channel/updatePassword.js";
import invalidateToken from "./channel/invalidateToken.js";

// Config loading
import config from "../config.json" assert { type: "json" };
import getLinks from "./channel/getLinks.js";
import modifyLink from "./channel/modifyLink.js";

// Init database
export const mysql = createConnection(config.mysql);

mysql.connect(err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('MySQL has been connected.');
});

// Init socket server
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
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

});

io.listen(4251, () => {
  console.log('Socket.IO server started');
});
