
export class ControllerOption{
    url:string
    type:string
    constructor(setting?:ControllerOption){
        $.extend(true,this,setting);
    }
}
export enum ControllerCallbackType {afterRender,beforeRender}

export class ControllerCallback{
    type:ControllerCallbackType
    method:Function
    constructor(type:ControllerCallbackType,method:Function){
        this.type = type;
        this.method = method;
    }
}

export class ControllerSetting {
    code:string
    container:HTMLElement
    typeid:string|null
    option?:ControllerOption
    callback:Array<ControllerCallback>
    constructor(setting?:ControllerSetting){
        $.extend(true,this,setting);
    }
}

export class ControllerBase{
    render(){
        
    }
}

export enum ControllerType {IFrame,Window}