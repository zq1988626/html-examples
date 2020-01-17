import Log from "../util/log";
import render from "./render";
import {PlatformOption} from "./interface";

export default class Platform implements PlatformOption{
    name:string;
    log : Log;
    container : HTMLElement = document.body;
    autoStart : boolean = false
    constructor(option:PlatformOption){
        this.name = option.name||"";
        if(option.container){
            this.container = option.container;
        }
        if(option.autoStart==true){
            this.autoStart = option.autoStart;
        }
        this.log = new Log(this.name);
        this.start
        if(this.autoStart){this.start()}
    }
    start(){
        this.log.info("平台已启动");
        render.renderPlatform(this);
    }
}