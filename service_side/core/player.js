/**
 * Created by shin on 2017/11/15.
 */
    var PM=require('./PlayerManaer.js');
class player{

    constructor(_socket){
        this.playerid="";
        this.leftTime=1;
        this.socket=_socket;
        this.room=null;
    }
    set playerid(val)
    {
        this.userid=val;
    }
    get playerid(){

        return this.userid;
    }
    set group(arr){
        this._group=arr;
    }
    get group()
    {
        return this._group;
    }
    set socket(_s)
    {
         if(this._socket)
         {
             this._socket=null;
         }
        this._socket=_s;
        this.socket.on('commit',(data)=>{
            //{msg:MSG};
            console.log(1);
            if(this.room)
            {
                this.room.boardCast(data);
            }
            //广播事件
        });
        this.socket.on('disconnect',()=>{
            try{
                this.socket=null;
            }
            catch(e){

            };
        })

        this.socket.on('init',()=>{
            //this.isCatching=false;
            if(!this.room) return;
            console.log("ID "+this.playerid);
            console.log("ID "+this.room.currentPeople.playerid)
            if(this==this.room.currentPeople) {
                console.log('init');
                this.room.logInit();
                this.room.devSocket.emit('init');
                this.socket.emit('state',{'initdone':'done'});
                this.room.logOperate();
            }
        })
        this.socket.on('left',()=>{
            if(!this.room) return;
            //if(this.isCatching) return;
            if(this==this.room.currentPeople){
                this.room.devSocket.emit('left');
                this.room.logOperate();
            }
        })
        this.socket.on('right',()=>{
            if(!this.room) return;
            //if(this.isCatching) return;
            if(this==this.room.currentPeople){
                this.room.devSocket.emit('right');
                this.room.logOperate();
            }
        });
        this.socket.on('up',()=>{
            if(!this.room) return;
            //if(this.isCatching) return;
            if(this==this.room.currentPeople) {
                this.room.devSocket.emit('up');
                this.room.logOperate();
            }
        });
        this.socket.on('down',()=>{
            if(!this.room) return;
            //if(this.isCatching) return;
            if(this==this.room.currentPeople) {
                this.room.devSocket.emit('down');
                this.room.logOperate();
            }
        });
        this.socket.on('catch',()=>{
            //3秒后重制数据
            //this.isCatching=true;
            //当前正在抓取状态
            //setTimeout(this.resetStatus,3000);
            if(!this.room) return;
            if(this==this.room.currentPeople) {
                this.room.devSocket.emit('devcatch');
                this.room.logOperate();
            }
        });
        this.socket.on('out',()=>{
            console.log('out');
            if(!this.room) return;
            /*player.remove();
             this.telUpdate();//通知每个用户的排名状态
             this.telMyState();//通知我的当前状态*/
            this.room.outPeople(this);

        });
    }
    removeSocket()
    {
        this._socket=null;
    }
    get socket()
    {
        return this._socket;
    }
    set roomid(id)
    {
        this._roomid=id;
    }
    get roomid()
    {
        return this._roomid;
    }

    remove(msg)
    {
        //console.log("REMOVE "+this.playerid+"  FROM  "+this.roomid);
        if(this.socket){
            switch(msg)
            {
                case "2":
                    this.socket.emit('beremoved',{"roomid":this.roomid,'playerid':this.playerid,msg:'2'});
                    break;
                default:
                    this.socket.emit('beremoved',{"roomid":this.roomid,'playerid':this.playerid,msg:'1'});
                    break;
            }


        }
        else{ return }
        if(this.group)
        {
            var g=this.group;
            for(let i =0;i<g.length;i++)
            {
                if(g[i]==this)
                {
                    this.removeSocket();
                    g.splice(i,1);
                    this._group=null;
                    this.room=null;
                    PM.removePlayerById(this.playerid);
                    //this.onRemove(this);
                    return;
                }
            }
        }
    }
    async updateCatchState(data)
    {
        //更新用户中奖信息，并返回当前用户的剩余抓取次数。
    }
}
module .exports=player;