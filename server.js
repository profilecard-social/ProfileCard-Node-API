const io = require('socket.io')();
const config = require('./config.json');
const { createConnection } = require('mysql');
const md5 = require('md5');
const fs = require('fs');

const con = createConnection(config.mysql);

con.connect(err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('MySQL has been connected.');
});

io.on('connect', socket => {
  console.log(`New connection! (socket id: ${socket.id})`);

  socket.on('disconnect', () => {
    console.log(`Connection closed! (socket id: ${socket.id})`);
  });

  socket.on('profile-picture', msg => {
    const rememberToken = msg.rememberToken;
    const imageData = msg.image;

    con.query('SELECT * FROM users WHERE token = ? LIMIT 1', [rememberToken], (err, results) => {
      if (err) {
        console.error(err);
        return;
      }

      if (results.length === 0) {
        console.log('Received invalid rememberToken!');
        return;
      }

      const tokenData = results[0];
      const username = tokenData.name;
      const imageFile = Buffer.from(imageData, 'base64');

      fs.writeFile(`/var/www/profilecard.social/uploads/${md5(username.toLowerCase())}.png`, imageFile, err => {
        if (err) {
          console.error(err);
          socket.emit('profile-picture', 'error');
          return;
        }

        socket.emit('profile-picture', 'success');
      });
    });
  });

  socket.on('background-image', msg => {
    const rememberToken = msg.rememberToken;
    const imageData = msg.image;

    con.query('SELECT * FROM users WHERE token = ? LIMIT 1', [rememberToken], (err, results) => {
      if (err) {
        console.error(err);
        return;
      }

      if (results.length === 0) {
        console.log('Received invalid rememberToken!');
        return;
      }

      const tokenData = results[0];
      const username = tokenData.name;
      const imageFile = Buffer.from(imageData, 'base64');

      fs.writeFile(`/var/www/profilecard.social/uploads/bg_${md5(username.toLowerCase())}.png`, imageFile, err => {
        if (err) {
          console.error(err);
          socket.emit('background-image', 'error');
          return;
        }

        socket.emit('background-image', 'success');
      });
    });
  });
});

io.listen(4251, () => {
  console.log('Socket.IO server started');
});
