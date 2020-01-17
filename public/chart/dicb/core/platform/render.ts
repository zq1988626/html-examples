import Platform from "./main";
import util from "../util/index"
import {ControllerSetting,ControllerBase,ControllerOption} from "../controllers/base"

export default {
    controller : function(container:HTMLElement){
        $("")
    },
    renderPlatform : function(platform:Platform){
        var settings:Array<ControllerSetting> = $("[controller]:not([isRendered])").map(function(i,item:HTMLElement){
            var $item = $(item);
            var code : string = $item.attr("controller");
            return new ControllerSetting({
                code:code,
                container:item,
                typeid:$item.attr("typeid"),
                option: new ControllerOption(util.str2json($item.attr("option")))
            })
        }).toArray();
        
        if(settings.length==0){
            settings.push(new ControllerSetting({
                code:"controller",
                container:document.body,
                typeid:"333"
            }));
        }

        var ps = [];
        $.map(settings,function(item,i){
            var Controller = require(item.code);
            item.option = item.option;
            item.option.url = F.util.parseURL(window.location.href);
            item.option.type = window.parent == window?"window":"iframe";
            item.option.onAfterLoad = callback;
            ps.push(
                (new Promise(function(resolve,reject){
                    log.info("开始加载控制器"+item.code);
                    var rev = new Controller(item.container,item.option,item.typeid);
                    rev._INITRETRUN.
                    then(function(){
                        log.info("加载控制器"+item.code+"完成");
                        window.controllers[rev.id] = rev;
                        resolve();
                    })
                    ["catch"](function(ex){
                        console.error(ex);
                        resolve();
                    })
                    setTimeout(function(){
                        reject(new Error(item.code+"加载超时"));
                    },10000);
                }))
            );
        });
        return Promise.all(ps).then(function(){
            log.info("控制器加载完毕");
        })["catch"](function(error){
            log.error(error.message+"\n"+error.stack);
        })

        $("")
        alert("render "+platform.name);
    }
}