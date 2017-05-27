const {app, BrowserWindow ,ipcMain} = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})
  //focus event
  win.once('focus', () => win.flashFrame(false))
  win.flashFrame(true)
  //online event
  ipcMain.on('online-status-changed', (event, status) => {
    console.log(status)
  })

  var progress=1
  //win.setProgressBar(0.8)
  var timer=setInterval(function(){
    if(progress==150){
      clearInterval(timer)
      win.setProgressBar(0)
    }
    win.setProgressBar(progress++/100)
  },100)
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})