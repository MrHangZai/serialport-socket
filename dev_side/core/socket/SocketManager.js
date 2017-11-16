let io=require('socket.io-client');
let socketconfig=require('../config/SocketConfig');
let bufferconfig=require('../config/BufferConfig');
let caculate=require('../BufferManager');

class SocketManager{

    constructor(serialobject){
        //
        this.serial=serialobject;
        //console.log(socket.Socket);
        if(!serialobject) throw "NO SERIALMANAGER IS SET";
        this.so=io.connect(socketconfig.host,{secure:false});

        this.so.on('event',(e)=>{console.log(e)});
        console.log(socketconfig.host)
        this.so.on('connect',(e)=>{
            console.log('dev socket connected');

            //链接成功之后做注册操作
            this.register();
        });
        this.so.on('disconnect',(e)=>{
            //socket 服务器断开连接
            console.log('dev lost connection');
        })
        //获取初始化事件，由用户链接socket设备之后，用户告知socket服务器，socket服务器再通知设备的初始化事件。
        this.so.on('init',(e)=>{
            this.setInit();
        });
        //用户告知socket服务器，socket服务器再通知设备的left事件。
        this.so.on('left',(e)=>{
            this.setLeft();
        });
        //用户告知socket服务器，socket服务器再通知设备的right事件。
        this.so.on('right',(e)=>{
            this.setRight();
        });
        //用户告知socket服务器，socket服务器再通知设备的up事件。
        this.so.on('up',(e)=>{
            this.setUp();
        });
        //用户告知socket服务器，socket服务器再通知设备的down事件。
        this.so.on('down',(e)=>{
            this.setDown();
        });
        //用户告知socket服务器，socket服务器再通知设备的catch事件。
        this.so.on('catch',(e)=>{
            this.setCatch();
        })

    }
    register()
    {
        var id=socketconfig.deviceid;
        //远端注册设备 v
        this.so.emit('devreg',{data:id});
    }
    setLeft(){
        this.serial.sendCommand(caculate.initBuffer(bufferconfig.left));
    }
    setRight(){
        this.serial.sendCommand(caculate.initBuffer(bufferconfig.right));
    }
    setUp(){
        this.serial.sendCommand(caculate.initBuffer(bufferconfig.up));
    }
    setDown(){
        this.serial.sendCommand(caculate.initBuffer(bufferconfig.down));
    }
    setCatch(){
        this.serial.sendCommand(caculate.initBuffer(bufferconfig.catch));
    }
    setInit(){
        this.serial.sendCommand(caculate.initBuffer(bufferconfig.init));
    }
}
module.exports=SocketManager;