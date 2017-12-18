let sp=require('serialport');
let category=require('./PortCategory');
class SerialManager{
    constructor(){
        this.serialports=[];
        this.a=23123;
    }
    init(){
        this.status='readytocatch';
    }
    initCatch()
    {
        this.status='catching';
        this.catchid=0;
    }
    initCatched(){
        this.status='catched';
    }

    async connectSerial(){
        let ports=await this.initSerial();
        //console.log(ports);
        for(var i=0;i<ports.length;i++){
           this.serialports.push(category.check(ports[i]));
        };
    }
    set sport(port)
    {
        this._serialport=port;
        //console.log(this.serialports.length);
        for(var i=0;i<this.serialports.length;i++)
        {
            if(this.serialports[i]==port)
            {
                this.dollserialport=this.serialports[i]
                console.log(i);

                console.log('doll serial port is set');
            }
            else{
                this.rfidserialport=this.serialports[i];
                console.log('RFID Sserial port is set');
                this.rfidserialport.on('data',(data)=>{
                    this.handleRFID(data);
                })
            }
        }
    }
    handleRFID(data){
        console.log("RFID->",data);
        if(data.length>9){
            switch(data[2])
            {
                case 0x00:
                    this.catchid=0;
                    break;

                case 0x01:
                    this.catchid=1;
                    break;
                case 0x02:
                    this.catchid=2;
                    break;
                case 0x03:
                    this.catchid=3;
                    break;
                case 0x04:
                    this.catchid=4;
                    break;
                case 0x05:
                    this.catchid=5;
                    break;
                case 0x06:
                    this.catchid=6;
                    break;
                case 0x07:
                    this.catchid=7;
                    break;
            }
        }
        /*
        * lv钱包	0x00	0x01
阿玛尼香水	0x00	0x02
ysl口红	0x00	0x03
凝胶	0x00	0x04
洗发露	0x00	0x05
午夜巴黎	0x00	0x06
精油	0x00	0x07
lv钱包	0x00	0x01
阿玛尼香水	0x00	0x02
ysl口红	0x00	0x03
凝胶	0x00	0x04
洗发露	0x00	0x05
午夜巴黎	0x00	0x06
精油	0x00	0x07

        * */
    }
    set catchid(val)
    {
        console.log("set "+val);
        this._catchid=val;
    }
    get catchid()
    {
        return this._catchid;
    }
    get sport(){
        return this._serialport;
    }
    sendCommand(cmd){
        console.log(cmd);
        if(this.sport)     this.sport.write(cmd);
        else console.log("NO DOLL SERIAL");

    }
    handleData(data)
    {
        console.log(data);
    }
    handleDataCatch(data)
    {
        console.log("CATCHED DATA=",data);
        var id=this.catchid;
        if(this.onCatch){
            this.onCatch({'catchid':id});
        }
    }
    handleDataCatchNo(){
        console.log("CATCHED DATA= NO DOLLER GET");
        if(this.onCatch){
            this.onCatch({'catchid':-1});
        }
    }
     initSerial(){

        let pormise=new Promise((rov,jet)=>{
            sp.list((e,ports)=>{
                if(e) rov(e)
                else rov(ports);
            });
        })
         return pormise;
        //return comname;
    };
    static getInstance(){
      if(!SerialManager.__instance)
      {
          SerialManager.__instance=new SerialManager();
      }
      return SerialManager.__instance;
    }
};
module.exports=SerialManager.getInstance();


