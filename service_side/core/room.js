/**
 * Created by shin on 2017/11/15.
 */
let SOC=require('socket.io');
class room{

    constructor(id,roomm){
        this.list=[];
        this._devSocket=null;
        this.roomid=id;
        //this.rm=
        this.rm=roomm;
        this.operateLog={'timeCheck':15000,"operate":0,waitingStart:0,isInit:false};//3000毫秒判别.
    }
    set devSocket(soc)
    {
        if(soc==null){console.log("dev socket change to null");this._devSocket=null;return};
        if(this._devSocket==soc) return;
        if(this._devSocket && this._devSocket!=soc){console.log("change dev socket");this._devSocket=null};
        this._devSocket=soc;
        this.devSocket.on('catch',(data)=>{
            //通知当前用户获取到娃娃
            //{'catchid':'123'};
            //当前用户抓取事件发布吃
            console.log("CATCHED DOLL",data);
            if(!this.currentPeople) return;
            this.currentPeople.socket.emit('catched',data);
            //告知所有人有人抓取到娃娃事件
            this.boardCast(
                {userid:this.currentPeople.playerid || "abc",
                catchid:data['catchid']},'catch');
        });
        this.devSocket.on('disconnect',(e)=>{

            console.log(e);
            console.log('ROOM DISCONNECT');
            //this.devSocket=null;

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
        //onsole.log("!#!#!#!#!#!#!#!#");
      //  console.log("!#!#!#!#!#!#!#!#");
        return this._devSocket;
    }
    addPeople(player)
    {
        console.log("room s of  =>",this.devSocket.id);
        console.log('get new arrivaler');
        //list中增加用户
        this.list.push(player);
        if(this.list.length==1)
        {
            this.logOperate(true);
        }
        //设置roomid
        player.roomid=this.roomid;
        //设置group
        player.group=this.list;
        //增加事件监听
        this.addListener(player);
        //this.devSocket.emit('')
        //告知目前房间状态
        this.telMyState();
        //告知每个用户的状态
        this.telUpdate();
    };
    addListener(player)
    {
        if(!player.socket) return;
        player.room=this;
        //this.telUpdate();
    }
    get currentPeople()
    {
        return this.list[0];
    }
    //记录当前操作
    //记录时间戳
    logOperate(isTurn=false){
        let time=new Date();
        let timeindex=time.getTime();
        this.operateLog['operate']=timeindex;

        //如果是初始化等待日志储备
        if(isTurn){
            //准备等待初始化命令进入
            //this.operateLog.waitingToInit=true;
            //初始化命令进入状态 false;
            this.operateLog.isInit=false;
            //设置等待开始时间
            this.operateLog.waitingStart=timeindex;

        }
        console.log(this.operateLog);
    }
    logInit()
    {
        this.operateLog.isInit=true;
        console.log('find init');
    }
    resetStatus()
    {
        //
        //this.isCatching=false;
    }
    //踢出用户
    outPeople(people,msg){
       // return;
        people.remove(msg);
        this.telUpdate();//通知每个用户的排名状态
        this.telMyState();
        //记录日志
        if(this.currentPeople)
        {
            this.logOperate(true);
        }
        else{
            this.logOperate();
        }
    }
    checkOperate(){
        //return;
        //查看操作,40秒内没有任何操作记录的话则提出当前第一位player;
        let operateTime=this.operateLog['operate'];
        if(operateTime==0) return;//如果没有任何操作记录,则退出函数
        if(this.list.length==0){
            this.operateLog['operate']=0;
            return;//如果没有人在排队,退出函数
        }
        let time=new Date();
        let timeindex=time.getTime();
        let timeDelay=timeindex-operateTime;
        //console.log(timeDelay);
        if(timeDelay>=30000)
        {
            let people=this.currentPeople;
            if(!people) return;
            this.outPeople(people,'2');
            this.operateLog['operate']=timeindex;
            console.log('当前用户没有任何操作;需踢出!');
        };
        //机器在等待初始化操作的过程中,等待超过15秒,就被自动踢出房间.
        let waitingStartTime=this.operateLog.waitingStart;
        if(waitingStartTime==0 ) return;//如果没有等待时间作记录,则退出函数
        timeDelay=timeindex-waitingStartTime;
        //如果时间超出设定范围,并且初始化的状态为false;则提出当前用户;
        if(timeDelay>=this.operateLog.timeCheck && this.operateLog.isInit==false)
        {
            let people=this.currentPeople;
            if(!people) return;
            this.outPeople(people,'2');
            this.operateLog['operate']=timeindex;
            console.log('当前用户没有及时开启游戏,被踢出!');
        }

    }
    //广播事件，用于发送弹幕
    boardCast(data,type)
    {
        //{msg:MSG};
        var rid=this.roomid;
        var content=data['msg'];
        //遍历并发布广播
        //let emitType=type=='catch'?'catchabc':'chat'
        this.list.forEach((a)=>{
            //如果用户有socket对象，则发送chat事件。
            //if(a.socket) a.socket.emit('chat',{roomid:rid,userid:a.playerid,msg:content});
            //if()
            if(type=='catch')
            {
                if(a.socket) a.socket.emit('catchabc',data);
            }
            else{
                console.log(a.playerid);
                if(a.socket) a.socket.emit('chat',{roomid:rid,userid:a.playerid,msg:content});
            }
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
            if(people.socket){
                people.socket.emit('updateturn',{'turnnumber':i,'totalnumber':listnumber,roomid:rid});
            }
            else{
                console.log("PEOPLE GET NO SOCKET! HE IS OFF LINE");
            }
        }
    }
    //通知我的当前状态
    telMyState()
    {
        if(this.devSocket) this.devSocket.emit('state',this.myState());
        //watch.tellUpdate(this.myState());
    };
    myState()
    {
        var a=[];
        this.list.forEach((p)=>{
            a.push(p.playerid);
        });
        let isdevConnect=false;
        //告知当前设备的socket是否存在
        //console.log(this.devSocket);
        isdevConnect=this.devSocket?true:false;
        return {
            devConnect:isdevConnect,
            roomid:this.roomid,
            childrenLength:this.list.length,
            children:a
        }
    }

    //init(http){
      //  this.io=SOC.listen(http);
    //}
}
module .exports=room;