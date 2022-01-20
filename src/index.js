const { app } = require('electron');
require('electron-reload')(__dirname);

const { createWindow } = require('./main');
const { dbConetion } = require('./database');

dbConetion();

app.whenReady().then(() => {
    createWindow();

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
      });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
