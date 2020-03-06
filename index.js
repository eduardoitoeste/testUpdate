const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    console.log('dwadawd')
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.on('ready', () => {
  createWindow();

});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});



ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });

  // event.sender.send('update_available');


  autoUpdater.on('update-available', () => {
    event.sender.send('update_available');
    // mainWindow.webContents.send('update_available');
  });
  autoUpdater.on('update-downloaded', () => {
    event.sender.send('update_downloaded');
    // mainWindow.webContents.send('update_downloaded');
  });

});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});


// console.log(mainWindow)
// mainWindow.webContents.send('update_available');

