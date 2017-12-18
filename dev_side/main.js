const electron=require('electron');
const sp=require('serialport');
const app=electron.app;
const BW=electron.BrowserWindow;

let mainWindow;
function createWindow(){
 console.log('i am ready');
 mainWindow=new BW({widt:1080,height:850});
 mainWindow.loadURL('file://'+__dirname+"/app/index.html");
 mainWindow.on('close',()=>{
     mainWindow=null;
 })
}
app.on('ready',createWindow);
app.on('window-all-closed',()=>{
 if(process.platform=='drawin'){
  app.quit();
 }
})
app.on('activate',()=>{
 if(mainWindow===null){
  createWindow();
 }
})
