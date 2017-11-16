class BufferManager{
    constructor(){

    }
    static initBuffer(arr=[])
    {
        let buffer=new Buffer(12);
        for(var i=0;i<arr.length;i++)
        {
            buffer[i]=arr[i];
        }
        return BufferManager.caculateBuffer(buffer);
    }
    static caculateBuffer(buffer)
    {
        buffer[11]=0x00;
        for(let i=0;i<buffer.length-1;i++)
        {
            buffer[11]+=buffer[i];
        }
        return buffer;
    }
}
module.exports=BufferManager;