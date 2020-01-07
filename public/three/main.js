requirejs.config({
    paths: {
        "jquery":"/lib/jquery/jquery-1.12.4",
        "tc":"tc",
        "gui":"/lib/threejs/examples/js/libs/dat.gui.min",
        "THREE":"/lib/threejs/build/three",
        "OrbitControls":"/lib/threejs/examples/js/controls/OrbitControls",
        "CopyShader":"/lib/threejs/examples/js/shaders/CopyShader",
        "SimplexNoise":"/lib/threejs/examples/js/math/SimplexNoise",
        "EffectComposer":"/lib/threejs/examples/js/postprocessing/EffectComposer",
        "SSAOShader":"/lib/threejs/examples/js/shaders/SSAOShader",
        "ShaderPass":"/lib/threejs/examples/js/postprocessing/ShaderPass",
        "SSAOPass":"/lib/threejs/examples/js/postprocessing/SSAOPass"
    },
    shim:{
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