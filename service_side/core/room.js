/**
 * Created by shin on 2017/11/15.
 */
let SOC=require('socket.io');
class room{

    constructor(){
        this.list=[];
        this._devScoket=null;
    }
    set devSocket(soc)
    {
        this._devSocket=soc;
        this._devSocket.on('catch',(data)=>{
            //通知当前用户获取到娃娃
            this.currentPeople().socket.emit('catch',data);
            this.currentPeople().leftTime--;
            if(this.currentPeople().leftTime<=0)
            {
                //当前用户剔除
                this.currentPeople().remove();
                //告知用户最新的排名情况
                this.telUpdate();
                //重新获取当前用户
                //发送 "yourturn"事件,通知用户开始游戏操作;
                this.currentPeople().socket.emit('yourturn');
            }
        });
    }
    get devSocket()
    {
        return this._devSocket;
    }
    addPeople(player)
    {
        this.list.push(player);
        //console.log(this.devSocket);
        player.group=this.list;
        player.socket.on('init',()=>{
            this.devSocket.emit('init');
        })
        player.socket.on('left',()=>{
            this.devSocket.emit('left');
        })
        player.socket.on('right',()=>{
            this.devSocket.emit('right')
        });
        player.socket.on('up',()=>{
            this.devSocket.emit('up');
        });
        player.socket.on('down',()=>{
            this.devSocket.emit('down');
        });
        player.socket.on('catch',()=>{
            this.devSocket.emit('catch');
        });
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

        });
        //this.devScoket.emit('init');
    };
    currentPeople()
    {
        return this.list[0];
    }
    //更新排名状态
    telUpdate()
    {
        for(let i=0;i<this.list.length;i++)
        {
            let people=this.list[i];
            people.socket.emit('updatetrun',{'turnnumber':i});
        }
    }

    //init(http){
      //  this.io=SOC.listen(http);
    //}
}
module .exports=room;