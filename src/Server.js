// Import libraries
import { createServer } from "http";
import { Server } from "socket.io";
import { createConnection } from 'mysql';

// Import api modules
import profilePicture from "./channel/setProfilePicture.js";

// Config loading
import config from "../config.json" assert { type: "json" };
import createAccount from "./channel/createAccount.js";

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

  socket.on('createAccount', (msg, callback) => createAccount(socket, msg, callback));
  socket.on('setProfilePicture', (msg, callback) => profilePicture(socket, msg, callback));

});

io.listen(4251, () => {
  console.log('Socket.IO server started');
});
