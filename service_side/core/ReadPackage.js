/**
 * Created by shin on 2017/12/14.
 */
class RedPackage{
    constructor(){
        this.pushTime={};
    }
    static getInstance()
    {
        if(!RedPackage.__instance)
        {
            RedPackage.__instance=new RedPackage()
        }
        return RedPackage.__instance;
    }
    start(){
        //半个小时执行一次
        return;
        setInterval(()=>{this.update()},1800000);
    }
    update(){
        var date=new Date();
        let month=date.getMonth()+1;
        let day=date.getDate();
        let h=date.getHours();
        let m=date.getMinutes();
        let s=date.getSeconds();

        if(! this.pushTime[month+"_"+day])
        {
            this.pushTime[month+"_"+day]=[];
        }
        if(this.pushTime[month+"_"+day].length>16)
        {
            console.log("TODAY'S RED PACKAGE IS SEND OVER");
            return;
        }
        this.pushTime[month+"_"+day].push(month+"-"+day+"-"+h+"-"+m+'-'+s);
        if(this.updateFunction)
        {
            this.updateFunction();
        }
       // console.log( this.pushTime);
    }



}
module .exports=RedPackage.getInstance();