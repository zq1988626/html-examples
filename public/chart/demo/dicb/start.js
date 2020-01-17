requirejs.config({
    
});

requirejs(["/dist/index"],function(){
    new Platform({
        name:"Main",
        autoStart:true
    });
})