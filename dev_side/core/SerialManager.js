let sp=require('serialport');
class SerialManager{
    constructor(){
    }
    async connectSerial(){
        let comname=await this.initSerial();
        //console.log(comname);
        console.log('connect to '+comname);
        this. serialport=new sp(comname,{
                baudRate:115200,
                dataBits:8,
                parity:"none",
                stopBits:1,
                flowControl:false,
                autoOpen:false
            },false
        );
        this.serialport.open((e)=>{
            if(!e)
            {
                console.log('connect done');
            }
        })
        this.serialport.on('data',this.handleData)
    }
    sendCommand(cmd){
        console.log(cmd);
        this.serialport.write(cmd);
    }
    handleData(data)
    {
        console.log(data);

    }
    async initSerial(){
        let comname="com2";
        await sp.list((e,ports)=>{
            //console.log(ports);
            ports.forEach(
                (a)=>{
                    //console.log(a);
                    //console.log(a["comName"].toString().toLowerCase().indexOf(''));
                    if(a["comName"].indexOf('COM')>=0){
                        comname= a["comName"];
                        //console.log(a["comName"]);
                        return comname;
                    }
                }
            );
        });
        //console.log(comname);
        return comname;
    }
};
module.exports=SerialManager;


