export default class {
    name:string = "log"
    constructor(name){
        this.name = name;
    }
    error(msg){
        console.error(msg);

    }
    info(msg){
        console.log(msg);
    }
    warn(msg){
        console.warn(msg);
    }
}