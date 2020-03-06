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

}



// app.on('ready-to-show', () => {
//     console.log('dwadawdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
//     // autoUpdater.checkForUpdates();
// });


app.on('ready', () => {
  autoUpdater.checkForUpdates()
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

});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on ('update-available', () => { 
  mainWindow.webContents.send ('update_available'); 
}); 
autoUpdater.on ('update-download', () => { 
   
});

autoUpdater.on('download-progress', function (progressObj) {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    mainWindow.webContents.send('update_download-progress',log_message); 
    // sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', function (info) {
    mainWindow.webContents.send ('update_downloaded');
});


// console.log(mainWindow)
// mainWindow.webContents.send('update_available');

