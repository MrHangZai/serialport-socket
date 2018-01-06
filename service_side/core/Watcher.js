/**
 * Created by shin on 2017/12/13.
 */
class Watcher{
    constructor(){
        this.rooms=[];
        setInterval(()=>{this.update()},1000);
    }
    static instance(){
        if(!Watcher.__instance)
        {
            Watcher.__instance=new Watcher();
        }
        return Watcher.__instance;
    }
    watch(room)
    {
        this.rooms.push(room);
    }
    set socket(soc)
    {
        this._socket=soc;
        this._socket.on('disconnect',function(e){
            this._socket=null;
        })
    }
    get socket()
    {
        return this._socket;
    }
    tellUpdate(data)
    {
        if(this._socket)
        {
            this._socket.emit('watchstatus',data);
        }
    }
    update(){
        //return;
        //console.log(1);
        this.rooms.forEach((room)=>{
            this.tellUpdate(room.myState());
            room.checkOperate();//查看操作,40秒内没有任何操作记录的话则提出当前第一位player;
        })
    }

}
module .exports=Watcher.instance();