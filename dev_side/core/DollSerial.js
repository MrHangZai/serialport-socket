let SerialItem=require('./SerialItem');
class DollSerial extends SerialItem{
    constructor(serialport){

        super();
        this.serialport=serialport;
        this.type='doll';
    };
    get port(){
        return this.serialport;
    }
}