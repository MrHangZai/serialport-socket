/**
 * Created by shin on 2017/11/15.
 */
class player{

    constructor(_socket){
        this.playerid="";
        this.leftTime=1;
        this.socket=_socket;
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
        this._socket=_s;
        this._socket=socket;
        this._socket.on('disconnect',(e)=>{
            console.log(this._socket+"disconnect");
            //this.remove();
            //移除当前socket
            this.removeSocket();
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


    remove()
    {
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