define(["tc"],function(TC){
    var data = {
        SSAO:{
            enabled:true
        },
        camera:{
            type:"PerspectiveCamera",
            fov:65,
            aspect:window.innerWidth / window.innerHeight,
            near:10,
            far:700,
            position:{z:500}
        },
        objects:[
            {
                type:"Mesh",
                geometry:{type:"BoxGeometry",width:10,height:10, depth:10},
                material:{type:"MeshBasicMaterial",color: 0xffffff*Math.random()}
            },{
                type:"Mesh",
                geometry:{type:"BoxGeometry",width:20,height:20, depth:20},
                material:{type:"MeshBasicMaterial",color:0xffffff*Math.random()},
                position:{x:Math.random() * 20,y:Math.random() * 20,z:Math.random() * 20},
                rotation:{x:Math.random(),y:Math.random(),z:Math.random()},
                scalar: Math.random() * 10 + 2
            },{
                type:"Group",
                children:Array.prototype.map.call(String.prototype.padStart(20,"0"),function(item){
                    return {
                        type:"Mesh",
                        geometry:{type:"BoxBufferGeometry",width:10,height:10, depth:10},
                        material:{type:"MeshLambertMaterial",color:0xffffff*Math.random()},
                        position:{x:Math.random() * 300-150,y:Math.random() * 300-200,z:Math.random() * 300-200},
                        rotation:{x:Math.random(),y:Math.random(),z:Math.random()},
                        scalar: Math.random() * 10 + 2
                    }
                })
            }
        ]
    }

    var mytc = new TC(data);
    mytc.render(document.getElementById("container"));
    window.addEventListener("resize",function(){
        mytc.renderer.setSize( window.innerWidth, window.innerHeight );
        mytc.camera.updateProjectionMatrix();
        mytc.camera.aspect = window.innerWidth/window.innerHeight;
        mytc.ssaoPass.setSize( window.innerWidth, window.innerHeight );
    })
})