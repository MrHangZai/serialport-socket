/**
 * Created by shin on 2017/12/6.
 */
class PlayerManaer{

    //list:{}
    static init()
    {
        PlayerManaer.list={};
    }
    static getPlayerById(id)
    {
        if(PlayerManaer.list[id]) return PlayerManaer.list[id];
        return null;
    }
    static addPlayerById(id,player)
    {
        if(!PlayerManaer.list[id]) PlayerManaer.list[id]=player;
    }
    static removePlayerById(id)
    {
        //移除player
        PlayerManaer.list[id]=null;
    }
    
}
PlayerManaer.init();
module .exports=PlayerManaer;