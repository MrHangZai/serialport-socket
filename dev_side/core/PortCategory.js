let SERIALPORT=require('serialport');
let caculate=require('./BufferManager');
let bufferconfig=require('./config/BufferConfig');
let SM=require('./SerialManager');
class PortCategory{
    constructor(){

    }
    static check(port)
    {
        let comname=port['comName'];//get the name of the serial port;
        let serialport=new SERIALPORT(comname,{
            baudRate:115200,
            dataBits:8,
            parity:"none",
            stopBits:1,
            flowControl:false,
            autoOpen:false
        },false);

        //let promise=new Promise((rov,jet)=>{
            serialport.open((e)=>{
                if(!e)
                {
                    console.log('connect done');
                    serialport.write(caculate.initBuffer(bufferconfig.init));
                    serialport.on('data',(data)=>{
                        console.log("DATA =>",data);

                        if(!data) return;
                        let buffer=new Buffer(data);
                        let portmanager=require('./SerialManager');
                        if(buffer[0] == 0xff && buffer[1]==0x55 && buffer[2]==0xc1)
                        {
                            console.log("检测到娃娃机串口");
                            //console.log(port);
                            console.log(buffer);
                            //console.log(SM.serialport);
                            //SM.sport=serialport;

                            portmanager.sport=serialport;
                            //console.log(SM.serialport);

                        }
                        if(buffer[2]==0xC0 &&(buffer[4]==0x01 || buffer[4]==0x02))
                        {
                            //console.log('cccccccc');
                            portmanager.handleDataCatch(buffer);
                        }
                        //判断没有抓取到娃娃
                        else if(buffer[2]==0xC0 && buffer[4]==0x00){
                            portmanager.handleDataCatchNo();
                        }
                    })
                }
                else{
                    //console.log("ERR  ",e);
                }
            });
        console.log(port);
        return serialport;
    }
}
module.exports=PortCategory;
