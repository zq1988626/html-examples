export default {
    str2json:function(str:string):any{
        return eval("["+ (typeof str == "undefined"?"":str) +"]")[0];
    },
    json2str:function(json):string{
        return (JSON && JSON.stringify || function(){
            return "";
        })(json);
    }
}