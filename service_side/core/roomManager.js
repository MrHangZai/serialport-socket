/**
 * Created by shin on 2017/11/15.
 */
let SOC=require('socket.io');
let room=require('./room.js');
let Player=require('./player.js');
let PlayerManager=require('./PlayerManaer.js');
let watcher=require('./Watcher');
let red=require('./ReadPackage');
class roomManager{

    static getInstance()
    {
        if(!roomManager._instance)
        {
            roomManager._instance=new roomManager();
        }
        return roomManager._instance;
    }
    constructor(){
        this.rooms={};
    }
    init(http)
    {
        this.io=SOC.listen(http);
        this.io.on('connection',(socket)=>{
            //watcher对象注册
            socket.on('watch',(data)=>{
                if(data['id']=='akjsai182787b98'){
                    watcher.socket=socket;
                }
            });
            //娃娃机注册
            socket.on('devreg',(data)=>{
                //{data:id} 房间id
                var devid=data['data'];
                if(!this.rooms[devid]){
                    let r=new room(devid,this);
                    r.roomid=devid;
                    //this.rooms[devid]=new room();
                    this.rooms[devid]=r;
                    watcher.watch(r);
                    console.log('has room');
                }
                let r=this.rooms[devid];
                r.devSocket=socket;
                console.log('create room '+ devid);
                //console.log(this.rooms);
            });
            //用户登录，获取用户状态
            socket.on('peoplein',(data)=>{
                //{userid:'123'};
                console.log(data);
                let id=data.userid;
                let people=PlayerManager.getPlayerById(id);
                if(people)
                {
                    console.log("IN PEOPLE HAS");
                    socket.emit('state',{'roomid':people.roomid,playid:id});
                }
                else{
                    console.log("IN PEOPLE HAS NO"+"-->"+id);
                    socket.emit('state',{'roomid':null,playid:id});

                }
            })
            //用户注册,传递房间号
            socket.on('peoplereg',(data)=>{
                //{userid:'123',roomid:'1'}
                //用户id，设备id（房间id）
                let devid=data['roomid'];
                let userid=data['userid'];
                //根据设备id获取房间
                console.log("REG   DATA  -->"+JSON.stringify(data));
                let r=this.getRoom(devid);
                //如果房间号不存在，则房间不存在。
                if(!r) {
                    console.log("get no room");
                    socket.emit('regfail',{code:'1',msg:'房间未创立,不能加入'});
                    return;
                }
                else{
                    console.log('get room');
                    console.log("ROOM SOCKET ID IS ->"+r.devSocket.id);


                }
                //房间存在的情况，获取/新建用户
                let people=PlayerManager.getPlayerById(userid);
                if(!people) {
                    //新建用户
                    console.log(' has  no people');
                    people=new Player(socket);
                    //设置用户的用户id;
                    people.playerid=userid;
                    //房间内添加player
                    r.addPeople(people);
                    PlayerManager.addPlayerById(userid,people);
                    console.log("ROOM SOCKET ID IS ->"+r.devSocket.id);
                    people.socket.emit('regdone',{userid:people.playerid,roomid:people.roomid,skid:people.socket.id,tag:'newnewwen'});
                }
                else{
                    //获取到player并更新其socket对象
                    console.log(' has people');
                    if(people.socket)
                    {
                        console.log('people is connecting');
                        if(r){
                            if(people.socket.id===socket.id)
                            {
                                socket.emit('regfail',{code:'2','msg':'login error'});
                            }
                            else{

                                people.socket=socket;
                                people.socket.emit('regdone',{userid:people.playerid,roomid:people.roomid,skid:people.socket.id,'tag':"rr"});
                                r.addListener(people);
                            }

                        }
                        else{
                            socket.emit('regfail',{code:'2','msg':'login error'+"DEF"});
                        }
                        //r.addListener(people);
                        //r.telUpdate();
                        //r.telUpdate();
                    }
                    else{
                        people.socket=socket;
                        //为socket侦听事件
                        console.log('people is un connecting');
                        people.socket.emit('regdone',{userid:people.playerid,roomid:people.roomid,skid:people.socket.id,'tag':'33232'});
                        r.addListener(people);
                        //没次新加对象都要再侦听一次socket的相关事件.因为player对象socket一旦离线,socket会被清除.
                    }
                }
                r.telUpdate();
                //console.log(r.list);
            });
        });
        //setInterval(this.interval,1000);
        //设置红包组建的更新函数
        red.updateFunction=()=>{
            this.boardCastRed();
        };
        //启动红包组件
        red.start();

    }
    getRoom(id){
        return this.rooms[id];
    }
    boardCastRed()
    {
        //获取所有的玩家
        //console.log(PlayerManager.list);
        //console.log("ABAB");
        try{
            for(var id in PlayerManager.list)
            {
                let people=PlayerManager.list[id];
                if(people && people.socket)
                {
                    people.socket.emit('red');
                }
            }
        }
        catch(e)
        {
            console.log(e);
        }
    }
    clearAllData()
    {
        //清空房间数据
        //清空用户数据
        this.rooms={};
        PlayerManaer.list={};
    }
    removeRoom(room)
    {
        this.rooms[room.roomid]=null;
        room=null;
        //this.rooms={'id'};
    }
}
module .exports=roomManager.getInstance();