/**
 * Created by shin on 2017/12/13.
 */
var SO={
    init:function(){
        "use strict";
        SO.io=io();
        SO.io.on('connect',function(){
            console.log('connected');
            //id，unique id;
            SO.io.emit('watch',{id:'akjsai182787b98'});
        });
        SO.io.on('watchstatus',function(data){
            ROOM_MANAGER.showRoomInfo(data);
        });
    }
}