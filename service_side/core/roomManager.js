/**
 * Created by shin on 2017/11/15.
 */
let SOC=require('socket.io');
let room=require('./room.js');
let Player=require('./player.js');
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
            socket.on('devreg',(data)=>{
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
            socket.on('peoplereg',(data)=>{
                let devid=data['devid'];
                let r=this.getRoom(devid);
                if(!r) {console.log("get no room");return;};
                let people=new Player(socket);
                r.addPeople(people);
                //console.log(r.list);
            });
        })
    }
    getRoom(id){
        return this.rooms[id];
    }
}
module .exports=roomManager.getInstance();