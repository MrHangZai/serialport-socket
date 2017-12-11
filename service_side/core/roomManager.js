/**
 * Created by shin on 2017/11/15.
 */
let SOC=require('socket.io');
let room=require('./room.js');
let Player=require('./player.js');
let PlayerManager=require('./PlayerManaer.js');
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
            console.log("socket--->"+socket.id+"is in");
            //娃娃机注册
            socket.on('devreg',(data)=>{
                //{data:id} 房间id
                var devid=data['data'];
                if(!this.rooms[devid]){
                    let r=new room();
                    //this.rooms[devid]=new room();
                    this.rooms[devid]=r;
                }
                let r=this.rooms[devid];
                r.devSocket=socket;
                //console.log(this.rooms);
            });
            //用户登录，获取用户状态
            socket.on('peoplein',(data)=>{
                //{userid:'123'};
                let id=data.id;
                let people=PlayerManager.getPlayerById(id);
                if(people)
                {
                    socket.emit('state',{'roomid':people.roomid});
                }
                else{
                    socket.emit('state',{'roomid':null});
                }
            })
            //用户注册,传递房间号
            socket.on('peoplereg',(data)=>{
                //{userid:'123',devid:'1'}
                //用户id，设备id（房间id）
                let devid=data['roomid'];
                let userid=data['userid'];

                //根据设备id获取房间
                let r=this.getRoom(devid);

                //如果房间号不存在，则房间不存在。
                if(!r) {console.log("get no room");return;};
                //房间存在的情况，获取/新建用户
                let people=PlayerManager.getPlayerById(userid);
                if(!people) {
                    //新建用户
                    people=new Player(socket);
                    //设置用户的用户id;
                    people.playerid=userid;
                    //房间内添加player
                    r.addPeople(people);
                }
                else{
                    //获取到player并更新其socket对象
                    people.socket=socket;
                }
                people.socket.emit('regdone',{userid:people.playerid,roomid:people.roomid});
                //console.log(r.list);
            });
        })
    }
    getRoom(id){
        return this.rooms[id];
    }
    clearAllData()
    {
        //清空房间数据
        //清空用户数据
        this.rooms={};
        PlayerManaer.list={};
    }
}
module .exports=roomManager.getInstance();