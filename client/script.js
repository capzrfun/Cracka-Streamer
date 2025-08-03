const electron = require('electron');
const fs = require('fs');

// Initialize Electron app
const app = new electron.App();
const BrowserWindow = electron.BrowserWindow;

// Create a browser window
let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the index.html file
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open devtools if debugging is enabled
  const devTools = process.argv.includes('--debug');
  if (devTools) {
    mainWindow.webContents.openDevTools();
  }

  // Handle close event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Event listener for window close
electron.app.on('window-all-closed', () => {
  // On macOS, it's common to re-create a window in the app when dock icon is clicked and there are no other windows open.
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

// Event listener for menu quit
electron.app.on('before-quit', () => {
  // Quit the app
  electron.app.quit();
});

// Listen for events on Electron app
electron.app.on('ready', createMainWindow);

// Listen for web sockets connection established
electron.ipcMain.handle('connect-websocket', (event) => {
  const socket = new WebSocket(`ws://localhost:3000`);

  // Handle 'stream-started' event from server
  socket.addEventListener('message', (event) => {
    if (event.data === 'stream-started') {
      const videoData = JSON.parse(event.data);
      const video = document.getElementById('video-container');
      video.srcObject = new MediaStream();
      const tracks = video.srcObject.getTracks();

      // Add tracks to video element
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].kind === 'audio') {
          const audioTrack = tracks[i];
          document.getElementById('video-container').appendChild(audioTrack);
        }
      }

      // Handle play/pause button click
      document.getElementById('play-pause').addEventListener('click', () => {
        video.play();
      });
    }
  });

  return { socket };
});

// Quit when all windows are closed.
electron.app.on('window-all-closed', () => {
  electron.app.quit();
});
// Handle app activation (macOS)
electron.app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});