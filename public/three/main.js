requirejs.config({
    paths: {
        "text":"/lib/requirejs-text/text",
        "json":"/lib/requirejs-json/json",

        "jquery":"/lib/jquery/dist/jquery",
        "tc":"tc",
        "gui":"/lib/three/examples/js/libs/dat.gui.min",
        "THREEJS":"/lib/three/build/three",
        "THREE":"/three/THREEP",
        "TransformControls":"/lib/three/examples/js/controls/TransformControls",
        "ObjectLoader":"/lib/three/examples/js/loaders/ObjectLoader",
        "OrbitControls":"/lib/three/examples/js/controls/OrbitControls",
        "CopyShader":"/lib/three/examples/js/shaders/CopyShader",
        "SimplexNoise":"/lib/three/examples/js/math/SimplexNoise",
        "EffectComposer":"/lib/three/examples/js/postprocessing/EffectComposer",
        "SSAOShader":"/lib/three/examples/js/shaders/SSAOShader",
        "ShaderPass":"/lib/three/examples/js/postprocessing/ShaderPass",
        "SSAOPass":"/lib/three/examples/js/postprocessing/SSAOPass"
    },
    shim:{
        "TransformControls":{deps:["THREE"],exports:"window.THREE.TransformControls"},
        "CopyShader":{deps:["THREE"],exports:"window.THREE.CopyShader"},
        "OrbitControls":{deps:["THREE"],exports:"window.THREE.OrbitControls"},
        "SimplexNoise":{deps:["THREE"],exports:"window.THREE.SimplexNoise"},
        "EffectComposer":{deps:["THREE"],exports:"window.THREE.EffectComposer"},
        "SSAOShader":{deps:["THREE"],exports:"window.THREE.SSAOShader"},
        "ShaderPass":{deps:["THREE","EffectComposer"],exports:"window.THREE.ShaderPass"},
        "SSAOPass":{deps:["THREE","EffectComposer"],exports:"window.THREE.SSAOPass"}
    }
});
(function(){
    var controller = document.body.getAttribute("controller")
    controller&&requirejs([controller])
})();