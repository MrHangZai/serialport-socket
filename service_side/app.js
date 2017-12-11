/**
 * Created by shin on 2017/11/15.
 */
var express=require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
let fs=require('fs');
let roommanager=require("./core/roomManager");

roommanager.init(http);

var virtualPath = process.env.virtualPath || "";
var port = process.env.PORT || 3000;

function fsInit()
{
    "use strict";
    return new Promise((rov,rej)=>{
        fs.exists('/acs/conf/env.properties',exist=>{
            "use strict";
            if(exist)
            {
                let con = fs.readFileSync('/acs/conf/env.properties', 'utf8');
                if(con)
                {
                    let res = con.match(/port.NODE_PORT=(.*)/);
                    let port= res[1];
                    rov(port);
                };
            }else{
                let port= process.env.PORT || 3000;
                rov(port);
            }
            //init();
        });
    })
}

async function init(){
    "use strict";

    let port=await fsInit();
    http.listen(port, function(){
        console.log('listening on *:3000');
    });
}


app.use(virtualPath,express.static(path.join(__dirname, 'public')));

app.get('/chat/', function(req, res){
    res.send('<h1>Welcome Realtime Server</h1>'+room.roomnumber);
});
app.get('/abc/', function(req, res){
    res.send('<h1>Welcome abc Server</h1>'+room.chatHistory);
});
app.get('clearAllData',function(req){
    "use strict";
    //清理
})
init();