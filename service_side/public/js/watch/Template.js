/**
 * Created by shin on 2017/12/13.
 */
var ROOM_TEMPLATE=function(){
    var self=this;
    this.module=function(){
        return '<div class="com" id="room1">'+
        '<div class="comtitle"><label>ROOM NO. </label><span class="comtitle_name">'+self.ROOMID+'</span></div>'+
        '<div class="roomstatus"><label>ROOM STATUS:</label><span class="room_status">'+self.roomstatud+'</span></div>'+
        '<div class="roomsquence"><label>ROOM SAUENCE STATUS</label></div>'+
        '<div class="squencearea">'+self.updateArea()+
        '</div>'+
        '</div>';
    };
    this.ROOMID=1;
    this.roomstatud='';
    this.squenceArea=[];
    this.update=function()
    {
        "use strict";
        return self.module();
    };
    this.updateArea=function(){
        "use strict";
        var str="";
        for(var i=0;i<self.squenceArea.length;i++)
        {
            str+="<label>用户mix_id:=></label><br><span>"+self.squenceArea[i]+"</span><br>";
        }
        return str;
    }
}
var ROOM_MANAGER={
    roomlab:{},
    showRoomInfo:function(data){
        "use strict";
        var roomid=data['roomid'];
        if(!ROOM_MANAGER.roomlab[roomid])
        {
            ROOM_MANAGER.roomlab[roomid]=new ROOM_TEMPLATE();
        }
        var room=ROOM_MANAGER.roomlab[roomid];
        room.ROOMID=roomid;
        room.roomstatud=data['devConnect'];
        room.squenceArea=data['children'];
        var str="";
        for(var a in ROOM_MANAGER.roomlab)
        {
            str+=ROOM_MANAGER.roomlab[a].update();
        }
        //console.log(str);
        $('.content').html(str);
    }
}