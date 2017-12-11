/**
 * Created by shin on 2017/11/15.
 */
let SOC=require('socket.io');
class room{

    constructor(id,roomm){
        this.list=[];
        this._devScoket=null;
        this.roomid=id;
        //this.rm=
        this.rm=roomm;
    }
    set devSocket(soc)
    {
        this._devSocket=soc;

        this._devSocket.on('catch',(data)=>{
            //通知当前用户获取到娃娃
            //{'catchid':'123'};
            this.currentPeople.socket.emit('catch',data);
            //update people leftTime
            //this.currentPeople().leftTime--;
             this.currentPeople.updateCatchState(data);
            if(this.currentPeople.leftTime<=0)
            {
                //当前用户剔除
                this.currentPeople.remove();
                //告知用户最新的排名情况
                this.telUpdate();
                //重新获取当前用户
                //发送 "yourturn"事件,通知用户开始游戏操作;
                this.currentPeople.socket.emit('yourturn');
            }
        });
        this._devSocket.on('disconnect',(e)=>{
            if(this.rm)
            {
                this.rm.removeRoom(this);
            }
        });
        console.log("房间 SOCKET =>",soc.id);
        this.telMyState();//通知我的当前状态
    }
    set roomid(id)
    {
        this._roomid=id;
    }
    get roomid()
    {
        return this._roomid;
    }

    get devSocket()
    {
        return this._devSocket;
    }
    addPeople(player)
    {
        console.log("room s of  =>",this.devSocket.id);
        console.log('get new arrivaler');
        this.list.push(player);
        player.roomid=this.roomid;
        player.group=this.list;


        //弹幕事件
        player.socket.on('commit',(data)=>{
            //{msg:MSG};
            this.boardCast(data);
        })

        player.socket.on('init',()=>{
            this.isCatching=false;
            if(player==this.currentPeople) this.devSocket.emit('init');
        })
        player.socket.on('left',()=>{
            if(this.isCatching) return;
            if(player==this.currentPeople) this.devSocket.emit('left');
        })
        player.socket.on('right',()=>{
            if(this.isCatching) return;
            if(player==this.currentPeople) this.devSocket.emit('right')
        });
        player.socket.on('up',()=>{
            if(this.isCatching) return;
            if(player==this.currentPeople) this.devSocket.emit('up');
        });
        player.socket.on('down',()=>{
            if(this.isCatching) return;
            if(player==this.currentPeople) this.devSocket.emit('down');
        });
        player.socket.on('catch',()=>{
            //3秒后重制数据
            this.isCatching=true;
            //当前正在抓取状态
            setTimeout(this.resetStatus,3000);
            if(player==this.currentPeople) this.devSocket.emit('catch');
        });

        player.socket.on('out',()=>{
            player.remove();
            this.telUpdate();//通知每个用户的排名状态

            this.telMyState();//通知我的当前状态

        })

        /*player.onRemove=(p)=>{
            console.log(this.devSocket);
            this.devSocket.emit('init');
        };*/
        player.socket.on('start',()=>{
            if(player==this.currentPeople)
            {
                this.devSocket.emit('init');
            }
        });
        player.socket.on('restart',()=>{
            if(this.isCatching) return;
            this.devSocket.emit('init');
        });
        //this.devSocket.emit('')
        this.telMyState();
        this.telUpdate();
    };
    get currentPeople()
    {
        return this.list[0];
    }
    resetStatus()
    {
        //
        //this.isCatching=false;

    }
    //广播事件，用于发送弹幕
    boardCast(data)
    {
        //{msg:MSG};
        var rid=this.roomid;
        var content=data['msg'];
        //遍历并发布广播
        this.list.forEach((a)=>{
            //如果用户有socket对象，则发送chat事件。
            if(a.socket) a.socket.emit('chat',{roomid:rid,userid:a.playerid,msg:content});
        });
    };
    //更新排名状态
    telUpdate()
    {
        let listnumber=this.list.length;
        let rid=this.roomid;
        for(let i=0;i<this.list.length;i++)
        {
            let people=this.list[i];
            //更新当前用户的排名情况，返回当前用户的队列顺序，以及当前房间的总排队人数
            people.socket.emit('updateturn',{'turnnumber':i,'totalnumber':listnumber,roomid:rid});
        }
    }
    //通知我的当前状态
    telMyState()
    {
        var a=[];
        this.list.forEach((p)=>{
            a.push(p.playerid);
        })
        this.devSocket.emit('state',{
            roomid:this.roomid,
            childrenLength:this.list.length,
            children:a
        });
    }



    //init(http){
      //  this.io=SOC.listen(http);
    //}
}
module .exports=room;