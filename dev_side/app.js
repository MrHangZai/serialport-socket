let SM=require(__dirname+"/core/SerialManager.js");
let smObject=new SM();
let SocketManager=require("./core/socket/SocketManager");
//链接串口
smObject.connectSerial();
var socketm=new SocketManager(smObject);
//console.log(socketm);


setTimeout(()=>{socketm.setInit()},1000);
setTimeout(()=>{socketm.setLeft()},2000);
setTimeout(()=>{socketm.setRight()},3000);
setTimeout(()=>{socketm.setUp()},4000);
//setTimeout(()=>{})
