/**
 * Created by shin on 2017/11/15.
 */
class player{

    constructor(socket){
        this.playerid="";
        this.leftTime=1;
        this._socket=socket;
        this._socket.on('disconnect',(e)=>{
            console.log(this._socket+"disconnect");
            this.remove();
        });
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
    }
    get socket()
    {
        return this._socket;
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
                    g.splice(i,1);
                    this._group=null;
                    //this.onRemove(this);
                    return;
                }
            }
        }
    }

}
module .exports=player;