
requirejs(["THREE"],function(THREE){
    window.THREE = THREE;
})
define([
    "jquery",
    "THREE",
    "OrbitControls",
    "CopyShader",
    "SimplexNoise",
    "EffectComposer",
    "SSAOShader",
    "ShaderPass",
    "SSAOPass",
    "gui"
],function($,THREE,CopyShader,OrbitControls,SimplexNoise,EffectComposer,SSAOShader,ShaderPass,SSAOPass,dat){
    var GUI = dat.GUI;
    var defaultOption = {
        secne:{
            background:0xaaaaaa,
            lights:[
                {type:"DirectionalLight"},
                {type:"HemisphereLight"}
            ]
        },
        renderer:{
            width:window.innerWidth,
            height:window.innerHeight,
        },
        camera:{
            type:"PerspectiveCamera",
            fov:75,
            aspect:window.innerWidth / window.innerHeight,
            near:0.1,
            far:100,
            position:{z:500}
        },
        orbitControls:{
            type:"OrbitControls",
            maxPolarAngle:Math.PI * 0.5,
            minDistance:1,
            maxDistance:500
        },
        composer:{
            kernelRadius:16,
        },
        lights:[
            {type:"DirectionalLight"},
            {type:"HemisphereLight"}
        ]
    }

    var meshDefaultOption = {
        type:"Mesh",
        geometry:{type:"BoxBufferGeometry",width:10,height:10, depth:10},
        material:{type:"MeshLambertMaterial",color:0x666666},
        position:null,
        rotation:null
    }

    var TC = function(pOption){
        this.option = pOption;
        var option = $.extend(true,defaultOption,pOption);
        
        //创建场景
        var scene = this.scene = new THREE.Scene();
        option.secne.background&&(scene.background = new THREE.Color(option.secne.background));

        //创建镜头
        var camera = this.camera = new THREE[option.camera.type]( 
            option.camera.fov, option.camera.aspect, option.camera.near, option.camera.far 
        );
        if(option.camera.position){
            if(!Number.isNaN(option.camera.position.z*1)){
                camera.position.z = option.camera.position.z;
            }
            if(!Number.isNaN(option.camera.position.x*1)){
                camera.position.x = option.camera.position.x;
            }
            if(!Number.isNaN(option.camera.position.y*1)){
                camera.position.y = option.camera.position.y;
            }
        }
        

        

        //创建渲染器
        var renderer = this.renderer = new THREE.WebGLRenderer();
        //设置渲染分辨率，如果需要尺寸不变，分辨率降低，需要传入第三个参数 false
        renderer.setSize( option.renderer.width, option.renderer.height );



        var geometry = new THREE.BoxBufferGeometry( 10, 10, 10 );

        var genMesh = function(item){
            var _o = $.extend(true,{},meshDefaultOption,item);
            var material = new THREE[_o.material.type](_o.material);
            
            //var geometry = new THREE[_o.geometry.type](_o.geometry.width,_o.geometry.height,_o.geometry.depth);
            var mesh = new THREE.Mesh(geometry,material);
            if(item.position){
                mesh.position.x = _o.position.x;
                mesh.position.y = _o.position.y;
                mesh.position.z = _o.position.z;
            }
            if(item.rotation){
                mesh.rotation.x = _o.rotation.x;
                mesh.rotation.y = _o.rotation.y;
                mesh.rotation.z = _o.rotation.z;
            }
            item.scalar&&mesh.scale.setScalar(item.scalar);
            
            return mesh;
        }
        var add = function(target,item){
            if(Object.prototype.toString.call(item)=="[object Array]"){
                for(var i =0;i<item.length;i++){
                    arguments.callee(target,item[i])
                }
                return;
            }else if(item.type == "Group"){
                var group = new THREE.Group();
                scene.add(group);
                arguments.callee(group,item.children)
                return 
            } else if(item.type == "Mesh"){
                scene.add(genMesh(item));
            }
        }

        //对象
        option.objects && add(this.scene,option.objects);

        //灯光
        if(option.lights){
            for(var i=0;i<option.lights.length;i++){
                scene.add(new THREE[option.lights[i].type]())
            }
        }

        // 加入手机操控
        var controls = this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.minDistance = 1;
        controls.maxDistance = 5000;

        /*
        '默认': SSAOPass.OUTPUT.Default,
        'SSAO Only': SSAOPass.OUTPUT.SSAO,
        'SSAO Only + Blur': SSAOPass.OUTPUT.Blur,
        'Beauty': SSAOPass.OUTPUT.Beauty,
        'Depth': SSAOPass.OUTPUT.Depth,
        'Normal': SSAOPass.OUTPUT.Normal
        */

        if(option.SSAO){
            var composer = this.composer = new THREE.EffectComposer( this.renderer );
            var ssaoPass = this.ssaoPass = new THREE.SSAOPass( scene, camera, window.innerWidth, window.innerHeight );
            ssaoPass.kernelRadius = 20;
            ssaoPass.output= parseInt(THREE.SSAOPass.OUTPUT.SSAO);
            composer.addPass( ssaoPass );
            ssaoPass.kernelRadius=32;
            ssaoPass.minDistance=0.02;
            ssaoPass.maxDistance=0.3;


            // Init gui
            var gui = new GUI();

            gui.add( ssaoPass, 'output', {
                '默认': SSAOPass.OUTPUT.Default,
                'SSAO Only': SSAOPass.OUTPUT.SSAO,
                'SSAO Only + Blur': SSAOPass.OUTPUT.Blur,
                'Beauty': SSAOPass.OUTPUT.Beauty,
                'Depth': SSAOPass.OUTPUT.Depth,
                'Normal': SSAOPass.OUTPUT.Normal
            } ).onChange( function ( value ) {
                ssaoPass.output = parseInt( value );

            } );
            gui.add( ssaoPass, 'kernelRadius' ).min( 0 ).max( 32 );
            gui.add( ssaoPass, 'minDistance' ).min( 0.001 ).max( 0.02 );
            gui.add( ssaoPass, 'maxDistance' ).min( 0.01 ).max( 0.3 );
        }

        
        var animate = ()=> {
            requestAnimationFrame( animate );
            renderer.render( scene, camera );
            this.composer&&this.composer.render();
        }
        animate();
    }
    TC.prototype.render = function(target){

        //添加dom到页面
        target.appendChild( this.renderer.domElement );
    }
    return TC
})